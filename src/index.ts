import { Telegraf, Context, Scenes, session, Markup } from 'telegraf';
// import dbConnecion from './loaders/db-connecion';
import Bot from './loaders/bot';
import registerScene from './registration/registration.scene';

// Igniter function
const ignite = () => {
  const bot = Bot();
  if (bot) {
    const stage = new Scenes.Stage([registerScene]);
    bot.use(session());
    bot.use(stage.middleware());
    bot.start((ctx) => {
      ctx.reply('heybody');
    });
    bot.command('register', (ctx: any) => {
      ctx.scene.enter('register');
    });
  }
  process.on('SIGINT', () => {
    // dbConnecion.close();
    bot?.stop();
  });
};

ignite();
