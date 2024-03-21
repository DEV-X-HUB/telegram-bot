import { deleteMessageWithCallback } from '../../utils/constants/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../utils/constants/string';
import PostingFormatter from './question-post.formatter';
const postingFormatter = new PostingFormatter();

class QuestionPostController {
  constructor() {}

  async start(ctx: any) {
    ctx.reply(...postingFormatter.chooseOptionDisplay());
    return ctx.wizard.next();
  }

  async chooseOption(ctx: any) {
    const option = ctx.message.text;
    // console.log(`the option is ${option}`);

    if (areEqaul(option, 'back', true)) {
      // go back to the previous scene
      return ctx.scene.enter('start');
    }

    if (isInMarkUPOption(option, postingFormatter.categories)) {
      ctx.wizard.state.category = option;
      ctx.reply('Keep Going... ', postingFormatter.goBackButton());
      ctx.reply(...postingFormatter.arBrOptionDisplay());
      return ctx.wizard.next();
    } else {
      return ctx.reply('Unknown option. Please choose a valid option.');
    }
  }
  async arBrOption(ctx: any) {
    const messsage = ctx.message?.text;
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      if (messsage && areEqaul(messsage, 'back', true)) {
        ctx.reply(...postingFormatter.arBrOptionDisplay());
        return ctx.wizard.back();
      }
    }
    if (isInInlineOption(callbackQuery.data, postingFormatter.arBrOption)) {
      ctx.wizard.state.arBrVAlue = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...postingFormatter.woredaListDisplay());
      return ctx.wizard.next();
    }
    return ctx.reply('Unknown option. Please choose a valid option.');
  }
  async choooseWoreda(ctx: any) {
    const messsage = ctx.message?.text;
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      if (messsage && areEqaul(messsage, 'back', true)) {
        ctx.reply(...postingFormatter.arBrOptionDisplay());
        return ctx.wizard.back();
      }
    }
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      ctx.reply(...postingFormatter.arBrOptionDisplay());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, postingFormatter.woredaList)) {
      ctx.wizard.state.woreda = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      console.log(ctx.wizard.state);
      return ctx.reply('nice');
      //   return ctx.wizard.next();
    }
    return ctx.reply('Unknown option. Please choose a valid option.');
  }
}

export default QuestionPostController;
