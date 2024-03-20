import { Scenes, session } from 'telegraf';
import Bot from './loaders/bot';
import registerScene from './registration/registration.scene';
import MainMenuController from './mainmenu/mainmenu.controller';

// Replace 'YOUR_BOT_TOKEN' with your bot token

// Igniter function
import RegistrationScene from './registration/registration.scene';
import { checkAndRedirectToScene } from './middleware/check-command';
import { checkUserInChannelandPromtJoin } from './middleware/auth';
import dbConnecion from './loaders/db-connecion';
import MainmenuScene from './mainmenu/mainmenu.scene';
import Service1Scene from './service1/service1.scene';

const ignite = () => {
  const bot = Bot();
  if (bot) {
    const stage = new Scenes.Stage([RegistrationScene, MainmenuScene, Service1Scene]);
    bot.use(session());
    bot.use(stage.middleware());

    // bot.start(new MainMenuController().onStart);
    bot.command('start', new MainMenuController().onStart);
    bot.command('reg', (ctx: any) => {});
    bot.use(checkUserInChannelandPromtJoin());
    bot.use(checkAndRedirectToScene());
  }
  process.on('SIGINT', () => {
    // dbConnecion.close();
    bot?.stop();
  });
};

ignite();
