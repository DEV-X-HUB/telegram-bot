import QuestionFormmatter from './question.formmater';
import QuestionService from './question.service';
import { Context, Markup } from 'telegraf';
const questionService = new QuestionService();
const questionFormmatter = new QuestionFormmatter();
const roundSize = 10;
class QuestionController {
  constructor() {}

  static async handleSearch(ctx: any) {
    const query = ctx?.update?.inline_query?.query;
    if (!query) return;
    const { status, questions } = await questionService.getQuestionsByDescription(query);
    if (status == 'fail') return await ctx.reply('unable to make search');

    if (questions.length == 0)
      return await ctx.answerInlineQuery([...questionFormmatter.formatNoQuestionsErrorMessage()], {
        button: questionFormmatter.seachQuestionTopBar(0, query),
      });

    return await ctx.answerInlineQuery([...questionFormmatter.formatSearchQuestions(questions)], {
      button: questionFormmatter.seachQuestionTopBar(questions.length, query),
      cache_time: 0,
    });
  }
  static async handleAnswerBrowseQuery(ctx: any, query: string) {
    if (query.startsWith('answer')) {
      const [_, questionId] = query.split('_');

      // get question data from the answerinlinequery
      const questionData = {
        questionId: '0',
        question: 'Hello guys here is my question 3',
        questionText: '#tech\n\nWhat is the best programming language for beginners? \n\nBy: @username',
        description: 'Asked 1 month ago, 2 Answers',
      };
      await ctx.reply(`${questionData.questionText}`, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Browse', callback_data: 'browse' },
              { text: 'Subscribe', callback_data: 'subscribe' },
            ],
          ],
        },
      });
      return await ctx.reply(
        // add copy sticker
        'Send me your answer   \n\n`Note that you can send your answer through voice, or you could send your answer with media(photo, video, audio)`',
        {
          reply_markup: {
            keyboard: [[{ text: 'Back' }]],
            resize_keyboard: true,
          },
          parse_mode: 'Markdown',
        },
      );
    }
    if (query.startsWith('browse')) {
      return await ctx.reply('Browse');
    }
  }
  static async handleAnswerQuery(ctx: any, query: string) {
    console.log(query);
  }
  static async handleBrowseQuery(ctx: any, query: string) {
    if (query) {
      if (query.startsWith('answer')) {
        const [_, questionId] = query.split('_');
        console.log(questionId, 'iddd');
        // get question data from the answerinlinequery
        const questionData = {
          questionId: '0',
          question: 'Hello guys here is my question 3',
          questionText: '#tech\n\nWhat is the best programming language for beginners? \n\nBy: @username',
          description: 'Asked 1 month ago, 2 Answers',
        };

        return await ctx.reply(
          // add copy sticker
          'Send me your answer   \n\n`Note that you can send your answer through voice, or you could send your answer with media(photo, video, audio)`',
          {
            reply_markup: {
              keyboard: [[{ text: 'Back' }]],
              resize_keyboard: true,
            },
            parse_mode: 'Markdown',
          },
        );
      }
      if (query === 'browse') {
        return await ctx.reply('Browse');
      }
    }
  }
  static async handleSubscribeQuery(ctx: any, query: string) {
    if (query) {
      if (query.startsWith('answer')) {
        const [_, questionId] = query.split('_');
        console.log(questionId, 'iddd');
        // get question data from the answerinlinequery
        const questionData = {
          questionId: '0',
          question: 'Hello guys here is my question 3',
          questionText: '#tech\n\nWhat is the best programming language for beginners? \n\nBy: @username',
          description: 'Asked 1 month ago, 2 Answers',
        };

        return await ctx.reply(
          // add copy sticker
          'Send me your answer   \n\n`Note that you can send your answer through voice, or you could send your answer with media(photo, video, audio)`',
          {
            reply_markup: {
              keyboard: [[{ text: 'Back' }]],
              resize_keyboard: true,
            },
            parse_mode: 'Markdown',
          },
        );
      }
      if (query === 'browse') {
        return await ctx.reply('Browse');
      }
    }
  }
  static async listAllQuestions(ctx: any, round: number = 1) {
    const { status, questions } = await questionService.geAlltQuestions();
    if (status == 'fail') return ctx.reply('error while');

    for (const question of questions) {
      const mediaGroup = question.photo.map((image) => ({
        media: image,
        type: 'photo',
        caption: 'Images uploaded with the Question',
      }));
      await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);
      await ctx.replyWithHTML(...questionFormmatter.formatSingleQuestion(question));
    }
  }
  static displayAllPromptFomatter = (ctx: any, questionsNumber: any, searchString: string) => {
    return ctx.reply(...questionFormmatter.displayAllPromptFomatter(questionsNumber, searchString), {
      parse_mode: 'HTML',
    });
  };
  static async searchByTitle() {
    const { status, questions } = await questionService.geAlltQuestions();
  }
}

export default QuestionController;
