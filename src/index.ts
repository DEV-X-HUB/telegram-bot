import { Telegraf, Markup, Scenes, session } from 'telegraf';
import dbConnecion from './loaders/db-connecion';
import Bot from './loaders/bot';
import registerScene from './registration/registration.scene';
import MainMenuController from './mainmenu/mainmenu.controller';

// Replace 'YOUR_BOT_TOKEN' with your bot token

// Igniter function

const ignite = () => {
  const bot = Bot();
  if (bot) {
    const stage = new Scenes.Stage([registerScene]);
    bot.use(session());
    bot.use(stage.middleware());

    // bot.start(new MainMenuController().onStart);
    bot.command('start', new MainMenuController().onStart);
    bot.command('reg', (ctx: any) => {});
  }
  process.on('SIGINT', () => {
    // dbConnecion.close();
    bot?.stop();
  });
};

ignite();
