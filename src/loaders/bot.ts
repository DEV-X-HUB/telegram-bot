import { Telegraf, Context, session, MiddlewareFn } from 'telegraf';
import config from '../config/config';

let bot: Telegraf<Context> | null = null;

export default () => {
  if (bot != null) return bot;
  bot = new Telegraf(config.bot_token as string);
  console.log(config.domain);
  try {
    bot
      .launch({
        webhook: {
          domain: config.domain,
          port: 8080,
        },
      })
      .then(() => {
        console.log('bot is running');
      });
    return bot;
  } catch (error) {
    console.log(error);
    return null;
  }
};
