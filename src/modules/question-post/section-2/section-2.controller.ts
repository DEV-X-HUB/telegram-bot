import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback } from '../../../utils/constants/chat';
import { areEqaul, isInInlineOption } from '../../../utils/constants/string';

import QuestionPostSectionBFormatter from './section-2.formatter';
import QuestionService from '../question-post.service';
import { questionPostValidator } from '../../../utils/validator/question-post-validaor';
const questionPostSectionBFormatter = new QuestionPostSectionBFormatter();

let imagesUploaded: any[] = [];
const imagesNumber = 1;

class QuestionPostSectionBController {
  constructor() {}

  async start(ctx: any) {
    await deleteKeyboardMarkup(ctx, questionPostSectionBFormatter.messages.typePrompt);
    ctx.reply(...questionPostSectionBFormatter.typeOptionsDisplay());

    return ctx.wizard.next();
  }

  async chooseType(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(questionPostSectionBFormatter.messages.useButtonError);

    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) return ctx.scene.enter('Post Questions');

    if (isInInlineOption(callbackQuery.data, questionPostSectionBFormatter.typeOptions)) {
      ctx.wizard.state.type = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...questionPostSectionBFormatter.enterTiteDisplay());
      return ctx.wizard.next();
    }
    ctx.reply('unkown option');
  }

  async enterTitle(ctx: any) {
    const text = ctx.message.text;

    if (areEqaul(text, 'back', true)) {
      await deleteKeyboardMarkup(ctx, questionPostSectionBFormatter.messages.typePrompt);
      ctx.reply(...questionPostSectionBFormatter.typeOptionsDisplay());
      return ctx.wizard.back();
    }
    ctx.wizard.state.title = text;
    ctx.reply(...questionPostSectionBFormatter.enterDescriptionDisplay());
    return ctx.wizard.next();
  }

  async enterDescription(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...questionPostSectionBFormatter.enterTiteDisplay());
      return ctx.wizard.back();
    }

    const validationMessage = questionPostValidator('description', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.description = message;
    ctx.reply(...questionPostSectionBFormatter.photoPrompt());
    return ctx.wizard.next();
  }
  async attachPhoto(ctx: any) {
    console.log(' being received');
    const message = ctx?.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...questionPostSectionBFormatter.enterDescriptionDisplay());
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...questionPostSectionBFormatter.photoPrompt());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length == imagesNumber) {
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);
      // console.log(file);

      const mediaGroup = imagesUploaded.map((image: any) => ({
        media: image,
        type: 'photo',
        caption: image == imagesUploaded[0] ? 'Here are the images you uploaded' : '',
      }));

      await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;
      ctx.wizard.state.status = 'previewing';

      // empty the images array
      imagesUploaded = [];
      ctx.reply(...questionPostSectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      ctx.reply(...questionPostSectionBFormatter.previewCallToAction());
      return ctx.wizard.next();
    }
  }
  async editPost(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    console.log('here is the callback');

    console.log(callbackQuery);

    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...questionPostSectionBFormatter.photoPrompt(), questionPostSectionBFormatter.goBackButton());
        return ctx.wizard.back();
      }
      await ctx.reply('....');
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'preview_edit': {
          console.log('preview edit');
          ctx.wizard.state.editField = null;
          await deleteMessageWithCallback(ctx);
          ctx.reply(...questionPostSectionBFormatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }

        // case 'editing_done': {
        //   // await deleteMessageWithCallback(ctx);
        //   await ctx.reply(questionPostSectionBFormatter.preview(state));
        //   return ctx.wizard.back();
        // }

        case 'post_data': {
          console.log('here you are');
          // api request to post the data
          const response = await QuestionService.createQuestionPost(ctx.wizard.state, callbackQuery.from.id);
          console.log(response);

          if (response?.success) {
            await deleteMessageWithCallback(ctx);
            ctx.reply(...questionPostSectionBFormatter.postingSuccessful());
            return ctx.scene.enter('start');
          } else {
            ctx.reply(...questionPostSectionBFormatter.postingError());
            if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
              await deleteMessageWithCallback(ctx);
              return ctx.scene.enter('start');
            }

            // increment the registration attempt
            return (ctx.wizard.state.postingAttempt = ctx.wizard.state.postingAttempt
              ? parseInt(ctx.wizard.state.postingAttempt) + 1
              : 1);
          }
        }
        default: {
          await ctx.reply('DEFAULT');
        }
      }
    }
  }

  async editData(ctx: any) {
    const state = ctx.wizard.state;
    const fileds = ['ar_br', 'bi_di', 'woreda', 'last_digit', 'location', 'description', 'photo', 'cancel'];
    const callbackQuery = ctx?.callbackQuery;
    const editField = ctx.wizard.state?.editField;
    if (!callbackQuery) {
      // changing field value
      const messageText = ctx.message.text;
      if (!editField) return await ctx.reply('invalid input ');

      // const validationMessage = questionPostValidator(ctx.wizard.state.editField, ctx.message.text);
      // if (validationMessage != 'valid') return await ctx.reply(validationMessage);

      ctx.wizard.state[editField] = messageText;
      await deleteKeyboardMarkup(ctx);
      // await deleteMessage(ctx, {
      //   message_id: (parseInt(ctx.message.message_id) - 1).toString(),
      //   chat_id: ctx.message.chat.id,
      // });
      return ctx.reply(...questionPostSectionBFormatter.editPreview(state), { parse_mode: 'HTML' });
    }

    // if callback exists
    // save the mesage id for later deleting
    ctx.wizard.state.previousMessageData = {
      message_id: ctx.callbackQuery.message.message_id,
      chat_id: ctx.callbackQuery.message.chat.id,
    };
    const callbackMessage = callbackQuery.data;

    if (callbackMessage == 'post_data') {
      // registration
      // api call for registration
      const response = await QuestionService.createQuestionPost(ctx.wizard.state, callbackQuery.from.id);

      if (response.success) {
        ctx.wizard.state.status = 'pending';
        await deleteMessageWithCallback(ctx);
        await ctx.reply(...questionPostSectionBFormatter.postingSuccessful());
        return ctx.scene.enter('start');
      }

      const registrationAttempt = parseInt(ctx.wizard.state.registrationAttempt);

      // ctx.reply(...questionPostSectionBFormatter.postingError());
      if (registrationAttempt >= 2) {
        await deleteMessageWithCallback(ctx);
        return ctx.scene.enter('start');
      }
      return (ctx.wizard.state.registrationAttempt = registrationAttempt ? registrationAttempt + 1 : 1);
    } else if (callbackMessage == 'editing_done') {
      // await deleteMessageWithCallback(ctx);

      await ctx.reply(...questionPostSectionBFormatter.preview(state));
      return ctx.wizard.back();
    }

    if (fileds.some((filed) => filed == callbackQuery.data)) {
      // selecting field to change
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );
      await ctx.reply(...((await questionPostSectionBFormatter.editFieldDispay(callbackMessage)) as any));
      if (areEqaul(callbackQuery.data, 'photo', true)) return ctx.wizard.next();
      return;
    }

    if (editField) {
      //  if edit filed is selected

      ctx.wizard.state[editField] = callbackMessage;
      await deleteMessageWithCallback(ctx);
      ctx.wizard.state.editField = null;
      return ctx.reply(...questionPostSectionBFormatter.editPreview(state), { parse_mode: 'HTML' });
    }
  }
  async editPhoto(ctx: any) {
    const messageText = ctx.message?.text;
    if (messageText && areEqaul(messageText, 'back', true)) {
      await deleteMessage(ctx, {
        message_id: (parseInt(messageText.message_id) - 1).toString(),
        chat_id: messageText.chat.id,
      });
      ctx.reply(...questionPostSectionBFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...questionPostSectionBFormatter.photoPrompt());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length === imagesNumber) {
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);

      const mediaGroup = imagesUploaded.map((image: any) => ({
        media: image,
        type: 'photo',
        caption: image == imagesUploaded[0] ? 'Here are the images you uploaded' : '',
      }));

      await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;

      // empty the images array
      // imagesUploaded.length = 0;
      ctx.reply(...questionPostSectionBFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }
  }
}

export default QuestionPostSectionBController;
