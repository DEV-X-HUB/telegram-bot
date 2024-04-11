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
  // const stage = new Scenes.Stage([RegistrationScene, MainmenuScene, Service1Scene, ProfileScene, ...QuestionPostScene]);
  // bot.use(session());
  // bot.use(stage.middleware());
  // bot.use(checkUserInChannelandPromtJoin());
  // bot.use(checkAndRedirectToScene());

  // prefill text message on user input
  // ( switch_inline_query_current_chat: 'text' ) will prefill the text message on user input
  bot.command('start', async (ctx) => {
    // extract if there is query string in the command
    console.log('ctx.message.text', ctx.message.text);
    const query = ctx.message.text.split(' ')[1];
    if (query) {
      if (query === 'answer') {
        // get question data from the answerinlinequery
        const questionData = {
          questionId: '0',
          question: 'Hello guys here is my question 3',
          questionText: '#tech\n\nWhat is the best programming language for beginners? \n\nBy: @username',
          description: 'Asked 1 month ago, 2 Answers',
        };

        await ctx.reply(`${questionData.questionText}`, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Browse', callback_data: 'browse' },
                { text: 'Subscribe', callback_data: 'subscribe' },
              ],
            ],
          },
        });

        return await ctx.reply(
          // add copy sticker
          '📋 *Copy the question* \n\n Send me your answer   \n\n`Note that you can send your answer through voice, or you could send your answer with media(photo, video, audio)`',
          {
            reply_markup: {
              keyboard: [[{ text: 'Back' }]],
              resize_keyboard: true,
            },
            parse_mode: 'Markdown',
          },
        );
      }
      if (query === 'browse') {
        return await ctx.reply('Browse');
      }
    }

    return await ctx.reply('Welcome to the bot', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Register', switch_inline_query_current_chat: '' },
            { text: 'Profile', switch_inline_query_current_chat: 'Profile' },
          ],
        ],
      },
    });
  });

  bot.on('inline_query', async (ctx) => {
    return await ctx.answerInlineQuery(
      [
        {
          type: 'article',
          id: '0',
          title: 'Hello guys here is my question 3',
          input_message_content: {
            message_text: '#tech\n\nWhat is the best programming language for beginners? \n\nBy: @username',
            parse_mode: 'Markdown',
            entities: [
              {
                type: 'bold',
                offset: 0,
                length: 10,
              },
            ],
          },
          reply_markup: {
            inline_keyboard: [
              [
                // navigate to the bot and start the bot with the command 'answer'
                { text: 'Answer', url: 'https://t.me/ttynabot?start=answer' },
                { text: 'Browse', url: 'https://t.me/ttynabot?start=browse' },
              ],
            ],
          },
          description: 'Asked 1 month ago, 2 Answers',
        },
        // {
        //   type: 'article',
        //   id: '3',
        //   title: 'Hello guys here is my question 3',
        //   input_message_content: {
        //     message_text: 'Inline Query Content 3',
        //     parse_mode: 'Markdown',
        //     entities: [
        //       {
        //         type: 'bold',
        //         offset: 0,
        //         length: 10,
        //       },
        //     ],
        //   },
        //   reply_markup: {
        //     inline_keyboard: [
        //       [
        //         { text: 'Answer', url: 'https://google.com' },
        //         { text: 'Browse', url: 'https://google.com' },
        //       ],
        //     ],
        //   },
        //   description: 'Asked 1 month ago, 2 Answers',
        // },
        // {
        //   type: 'article',
        //   id: '3',
        //   title: 'Hello guys here is my question 3',
        //   input_message_content: {
        //     message_text: 'Inline Query Content 3',
        //     parse_mode: 'Markdown',
        //     entities: [
        //       {
        //         type: 'bold',
        //         offset: 0,
        //         length: 10,
        //       },
        //     ],
        //   },
        //   reply_markup: {
        //     inline_keyboard: [
        //       [
        //         { text: 'Answer', url: 'https://google.com' },
        //         { text: 'Browse', url: 'https://google.com' },
        //       ],
        //     ],
        //   },
        //   description: 'Asked 1 month ago, 2 Answers',
        // },
      ],

      {
        button: {
          text: '62 Questions: Show All',
          start_parameter: 'from_inline',
        },
      },
    );
  });

  // when user clicks on 'answer' button
  bot.command('answer', async (ctx) => {
    return await ctx.reply('Answer');
  });

  const commands = [
    { name: 'start', description: 'Start the bot' },
    { name: 'help', description: 'Display help' },
    { name: 'menu', description: 'Display main menu' },
    { name: 'register', description: 'Register to the bot' },
    { name: 'profile', description: 'View your profile' },
  ];
  // setCommands(commands);
  // dbConnecion;
  return bot;
};
