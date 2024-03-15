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

// import path from "path"
// import I18n from "telegraf-i18n"
// import {
//     Telegraf,
//     // session,
//     MiddlewareFn
// } from "telegraf";
// import {MatchedMiddleware, Triggers} from "telegraf/typings/composer";
// import {Context} from "telegraf/typings/context";
// import RedisSession from "telegraf-session-redis"
// import {botConfig} from "./config/config"

// const rateLimit = require('telegraf-ratelimit')

// export class CoreBot {
//     private instance: Telegraf<Context>;

//     constructor(
//         token: string,
//         middlewares: MiddlewareFn<any>[],
//         actions?: any[],
//         commands?: any[],
//         hears?: any[],
//     ) {
//         const session = new RedisSession({
//             store: {
//                 host: botConfig.TELEGRAM_SESSION_HOST || '127.0.0.1',
//                 port: botConfig.TELEGRAM_SESSION_PORT || 6379
//             }
//         })
//         this.instance = new Telegraf(token);
//         // session should always come before middlewares registration
//         // this.instance.use(session())
//         this.instance.use(session)
//         this.instance.use(rateLimit({
//             window: 3000,
//             limit: 10,
//             onLimitExceeded: (ctx: any, _: any) => {
//                 console.log("Rate limit exceeded")
//                 ctx.replyWithHTML("Too many requests. Please make requests at a reasonable pace.")
//             }
//         }))
//         const i18n = new I18n({
//             directory: path.resolve(__dirname, 'locales'),
//             defaultLanguage: 'en',
//             sessionName: 'session',
//             useSession: true,
//         })
//         // const i18n = new TelegrafI18n({
//         //     useSession: true,
//         //     defaultLanguageOnMissing: true, // implies allowMissing = true
//         //     // directory: path.resolve(__dirname, 'locales')
//         // })
//         // i18n.loadLocale('en', { greeting: 'hi ${firstName}, please select which one of you are ?' })
//         // i18n.loadLocale('am', { greeting: 'Sup nigga' })
//         this.instance.use(i18n.middleware())

//         // register all other handlers here
//         middlewares.forEach((middleware: MiddlewareFn<any>) => {
//             this.instance.use(middleware);
//         })

//         commands?.forEach((act: any) => {
//             this.instance.command(act.command, act.handler)
//         })
//         // register all action middlewares here
//         actions?.forEach((act: any) => {
//             this.instance.action(act.key, act.handler)
//         })
//         hears?.forEach((cb: any) => {
//             this.instance.hears(cb.key, cb.handler)
//         })
//         // @ts-ignore
//         // this.instance.hears(localizationProvider.allTr('common.mainmenu'), cancelBtnLbl => MyStage.router.push(ctx, '/', true, true))
//         this.instance.catch((err, ctx) => {
//             return;
//         });

//     }

//     start(...fns: any) {
//         return this.instance.start(fns)
//     }

//     launch(config: Telegraf.LaunchOptions = {}) {
//         return this.instance.launch(config)
//     }

//     action(triggers: Triggers<any>,
//            ...fns: MatchedMiddleware<any, 'callback_query'>
//     ) {
//         return this.instance.action(triggers, ...fns)
//     }

//     stop(reason = 'unspecified') {
//         return this.instance.stop(reason)
//     }

//     telegram() {
//         return this.instance.telegram
//     }

//     startWebHook(domain: string, port: number) {
//         return this.instance.launch({
//             webhook: {
//                 domain: domain,
//                 port: port
//             }
//         })
//     }
// }
