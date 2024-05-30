import { Telegraf, Context, session, Scenes } from 'telegraf';
import config from '../config/config';
import dbConnecion from './db-connecion';

import RegistrationScene from '../modules/registration/registration.scene';
import { checkAndRedirectToScene } from '../middleware/check-command';
import { checkRegistration, checkUserInChannelandPromtJoin } from '../middleware/auth';
import QuestionPostScene from '../modules/post/post.scene';
import ProfileScene from '../modules/profile/profile.scene';
import { setCommands } from '../utils/helpers/commands';
import SearchQuestionController from '../modules/post/post.controller';
import { checkCallBacks } from '../middleware/check-callback';
import ChatScene from '../modules/chat/chat.scene';
import BrowsePostScene from '../modules/browse-post/browse-post.scene';
import MainMenuService from '../modules/mainmenu/mainmenu-service';
import schedule from 'node-schedule';

const mainMenuService = new MainMenuService();
let bot: Telegraf<Context> | null = null;

const checkUserInitializer = () => {
  mainMenuService.checkUsersInchannel(bot);
};

export default () => {
  if (bot != null) return bot;
  bot = new Telegraf(config.bot_token as string);
  bot.telegram.setWebhook(`${config.domain}/secret-path`);
  const stage = new Scenes.Stage([ProfileScene, ...QuestionPostScene, RegistrationScene, ChatScene, BrowsePostScene]);

  bot.use(checkUserInChannelandPromtJoin());

  bot.on('inline_query', SearchQuestionController.handleSearch);

  stage.use(checkRegistration());
  stage.use(checkCallBacks());
  stage.use(checkAndRedirectToScene());
  bot.use(session());
  bot.use(stage.middleware());
  // bot.use(checkAndRedirectToScene());

  const commands = [
    { name: 'start', description: 'Start the bot' },
    { name: 'register', description: 'Register to the bot' },
    { name: 'search', description: 'search questions' },
    { name: 'register', description: 'Register to the bot' },
    { name: 'profile', description: 'View your profile' },
    { name: 'restart', description: 'Restart the service' },
    { name: 'browse', description: 'Browse posts' },
  ];

  schedule.scheduleJob('0 0 * * *', checkUserInitializer);

  setCommands(commands);
  dbConnecion;

  return bot;
};
