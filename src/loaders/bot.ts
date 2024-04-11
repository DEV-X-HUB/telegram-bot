import { Telegraf, Context, session, Scenes } from 'telegraf';
import config from '../config/config';
import dbConnecion from './db-connecion';

import RegistrationScene from '../modules/registration/registration.scene';
import { checkAndRedirectToScene } from '../middleware/check-command';
import { checkUserInChannelandPromtJoin } from '../middleware/auth';
import MainmenuScene from '../modules/mainmenu/mainmenu.scene';
import Service1Scene from '../modules/service1/service1.scene';
import QuestionPostScene from '../modules/question-post/question-post.scene';
import ProfileScene from '../modules/profile/profile.scene';
import { setCommands } from '../utils/helper/commands';

let bot: Telegraf<Context> | null = null;

export default () => {
  if (bot != null) return bot;
  bot = new Telegraf(config.bot_token as string);
  bot.telegram.setWebhook(`${config.domain}/secret-path`);
  const stage = new Scenes.Stage([RegistrationScene, MainmenuScene, Service1Scene, ProfileScene, ...QuestionPostScene]);
  bot.use(session());
  bot.use(stage.middleware());
  bot.use(checkUserInChannelandPromtJoin());
  bot.use(checkAndRedirectToScene());

  // Display help with commands and descriptions
  const commands = [
    { name: 'start', description: 'Start the bot' },
    { name: 'help', description: 'Display help' },
    { name: 'menu', description: 'Display main menu' },
    { name: 'register', description: 'Register to the bot' },
    { name: 'profile', description: 'View your profile' },
    // { name: 'question', description: 'Post a question' },
  ];
  setCommands(commands);

  bot.on('inline_query', async (ctx: any) => {
    const offset = parseInt(ctx.inlineQuery.offset) || 0;

    let items = [];

    for (var i = 0; i < 100; i++) {
      items.push({
        title: 'Item ' + i,
        desc: 'item ' + i + ' desc',
        id: '0000' + i,
        moreinfo: 'More info about item' + i + ', mucho importante information',
      });
    }

    let results = items.slice(offset, offset + 10).map((item) => ({
      type: 'article',
      id: item.id,
      title: item.title,
      description: item.desc,
      input_message_content: {
        message_text: '*' + item.title + '*\n' + item.desc,
        parse_mode: 'Markdown',
      },
      reply_markup: {
        inline_keyboard: [[{ text: 'More info', callback_data: 'moreinfo' }]],
      },
      hide_url: true,
      url: 'http://www.domain.se/' + item.id,
    }));

    console.log('hello');

    let ourReturn = ctx.answerInlineQuery(results, {
      is_personal: true,
      next_offset: offset + results.length,
      cache_time: 10,
    });

    return ourReturn;
  });
  dbConnecion;
  return bot;
};
