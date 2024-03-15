import { Telegraf, Context, Scenes, session, Markup } from 'telegraf';
import dbConnecion from './loaders/db-connecion';
import Bot from './loaders/bot';
import MainMenuController from './mainmenu/mainmenu.controller';
import registerScene from './registration/registration.controller';

// Igniter function
const ignite = () => {
  const bot = Bot();
  if (bot) {
    const stage = new Scenes.Stage([registerScene]);
    bot.use(session());
    bot.use(stage.middleware());
    bot.start((ctx) => {
      console.log(ctx);
      ctx.reply('heybody');
    });
    bot.command('register', (ctx: any) => {
      ctx.reply("Welcome! Let's start the registration process.");
      ctx.scene.enter('register');
    });
  }
  process.on('SIGINT', () => {
    dbConnecion.close();
    bot?.stop();
  });
};

ignite();
