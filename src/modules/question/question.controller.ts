import { deleteMessageWithCallback, findSender } from '../../utils/constants/chat';
import { areEqaul } from '../../utils/constants/string';
import ProfileService from '../profile/profile.service';
import QuestionFormmatter from './question.formmater';
import { AnswerQuestionScene } from './question.scene';
import QuestionService from './question.service';
import { Context, Markup } from 'telegraf';
const questionService = new QuestionService();
const profileService = new ProfileService();
const questionFormmatter = new QuestionFormmatter();
const roundSize = 10;
class QuestionController {
  constructor() {}

  static async handleSearch(ctx: any) {
    const query = ctx?.update?.inline_query?.query;

    console.log(query, 'qury ');
    if (!query || query.trim() == '') return;
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
    const sender = findSender(ctx);
    const [_, questionId] = query.split('_');
    const { status, question } = await questionService.getQuestionById(questionId);
    if (!question || status == 'fail') return ctx.reply('error while');

    // const mediaGroup = question.photo.map((image) => ({
    //   media: image,
    //   type: 'photo',
    //   caption: 'Images uploaded with the Question',
    // }));
    // await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);
    // await ctx.replyWithHTML(...questionFormmatter.formatSingleQuestion(question, true));
    // await ctx.reply(
    //   // add copy sticker
    //   'Send me your answer   \n\n`Note that you can send your answer through voice, or you could send your answer with media(photo, video, audio)`',
    //   {
    //     reply_markup: {
    //       keyboard: [[{ text: 'cancel' }]],
    //       resize_keyboard: true,
    //     },
    //     parse_mode: 'Markdown',
    //   },
    // );

    ctx.replyWithMarkdown(' selected ');
    ctx.scene.enter('answer_scene');
    ctx.session.usersSession = {
      [sender.id]: { questionId },
    };
  }
  static async AnswerQuestion(ctx: any) {
    const sender = findSender(ctx);
    const userSesion = ctx.session.usersSession[sender.id];
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'cancel', true)) {
      ctx.scene.enter('start');
    }
    const questionId = userSesion.questionId;
    if (!questionId) {
      ctx.replyWithMarkdown('No question selected ');
      ctx.replyWithMarkdown('No question selected ');
      ctx.scene.leave();
    }
    if (message.startsWith('/start')) return;
    const answer = message;
    ctx.wizard.state.answer = answer;
    const user = await profileService.getProfileByTgId(sender.id);
    if (user) ctx.replyWithHTML(...questionFormmatter.formatAnswerPreview(answer, user), { parse_mode: 'HTML' });
    return ctx.wizard.next();
  }
  static async AnswerQuestionPreview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    const message = ctx.message.text;

    if (message && areEqaul(message, 'cancel', true)) {
      return ctx.reply('canceled ');
    }
    if (!callbackQuery) return ctx.reply(questionFormmatter.messages.useButtonError);

    switch (callbackQuery.data) {
      case 'edit_answer': {
        return await ctx.reply(
          // add copy sticker
          'Send me your answer   \n\n`Note that you can send your answer through voice, or you could send your answer with media(photo, video, audio)`',
          {
            reply_markup: {
              keyboard: [[{ text: 'cancel' }]],
              resize_keyboard: true,
            },
            parse_mode: 'Markdown',
          },
        );
      }
      case 'cancel_answer': {
        deleteMessageWithCallback(ctx);
        return ctx.scene.enter('start');
      }
      case 'post_answer': {
        deleteMessageWithCallback(ctx);
        ctx.reply('answered');
        return ctx.scene.enter('start');
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
    console.log(query);
  }
  // static async listAllQuestionsOld(ctx: any, round: number = 1) {
  //   const { status, questions } = await questionService.geAlltQuestions();
  //   if (status == 'fail') return ctx.reply('error while');

  //   for (const question of questions) {
  //     const mediaGroup = question.photo.map((image) => ({
  //       media: image,
  //       type: 'photo',
  //       caption: 'Images uploaded with the Question',
  //     }));
  //     await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);
  //     await ctx.replyWithHTML(...questionFormmatter.formatSingleQuestion(question));
  //   }
  // }
  static async listAllQuestions(ctx: any, round: number = 1) {
    const { status, questions } = await questionService.geAlltQuestions();
    if (status == 'fail') return ctx.reply('error while');

    for (const question of questions) {
      return ctx.replyWithPhoto(question.photo[0] as any, {
        caption: questionFormmatter.getFormattedQuestionPreview(question),
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[{ text: 'View Detail', callback_data: `question_detail:${question.id}` }]],
        },
      });
    }
  }
  static async getQuestionDetail(ctx: any, questionId: string) {
    const { status, question } = await questionService.getQuestionById(questionId);
    if (status == 'fail' || !question) return ctx.reply('error while');

    const mediaGroup = question.photo.map((image) => ({
      media: image,
      type: 'photo',
      caption: 'Images uploaded with the Question',
    }));

    await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);
    await ctx.replyWithHTML(...questionFormmatter.formatQuestionDetail(question));
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
