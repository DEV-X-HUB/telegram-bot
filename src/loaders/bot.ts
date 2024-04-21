import { Telegraf, Context, session, Scenes } from 'telegraf';
import config from '../config/config';
import dbConnecion from './db-connecion';

import RegistrationScene from '../modules/registration/registration.scene';
import { checkAndRedirectToScene } from '../middleware/check-command';
import { checkUserInChannelandPromtJoin } from '../middleware/auth';
import QuestionPostScene from '../modules/post/question-post.scene';
import ProfileScene from '../modules/profile/profile.scene';
import { setCommands } from '../utils/helper/commands';
import SearchQuestionController from '../modules/question/question.controller';
import { checkCallBacks, checkMenuOptions } from '../middleware/check-callback';
import { AnswerQuestionScene } from '../modules/question/question.scene';

let bot: Telegraf<Context> | null = null;

export default () => {
  if (bot != null) return bot;
  bot = new Telegraf(config.bot_token as string);
  bot.telegram.setWebhook(`${config.domain}/secret-path`);
  const stage = new Scenes.Stage([ProfileScene, ...QuestionPostScene, AnswerQuestionScene, RegistrationScene]);

  stage.use(checkAndRedirectToScene());

  bot.use(checkCallBacks());
  bot.use(session());
  bot.use(checkUserInChannelandPromtJoin());
  bot.use(stage.middleware());
  // bot.use(checkAndRedirectToScene());
  bot.use(checkMenuOptions());

  bot.on('inline_query', SearchQuestionController.handleSearch);

  const commands = [
    { name: 'start', description: 'Start the bot' },
    { name: 'search', description: 'Start the bot' },
    { name: 'help', description: 'Display help' },
    { name: 'menu', description: 'Display main menu' },
    { name: 'register', description: 'Register to the bot' },
    { name: 'profile', description: 'View your profile' },
  ];
  setCommands(commands);
  dbConnecion;
  return bot;
};
