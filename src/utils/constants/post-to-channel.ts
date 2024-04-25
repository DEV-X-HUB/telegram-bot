import { Context } from 'telegraf';

// Function that posts a message to a channel
export const postToChannel = async (ctx: any, message: string) => {
  return await ctx.telegram.sendMessage(process.env.CHANNEL_ID, message);
};
export const sendMessage = async (
  ctx: Context,
  chatId: number,
  message: string,
  sender_id: string,
  message_id: string,
) => {
  return await ctx.telegram.sendMessage(chatId, message, {
    parse_mode: 'MarkdownV2',
    reply_markup: {
      inline_keyboard: [[{ text: '✍️ Reply', callback_data: `replyMessage_${sender_id}_${message_id}` }]],
    },
  });
};
