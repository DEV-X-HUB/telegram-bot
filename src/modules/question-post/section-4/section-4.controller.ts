import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../../utils/constants/string';

import Section4Formatter from './section-4.formatter';
const section4Formatter = new Section4Formatter();

class QuestionPostSection4Controller {
  constructor() {}

  async start(ctx: any) {
    await ctx.reply(...section4Formatter.chooseOptionDislay());

    return ctx.wizard.next();
  }

  async chooseOption(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(section4Formatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) return ctx.scene.enter('start');

    switch (callbackQuery.data) {
      case 'manufactory': {
        ctx.scene.leave();
        return ctx.scene.enter('Post-Question-Section4-Manufactor');
      }
      case 'construction': {
        ctx.scene.leave();
        return ctx.scene.enter('Post-Question-SectionB-Construction');
      }
      case 'chicken-farm': {
        ctx.scene.leave();
        return ctx.scene.enter('Post-Question-SectionC-Chicken-farm');
      }
      default:
        return ctx.reply('Unknown option. Please choose a valid option.');
    }
  }
}

export default QuestionPostSection4Controller;
