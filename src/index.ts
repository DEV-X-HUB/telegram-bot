import { Telegraf, Markup, Scenes, session } from 'telegraf';
// import dbConnecion from './loaders/db-connecion';
import Bot from './loaders/bot';
import RegistrationScene from './registration/registration.scene';
import MainMenuController from './mainmenu/mainmenu.controller';
import { checkAndRedirectToScene } from './middleware/check-command';

// Replace 'YOUR_BOT_TOKEN' with your bot token

// Igniter function

const ignite = () => {
  const bot = Bot();
  if (bot) {
    const stage = new Scenes.Stage([RegistrationScene]);
    bot.use(session());
    bot.use(stage.middleware());

    //middleware to handle commands separately

    bot.command('start', new MainMenuController().onStart);
    bot.command('register', (ctx: any) => {
      ctx.scene.enter('register');
    });

    bot.use(checkAndRedirectToScene());

    bot.hears('Option 1', (ctx) => {
      ctx.reply('You selected Option 1');
    });
  }
  process.on('SIGINT', () => {
    // dbConnecion.close();
    bot?.stop();
  });
};

ignite();
