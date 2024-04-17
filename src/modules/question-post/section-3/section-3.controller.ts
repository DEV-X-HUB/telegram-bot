import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback } from '../../../utils/constants/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../../utils/constants/string';
import MainMenuController from '../../mainmenu/mainmenu.controller';

import Section3Formatter from './section-3.formatter';
const section3Formatter = new Section3Formatter();

let imagesUploaded: any[] = [];
const imagesNumber = 1;

class Section3Controller {
  constructor() {}
  async start(ctx: any) {
    ctx.wizard.state.category = 'Section3';
    await deleteKeyboardMarkup(ctx, 'choose an option');
    await ctx.reply(...section3Formatter.birthOrMaritalOptionDisplay());
    return ctx.wizard.next();
  }

  async chooseBirthOrMarital(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    // if the user is using the inline keyboard
    if (callbackQuery) {
      if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
        deleteMessageWithCallback(ctx);

        // leave this scene a
        ctx.scene.leave();
        return MainMenuController.onStart(ctx);
      }

      if (isInInlineOption(callbackQuery.data, section3Formatter.birthOrMaritalOption)) {
        ctx.wizard.state.birth_or_marital = callbackQuery.data;
        deleteMessageWithCallback(ctx);
        ctx.reply(...section3Formatter.titlePrompt());
        return ctx.wizard.next();
      }
    } else {
      await ctx.reply(...section3Formatter.displayError());
      // stay on the same step
      // return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
  }

  async enterTitle(ctx: any) {
    const message = ctx.message.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section3Formatter.birthOrMaritalOptionDisplay());
      return ctx.wizard.back();
    }

    ctx.wizard.state.title = message;
    await ctx.reply(...section3Formatter.descriptionPrompt());
    return ctx.wizard.next();
  }

  async enterDescription(ctx: any) {
    const message = ctx.message.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section3Formatter.birthOrMaritalOptionDisplay());
      return ctx.wizard.back();
    }

    ctx.wizard.state.description = message;
    await ctx.reply(...section3Formatter.photoPrompt());
    return ctx.wizard.next();
  }

  async attachPhoto(ctx: any) {
    console.log('being received');

    const message = ctx?.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section3Formatter.descriptionPrompt());
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section3Formatter.photoPrompt());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length == imagesNumber) {
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);
      // console.log(file);

      const mediaGroup = imagesUploaded.map((image: any) => ({
        media: image,
        type: 'photo',
        caption: image == imagesUploaded[0] ? 'Here is the image you uploaded' : '',
      }));

      await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;
      ctx.wizard.state.status = 'previewing';

      // empty the images array
      imagesUploaded = [];
      ctx.reply(...section3Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      //   ctx.reply(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      //   ctx.reply(...postingFormatter.previewCallToAction());
      return ctx.wizard.next();
    }
  }

  async preview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    console.log('here is the callback');

    console.log(callbackQuery);

    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...section3Formatter.photoPrompt(), section3Formatter.goBackButton());
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
          ctx.reply(...section3Formatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }

        case 'editing_done': {
          // await deleteMessageWithCallback(ctx);
          await ctx.reply(section3Formatter.preview(state));
          return ctx.wizard.back();
        }

        case 'post_data': {
          console.log('here you are');
          // api request to post the data
          // const response = await QuestionService.createQuestionPost(ctx.wizard.state, callbackQuery.from.id);
          // console.log(response);

          // if (response?.success) {
          //   await deleteMessageWithCallback(ctx);
          await deleteMessageWithCallback(ctx);
          await ctx.reply(...section3Formatter.postingSuccessful());
          ctx.scene.leave();
          return MainMenuController.onStart(ctx);
          // } else {
          //   ctx.reply(...postingFormatter.postingError());
          //   if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
          //     await deleteMessageWithCallback(ctx);
          //     return ctx.scene.enter('start');
          //   }

          // increment the registration attempt
          // return (ctx.wizard.state.postingAttempt = ctx.wizard.state.postingAttempt
          //   ? parseInt(ctx.wizard.state.postingAttempt) + 1
          //   : 1);
        }
      }
      // default: {
      //   await ctx.reply('DEFAULT');
      // }
    }
  }
  async editData(ctx: any) {
    const state = ctx.wizard.state;
    const fileds = ['birth_or_marital', 'title', 'description', 'photo', 'cancel'];
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
      return ctx.reply(...section3Formatter.editPreview(state), { parse_mode: 'HTML' });
    }

    // if callback exists
    // save the mesage id for later deleting
    ctx.wizard.state.previousMessageData = {
      message_id: ctx.callbackQuery.message.message_id,
      chat_id: ctx.callbackQuery.message.chat.id,
    };
    const callbackMessage = callbackQuery.data;

    if (callbackMessage == 'post_data') {
      console.log('Posted Successfully');
      return ctx.reply(...section3Formatter.postingSuccessful());
      // registration
      // api call for registration
      // const response = await QuestionService.createQuestionPost(ctx.wizard.state, callbackQuery.from.id);

      // if (response.success) {
      //   ctx.wizard.state.status = 'pending';
      //   await deleteMessageWithCallback(ctx);
      //   await ctx.reply(...postingFormatter.postingSuccessful());
      //   return ctx.scene.enter('start');
      // }

      const registrationAttempt = parseInt(ctx.wizard.state.registrationAttempt);

      // ctx.reply(...postingFormatter.postingError());
      if (registrationAttempt >= 2) {
        ctx.scene.leave();
        return MainMenuController.onStart(ctx);
      }
      return (ctx.wizard.state.registrationAttempt = registrationAttempt ? registrationAttempt + 1 : 1);
    } else if (callbackMessage == 'editing_done') {
      // await deleteMessageWithCallback(ctx);

      await ctx.reply(...section3Formatter.preview(state));
      return ctx.wizard.back();
    }

    if (fileds.some((filed) => filed == callbackQuery.data)) {
      // selecting field to change
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );
      await ctx.reply(...((await section3Formatter.editFieldDisplay(callbackMessage)) as any));
      if (areEqaul(callbackQuery.data, 'photo', true)) return ctx.wizard.next();
      return;
    }

    if (editField) {
      //  if edit filed is selected

      ctx.wizard.state[editField] = callbackMessage;
      await deleteMessageWithCallback(ctx);
      ctx.wizard.state.editField = null;
      return ctx.reply(...section3Formatter.editPreview(state), { parse_mode: 'HTML' });
    }
  }

  async editPhoto(ctx: any) {
    const messageText = ctx.message?.text;
    if (messageText && areEqaul(messageText, 'back', true)) {
      await deleteMessage(ctx, {
        message_id: (parseInt(messageText.message_id) - 1).toString(),
        chat_id: messageText.chat.id,
      });
      ctx.reply(...section3Formatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section3Formatter.photoPrompt());

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
      ctx.reply(...section3Formatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }
  }
}

export default Section3Controller;
