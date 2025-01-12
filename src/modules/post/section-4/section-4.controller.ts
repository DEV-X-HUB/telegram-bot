import { deleteKeyboardMarkup, deleteMessageWithCallback } from '../../../utils/helpers/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../../utils/helpers/string';
import MainMenuController from '../../mainmenu/mainmenu.controller';

import Section4Formatter from './section-4.formatter';
const section4Formatter = new Section4Formatter();

class QuestionPostSection4Controller {
  constructor() {}

  async start(ctx: any) {
    await deleteKeyboardMarkup(ctx, section4Formatter.messages.categoriesPrompt);
    await ctx.reply(...section4Formatter.chooseOptionDislay());
    return ctx.wizard.next();
  }

  async chooseOption(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(section4Formatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) {
      ctx.scene.leave();
      return MainMenuController.onStart(ctx);
    }

    switch (callbackQuery.data) {
      case 'manufacture': {
        await deleteMessageWithCallback(ctx);
        ctx.scene.leave();
        return ctx.scene.enter('Post-Question-Section4-Manufacture');
      }
      case 'construction': {
        ctx.scene.leave();
        await deleteMessageWithCallback(ctx);
        return ctx.scene.enter('Post-Question-SectionB-Construction');
      }
      case 'chicken-farm': {
        ctx.scene.leave();
        await deleteMessageWithCallback(ctx);
        return ctx.scene.enter('Post-Question-Section4-Chicken-Farm');
      }
      default:
        return ctx.reply('Unknown option. Please choose a valid option.');
    }
  }
}

export default QuestionPostSection4Controller;
