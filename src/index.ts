import { Scenes, session } from 'telegraf';
import Bot from './loaders/bot';

import RegistrationScene from './modules/registration/registration.scene';
import { checkAndRedirectToScene } from './middleware/check-command';
import { checkUserInChannelandPromtJoin } from './middleware/auth';
import MainmenuScene from './modules/mainmenu/mainmenu.scene';
import Service1Scene from './modules/service1/service1.scene';
import dbConnection from './loaders/db-connecion';
import PostingScene from './modules/posting/posting.scene';

const ignite = () => {
  const bot = Bot();
  if (bot) {
    const stage = new Scenes.Stage([RegistrationScene, MainmenuScene, Service1Scene, PostingScene]);
    bot.use(session());
    bot.use(stage.middleware());
    bot.use(checkUserInChannelandPromtJoin());
    bot.use(checkAndRedirectToScene());
  }
  process.on('SIGINT', () => {
    dbConnection.close();
    bot?.stop();
  });
};

ignite();
