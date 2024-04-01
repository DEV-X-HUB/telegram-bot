import config from '../../config/config';
import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback } from '../../utils/constants/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../utils/constants/string';

import Section1CFormatter from './section1c.formatter';
// import QuestionService from './question.service';
const section1cFormatter = new Section1CFormatter();

let imagesUploaded: any[] = [];
const imagesNumber = 4;

class Section1cController {
  constructor() {}

  async start(ctx: any) {
    ctx.wizard.state.category = 'Section1c';
    await ctx.reply(...section1cFormatter.choosePaperStampDisplay());

    return ctx.wizard.next();
  }

  async choosePaperTimeStamp(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    // if the user is using the inline keyboard
    if (callbackQuery) {
      if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
        deleteMessageWithCallback(ctx);
        ctx.reply(...section1cFormatter.choosePaperStampDisplay());
        return ctx.wizard.back();
      }

      if (isInInlineOption(callbackQuery.data, section1cFormatter.paperStampOption)) {
        ctx.wizard.state.paper_stamp = callbackQuery.data;
        deleteMessageWithCallback(ctx);
        ctx.reply(...section1cFormatter.arBrOptionDisplay());
        return ctx.wizard.next();
      }
    }

    // if the user is using the text message
    else {
      await ctx.reply(...section1cFormatter.paperTimestampError());
      // stay on the same step
      // return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
  }
}
export default Section1cController;
