import { areEqaul, isInMarkUPOption } from '../../utils/constants/string';

import PostingFormatter from './question-post.formatter';
const postingFormatter = new PostingFormatter();

class QuestionPostController {
  constructor() {}

  async start(ctx: any) {
    await ctx.reply(...postingFormatter.chooseOptionDislay());

    return ctx.wizard.next();
  }

  async chooseOption(ctx: any) {
    const option = ctx.message.text;
    console.log('option', option);
    if (areEqaul(option, 'back', true)) {
      // go back to the previous scene
      return ctx.scene.enter('start');
    }

    if (isInMarkUPOption(option, postingFormatter.categories)) {
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
