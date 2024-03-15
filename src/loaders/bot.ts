import { Telegraf, Context } from 'telegraf';
import config from '../config/config';
let bot: Telegraf<Context> | null = null;

export default () => {
  if (bot != null) return bot;
  bot = new Telegraf(config.bot_token as string);
  try {
    bot.launch({
      webhook: {
        domain: config.domain,
        port: 8080,
      },
    });
    console.log('bot is running');
    return bot;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export class Bot {
  private instance: Telegraf<Context>;

  constructor(token: string) {
    this.instance = new Telegraf(token);
  }

  start(...fns: any) {
    return this.instance.start(fns);
  }

  launch(config: Telegraf.LaunchOptions = {}) {
    return this.instance.launch(config);
  }

  stop(reason = 'unspecified') {
    return this.instance.stop(reason);
  }

  telegram() {
    return this.instance.telegram;
  }

  startWebHook(domain: string, port: number) {
    return this.instance.launch({
      webhook: {
        domain: domain,
        port: port,
      },
    });
  }
}
