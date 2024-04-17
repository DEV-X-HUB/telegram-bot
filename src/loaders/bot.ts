import { Telegraf, Context, session, Scenes } from 'telegraf';
import config from '../config/config';
import dbConnecion from './db-connecion';

import RegistrationScene from '../modules/registration/registration.scene';
import { checkAndRedirectToScene } from '../middleware/check-command';
import { checkUserInChannelandPromtJoin } from '../middleware/auth';
import MainmenuScene from '../modules/mainmenu/mainmenu.scene';
import QuestionPostScene from '../modules/question-post/question-post.scene';
import ProfileScene from '../modules/profile/profile.scene';
import { setCommands } from '../utils/helper/commands';
import SearchQuestionController from '../modules/question/question.controller';
import { checkCallBacks } from '../middleware/check-callback';

let bot: Telegraf<Context> | null = null;

export default () => {
  if (bot != null) return bot;
  bot = new Telegraf(config.bot_token as string);
  bot.telegram.setWebhook(`${config.domain}/secret-path`);
  const stage = new Scenes.Stage([RegistrationScene, MainmenuScene, ProfileScene, ...QuestionPostScene]);
  bot.use(checkCallBacks());
  bot.use(session());
  // bot.use(checkUserInChannelandPromtJoin());
  bot.use(stage.middleware());
  bot.use(checkAndRedirectToScene());

  // prefill text message on user input
  // ( switch_inline_query_current_chat: 'text' ) will prefill the text message on user input
  bot.command('start', async (ctx) => {
    const query = ctx.message.text.split(' ')[1];
    if (query) return SearchQuestionController.handleAnswerBrowseQuery(ctx, query);
  });

  // bot.on('inline_query', SearchQuestionController.handleSearch);

  //send images inside the message (InlineQueryResultPhoto)
  bot.on('inline_query', async (ctx) => {
    return ctx.answerInlineQuery([
      {
        type: 'photo',
        id: '1',
        title: 'photo',
        description: 'photo description',

        photo_url:
          'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/10/free-images.jpg',
        thumbnail_url:
          'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/10/free-images.jpg',
        // thumbnail_width: 50,
        // thumbnail_height: 50,

        // caption
        caption: 'Here is the image associated with the question',
        caption_entities: [
          {
            type: 'bold',
            offset: 0,
            length: 10,
          },
        ],
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Answer', callback_data: 'answer_qid' },
              { text: 'Browse', callback_data: 'browse_qid' },
            ],
          ],
        },
      },
    ]);
  });

  // // when user clicks on 'answer' button
  // bot.command('answer', async (ctx) => {
  //   return await ctx.reply('Answer');
  // });

  const commands = [
    { name: 'start', description: 'Start the bot' },
    { name: 'help', description: 'Display help' },
    { name: 'menu', description: 'Display main menu' },
    { name: 'register', description: 'Register to the bot' },
    { name: 'profile', description: 'View your profile' },
  ];
  setCommands(commands);
  dbConnecion;
  return bot;
};
