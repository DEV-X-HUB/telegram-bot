import { deleteMessage, deleteMessageWithCallback } from '../../utils/constants/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../utils/constants/string';
import { questionPostValidator } from '../../utils/validator/question-post-validaor';
import PostingFormatter from './question-post.formatter';
import QuestionService from './question.service';
const postingFormatter = new PostingFormatter();

const imagesUploaded: any = [];

class QuestionPostController {
  constructor() {}

  async start(ctx: any) {
    ctx.reply(...postingFormatter.chooseOptionDisplay());
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
        ctx.reply(...postingFormatter.chooseOptionDisplay());
        return ctx.wizard.back();
      }
    }
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...postingFormatter.chooseOptionDisplay());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, postingFormatter.arBrOption)) {
      ctx.wizard.state.ar_br = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      await deleteMessage(ctx, {
        message_id: (parseInt(callbackQuery.message.message_id) - 1).toString(),
        chat_id: callbackQuery.message.chat.id,
      });
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
        ctx.reply(...postingFormatter.arBrOptionDisplay());
        return ctx.wizard.back();
      }
    }
    if (isInInlineOption(callbackQuery.data, postingFormatter.bIDiOption)) {
      ctx.wizard.state.bi_di = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...postingFormatter.lastDidtitPrompt());
      return ctx.wizard.next();
    }
    return ctx.reply('Unknown option. Please choose a valid option.');
  }
  async enterLastDigit(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...postingFormatter.bIDIOptionDisplay());
      return ctx.wizard.back();
    }

    const validationMessage = questionPostValidator('last_digit', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.last_digit = message;
    ctx.reply(...postingFormatter.locationPrompt());
    return ctx.wizard.next();
  }
  async enterLocation(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...postingFormatter.descriptionPrompt());
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
      ctx.reply(...postingFormatter.bIDIOptionDisplay());
      return ctx.wizard.back();
    }

    // const validationMessage = questionPostValidator('description', message);
    // if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.description = message;
    ctx.reply(...postingFormatter.photoPrompt());
    return ctx.wizard.next();
  }
  async attachPhoto(ctx: any) {
    // return ctx.reply(...postingFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });

    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...postingFormatter.bIDIOptionDisplay());
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...postingFormatter.photoPrompt());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length === 4) {
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);
      console.log(file);

      console.log('All images received');

      // send the images to the user
      // imagesUploaded.forEach(async (image: any) => {
      //   await ctx.replyWithPhoto(image);
      // });

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;
      ctx.wizard.state.status = 'previewing';
      ctx.reply('You have uploaded all the images successfully');

      // empty the images array
      imagesUploaded.length = 0;
      ctx.reply(...postingFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      ctx.reply(...postingFormatter.previewCallToAction());
      return ctx.wizard.next();
    }
  }
}

export default QuestionPostController;
