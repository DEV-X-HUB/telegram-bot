import { deleteMessage, deleteMessageWithCallback } from '../../utils/constants/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../utils/constants/string';
import { questionPostValidator } from '../../utils/validator/question-post-validaor';
import PostingFormatter from './question-post.formatter';
const postingFormatter = new PostingFormatter();

class QuestionPostController {
  constructor() {}

  async start(ctx: any) {
    // ctx.reply(...postingFormatter.chooseOptionDisplayString(), ...postingFormatter.chooseOptionDisplay());
    ctx.reply(...postingFormatter.photoPrompt());
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
      ctx.wizard.state.arBrVAlue = callbackQuery.data;
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
      ctx.wizard.state.arBrVAlue = callbackQuery.data;
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

    ctx.wizard.state.location = message;
    ctx.reply(...postingFormatter.descriptionPrompt());
    return ctx.wizard.next();
  }
  async enterDescription(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...postingFormatter.bIDIOptionDisplay());
      return ctx.wizard.back();
    }

    const validationMessage = questionPostValidator('description', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.description = message;
    ctx.reply(...postingFormatter.photoPrompt());
    return ctx.wizard.next();
  }
  async attachPhoto(ctx: any) {
    const photo = ctx.message.photo[0];
    const fileId = photo.file_id;

    const photoUrl = 'https://example.com/your-photo.jpg';

    // Reply to the user with the photo
    await ctx.replyWithPhoto({ source: photoUrl });

    console.log(photo);
    // Get file information
    const file = await ctx.telegram.getFile(fileId);
    console.log(file);
    // Download the file
    const imageLink = file.file_path;

    // Send the photo
    // await ctx.telegram.sendPhoto(ctx.message.chat.id, { source: imageLink });

    // Here you can process the image link as needed
    console.log('Image received:', imageLink);
  }
}

export default QuestionPostController;