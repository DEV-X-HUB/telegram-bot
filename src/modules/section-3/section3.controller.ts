import config from '../../config/config';
import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback } from '../../utils/constants/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../utils/constants/string';

import Section3Formatter from './section3.formatter';
const section3Formatter = new Section3Formatter();

let imagesUploaded: any[] = [];
const imagesNumber = 4;

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

        // leave this scene and go back to the previous scene
        ctx.scene.leave();
        return ctx.scene.enter('Post Questions');
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
        caption: image == imagesUploaded[0] ? 'Here are the images you uploaded' : '',
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
          await ctx.scene.leave();
          return ctx.scene.enter('start');
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
}

export default Section3Controller;
