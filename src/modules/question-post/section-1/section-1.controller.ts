import { areEqaul, isInMarkUPOption } from '../../../utils/constants/string';
import MainMenuController from '../../mainmenu/mainmenu.controller';

import Section1Formatter from './section-1.formatter';
const section1Formatter = new Section1Formatter();

class QuestionPostController {
  constructor() {}

  async start(ctx: any) {
    await ctx.reply(...section1Formatter.chooseOptionDislay());

    return ctx.wizard.next();
  }

  async chooseOption(ctx: any) {
    const option = ctx.message.text;
    console.log('option', option);
    if (areEqaul(option, 'back', true)) {
      // go back to the previous scene
      ctx.scene.leave();
      return MainMenuController.onStart(ctx);
    }

    if (isInMarkUPOption(option, section1Formatter.categories)) {
      switch (option) {
        case 'Section 1A': {
          ctx.scene.leave();
          return ctx.scene.enter('Post-Question-SectionA');
        }
        case 'Section 1B': {
          ctx.scene.leave();
          return ctx.scene.enter('Post-Question-SectionB');
        }
        case 'Section 1C': {
          ctx.scene.leave();
          return ctx.scene.enter('Post-Question-SectionC');
        }
        default:
          return ctx.reply('Unknown option. Please choose a valid option.');
      }
    }
  }
}

export default QuestionPostController;
