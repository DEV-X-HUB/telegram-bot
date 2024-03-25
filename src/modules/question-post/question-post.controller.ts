import config from '../../config/config';
import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback } from '../../utils/constants/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../utils/constants/string';

import PostingFormatter from './question-post.formatter';
import QuestionService from './question.service';
const postingFormatter = new PostingFormatter();

class QuestionPostController {
  imagesUploaded: any[];
  imageNumber: number;

  constructor() {
    this.imagesUploaded = [];
    this.imageNumber = parseInt(config.upload_image_number || '4');
  }

  async start(ctx: any) {
    ctx.reply(...postingFormatter.chooseOptionDisplayString(), ...postingFormatter.chooseOptionDisplay());
    // ctx.reply(...postingFormatter.photoPrompt());
    return ctx.wizard.next();
  }

  async chooseOption(ctx: any) {
    const option = ctx.message.text;

    if (areEqaul(option, 'back', true)) {
      // go back to the previous scene
      return ctx.scene.enter('start');
    }

    if (isInMarkUPOption(option, postingFormatter.categories)) {
      ctx.wizard.state.category = option;
      console.log(option);
      await deleteMessage(ctx, {
        message_id: (parseInt(ctx.message.message_id) - 1).toString(),
        chat_id: ctx.message.chat.id,
      });
      await deleteKeyboardMarkup(ctx);
      ctx.reply(...postingFormatter.chooseOptionString());
      ctx.reply(...postingFormatter.arBrOptionDisplay());

      return ctx.wizard.next();
    } else {
      return ctx.reply('Unknown option. Please choose a valid option.');
    }
  }
  async arBrOption(ctx: any) {
    const message = ctx.message?.text;
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      if (message && areEqaul(message, 'back', true)) {
        ctx.reply(...postingFormatter.chooseOptionDisplayString(), ...postingFormatter.chooseOptionDisplay());
        return ctx.wizard.back();
      }
    }
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...postingFormatter.chooseOptionDisplayString(), ...postingFormatter.chooseOptionDisplay());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, postingFormatter.arBrOption)) {
      ctx.wizard.state.ar_br = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      // await deleteMessage(ctx, {
      //   message_id: (parseInt(callbackQuery.message.message_id) - 1).toString(),
      //   chat_id: callbackQuery.message.chat.id,
      // });
      ctx.reply(...postingFormatter.woredaListDisplay());
      return ctx.wizard.next();
    }
    return ctx.reply('Unknown option. Please choose a valid option.');
  }
  async choooseWoreda(ctx: any) {
    const message = ctx.message?.text;
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      if (message && areEqaul(message, 'back', true)) {
        ctx.reply(...postingFormatter.arBrOptionDisplay());
        return ctx.wizard.back();
      }
    }
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...postingFormatter.arBrOptionDisplay());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, postingFormatter.woredaList)) {
      ctx.wizard.state.woreda = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...postingFormatter.bIDIOptionDisplay());
      return ctx.wizard.next();
    }
    return ctx.reply('Unknown option. Please choose a valid option.');
  }
  async IDFirstOption(ctx: any) {
    const message = ctx.message?.text;
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      if (message && areEqaul(message, 'back', true)) {
        ctx.reply(...postingFormatter.woredaListDisplay());
        return ctx.wizard.back();
      }
      return ctx.reply('Unknown option. Please use buttons to choose .');
    }
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...postingFormatter.woredaListDisplay());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, postingFormatter.bIDiOption)) {
      ctx.wizard.state.bi_di = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...postingFormatter.lastDidtitPrompt());
      return ctx.wizard.next();
    }
  }
  async enterLastDigit(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...postingFormatter.bIDIOptionDisplay());
      return ctx.wizard.back();
    }

    // const validationMessage = questionPostValidator('last_digit', message);
    // if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.last_digit = message;
    ctx.reply(...postingFormatter.locationPrompt());
    return ctx.wizard.next();
  }
  async enterLocation(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...postingFormatter.lastDidtitPrompt());
      return ctx.wizard.back();
    }

    // assign the location to the state
    ctx.wizard.state.location = message;
    await ctx.reply(...postingFormatter.descriptionPrompt());
    return ctx.wizard.next();
  }
  async enterDescription(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...postingFormatter.locationPrompt());
      return ctx.wizard.back();
    }

    // const validationMessage = questionPostValidator('description', message);
    // if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.description = message;
    ctx.reply(...postingFormatter.photoPrompt());
    return ctx.wizard.next();
  }
  async attachPhoto(ctx: any) {
    console.log(' being received');
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...postingFormatter.bIDIOptionDisplay());
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...postingFormatter.photoPrompt());

    // Add the image to the array
    this.imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (this.imagesUploaded.length == this.imageNumber) {
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);
      console.log(file);

      const mediaGroup = this.imagesUploaded.map((image: any) => ({
        media: image,
        type: 'photo',
        caption: image == this.imagesUploaded[0] ? 'Here are the images you uploaded' : '',
      }));

      await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);

      // Save the images to the state
      // ctx.wizard.state.photo = this.imagesUploaded;

      // copy the images to the state
      ctx.wizard.state.photo = this.imagesUploaded;

      ctx.wizard.state.status = 'previewing';

      // // empty the images array
      // this.imagesUploaded = [];
      ctx.reply(...postingFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      ctx.reply(...postingFormatter.previewCallToAction());
      // return ctx.wizard.next();
    }
  }
  async editPost(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...postingFormatter.photoPrompt(), postingFormatter.goBackButton());
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
          ctx.reply(...postingFormatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }
        case 'post_data': {
          // api request to post the data
          const response = await QuestionService.createQuestionPost(ctx.wizard.state, callbackQuery.from.id);
          console.log(response);

          if (response?.success) {
            await deleteMessageWithCallback(ctx);
            ctx.reply(...postingFormatter.postingSuccessful());
            return ctx.scene.enter('start');
          } else {
            ctx.reply(...postingFormatter.postingError());
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
      return ctx.reply(...postingFormatter.editPreview(state), { parse_mode: 'HTML' });
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
        await ctx.reply(...postingFormatter.postingSuccessful());
        return ctx.scene.enter('start');
      }

      const registrationAttempt = parseInt(ctx.wizard.state.registrationAttempt);

      // ctx.reply(...postingFormatter.postingError());
      if (registrationAttempt >= 2) {
        await deleteMessageWithCallback(ctx);
        return ctx.scene.enter('start');
      }
      return (ctx.wizard.state.registrationAttempt = registrationAttempt ? registrationAttempt + 1 : 1);
    }

    if (fileds.some((filed) => filed == callbackQuery.data)) {
      // selecting field to change
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );
      await ctx.reply(...((await postingFormatter.editFieldDispay(callbackMessage)) as any));
      if (areEqaul(callbackQuery.data, 'photo', true)) return ctx.wizard.next();
      return;
    }

    if (editField) {
      //  if edit filed is selected

      ctx.wizard.state[editField] = callbackMessage;
      await deleteMessageWithCallback(ctx);
      ctx.wizard.state.editField = null;
      return ctx.reply(...postingFormatter.editPreview(state), { parse_mode: 'HTML' });
    }
  }
  async editPhoto(ctx: any) {
    const messageText = ctx.message?.text;
    if (messageText && areEqaul(messageText, 'back', true)) {
      await deleteMessage(ctx, {
        message_id: (parseInt(messageText.message_id) - 1).toString(),
        chat_id: messageText.chat.id,
      });
      ctx.reply(...postingFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...postingFormatter.photoPrompt());

    // Add the image to the array
    this.imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (this.imagesUploaded.length === this.imageNumber) {
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);

      const mediaGroup = this.imagesUploaded.map((image: any) => ({
        media: image,
        type: 'photo',
        caption: image == this.imagesUploaded[0] ? 'Here are the images you uploaded' : '',
      }));

      await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);

      // Save the images to the state
      ctx.wizard.state.photo = this.imagesUploaded;

      // empty the images array
      this.imagesUploaded.length = 0;
      ctx.reply(...postingFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }
  }
}

export default QuestionPostController;
