import { Telegraf, Context, session, MiddlewareFn } from 'telegraf';
import config from '../config/config';
import dbConnecion from './db-connecion';

let bot: Telegraf<Context> | null = null;

export default () => {
  if (bot != null) return bot;
  bot = new Telegraf(config.bot_token as string);
  dbConnecion;
  try {
    bot
      .launch({
        webhook: {
          domain: config.domain,
          port: 8080,
        },
      })
      .then(() => {
        // 6668727233
        // if (bot) console.log(bot);
        // bot?.context
        // return bot.sendMessage('6668727233', 'data', {
        //   parse_mode: 'HTML',
        //   reply_markup: { remove_keyboard: true },
        // });

        console.log('bot is running');
      });
    return bot;
  } catch (error) {
    console.log(error);
    return null;
  }
};
