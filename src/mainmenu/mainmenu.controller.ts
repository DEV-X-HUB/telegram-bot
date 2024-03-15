import { Telegraf, Context } from 'telegraf';
class MainMenuController {
  constructor(bot: Telegraf<Context>) {
    bot.start((ctx) => ctx.reply('hey bbddy'));
  }
}

export default MainMenuController;
