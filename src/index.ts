import { Telegraf, Markup, Scenes, session } from 'telegraf';
import dbConnecion from './loaders/db-connecion';
import Bot from './loaders/bot';
import registerScene from './registration/registration.controller';
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
    bot.command('register', (ctx: any) => {
      ctx.scene.enter('register');
    });
    bot.hears('Option 1', (ctx) => {
      ctx.reply('You selected Option 1');
    });
  }
  process.on('SIGINT', () => {
    dbConnecion.close();
    bot?.stop();
  });
};

ignite();
