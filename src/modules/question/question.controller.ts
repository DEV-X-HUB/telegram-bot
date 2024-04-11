import QuestionFormmatter from './question.formmater';
import QuestionService from './question.service';

import { Context } from 'telegraf';
const questionService = new QuestionService();
const questionFormmatter = new QuestionFormmatter();

const ressult = {
  type: 'article',
  id: '0',
  title: 'Hello guys here is my question 3',
  input_message_content: {
    message_text: '#tech\n\nWhat is the best programming language for beginners? \n\nBy: @username',
    parse_mode: 'Markdown',
    entities: [
      {
        type: 'bold',
        offset: 0,
        length: 10,
      },
    ],
  },
  reply_markup: {
    inline_keyboard: [questionFormmatter.questionOptionsButtons('id')],
  },
  description: 'Asked 1 month ago, 2 Answers',
};

class QuestionController {
  constructor() {}

  static async handleSearch(ctx: any) {
    const query = ctx?.update?.inline_query?.query;
    if (!query) return;
    const { status, questions } = await questionService.getQuestionsByDescription(query);
    if (status == 'fail') return await ctx.reply('unable to make search');
    ctx.scene.state.searchText = query;
    ctx.scene.state.questionsNumber = questions.length;

    if (questions.length == 0)
      return await ctx.answerInlineQuery(
        [...questionFormmatter.formatNoQuestionsErrorMessage()],
        questionFormmatter.seachQuestionTopBar(0),
      );
    return await ctx.answerInlineQuery(
      [...questionFormmatter.formatSearchQuestions(questions)],
      questionFormmatter.seachQuestionTopBar(questions.length),
    );
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
  static async searchByTitle() {}
}

export default QuestionController;
