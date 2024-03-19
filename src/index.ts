import { Scenes, session } from 'telegraf';
import Bot from './loaders/bot';
import RegistrationScene from './registration/registration.scene';
import { checkAndRedirectToScene } from './middleware/check-command';
import MainMenuScene from './mainmenu/mainmenu.scene';
import { checkUserInChannelandPromtJoin } from './middleware/auth';
import dbConnecion from './loaders/db-connecion';

const ignite = () => {
  const bot = Bot();
  if (bot) {
    const stage = new Scenes.Stage([RegistrationScene, MainMenuScene]);
    bot.use(session());
    bot.use(stage.middleware());
    bot.use(checkUserInChannelandPromtJoin());
    bot.use(checkAndRedirectToScene());
  }
  process.on('SIGINT', () => {
    dbConnecion.close();
    bot?.stop();
  });
};

ignite();
