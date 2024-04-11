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
  bot.use(checkUserInChannelandPromtJoin());
  bot.use(stage.middleware());
  bot.use(checkAndRedirectToScene());

  // prefill text message on user input
  // ( switch_inline_query_current_chat: 'text' ) will prefill the text message on user input

  bot.on('inline_query', SearchQuestionController.handleSearch);

  // when user clicks on 'answer' button
  bot.command('answer', async (ctx) => {
    return await ctx.reply('Answer');
  });

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
