import { Context } from 'telegraf';

// Function that posts a message to a channel
export const postToChannel = async (ctx: any, message: string) => {
  return await ctx.telegram.sendMessage(process.env.CHANNEL_ID, message);
};
export const sendMessage = async (ctx: Context, chatId: number, message: string) => {
  return await ctx.telegram.sendMessage(chatId, message, {
    parse_mode: 'MarkdownV2',
    reply_markup: {
      inline_keyboard: [[{ text: '✍️ Reply', callback_data: 'button_click' }]],
    },
  });
};
