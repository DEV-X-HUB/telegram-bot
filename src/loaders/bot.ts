import { Telegraf, Context, session, Scenes } from 'telegraf';
import config from '../config/config';
import dbConnecion from './db-connecion';

import RegistrationScene from '../modules/registration/registration.scene';
import { checkAndRedirectToScene } from '../middleware/check-command';
import { checkUserInChannelandPromtJoin } from '../middleware/auth';
import MainmenuScene from '../modules/mainmenu/mainmenu.scene';
import Service1Scene from '../modules/service1/service1.scene';
import QuestionPostScene from '../modules/question-post/question-post.scene';
import ProfileScene from '../modules/profile/profile.scene';
import { setCommands } from '../utils/helper/commands';

let bot: Telegraf<Context> | null = null;

export default () => {
  if (bot != null) return bot;
  bot = new Telegraf(config.bot_token as string);
  bot.telegram.setWebhook(`${config.domain}/secret-path`);
  const stage = new Scenes.Stage([RegistrationScene, MainmenuScene, Service1Scene, ProfileScene, ...QuestionPostScene]);
  bot.use(session());
  bot.use(stage.middleware());
  // bot.use(checkUserInChannelandPromtJoin());
  bot.use(checkAndRedirectToScene());

  // prefill text message on user input
  // ( switch_inline_query_current_chat: 'text' ) will prefill the text message on user input
  // bot.command('start', async (ctx) => {
  //   return await ctx.reply('Welcome to the bot', {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [
  //           { text: 'Register', switch_inline_query_current_chat: '' },
  //           { text: 'Profile', switch_inline_query_current_chat: 'Profile' },
  //         ],
  //       ],
  //     },
  //   });
  // });

  // display inline query result so that when user types the username of the bot, it will show the result

  // bot.on('inline_query', async (ctx) => {
  //   return await ctx.answerInlineQuery([
  //     {
  //       type: 'article',
  //       id: '1',
  //       title: 'Inline Query',
  //       input_message_content: {
  //         message_text: 'Inline Query',
  //       },
  //     },
  //     {
  //       type: 'article',
  //       id: '2',
  //       title: 'Inline Query',
  //       input_message_content: {
  //         message_text: 'Inline Query',
  //       },
  //     },
  //     {
  //       type: 'article',
  //       id: '3',
  //       title: 'Inline Query',
  //       input_message_content: {
  //         message_text: 'Inline Query',
  //       },
  //     },
  //   ]);
  // });

  // Display help with commands and descriptions
  const commands = [
    { name: 'start', description: 'Start the bot' },
    { name: 'help', description: 'Display help' },
    { name: 'menu', description: 'Display main menu' },
    { name: 'register', description: 'Register to the bot' },
    { name: 'profile', description: 'View your profile' },
    // { name: 'question', description: 'Post a question' },
  ];
  // setCommands(commands);
  dbConnecion;
  return bot;
};
