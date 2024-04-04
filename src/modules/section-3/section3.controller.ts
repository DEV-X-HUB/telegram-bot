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
}

export default Section3Controller;
