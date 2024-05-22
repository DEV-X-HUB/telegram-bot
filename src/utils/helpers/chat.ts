import config from '../../config/config';

import { Context } from 'telegraf';

export const deleteMessage = async (ctx: any, messageData: { message_id: string; chat_id: string }) => {
  await ctx.telegram.deleteMessage(messageData.chat_id, messageData.message_id);
};

export const deleteMessageWithCallback = async (ctx: any) => {
  return await deleteMessage(ctx, {
    message_id: ctx.callbackQuery.message.message_id,
    chat_id: ctx.callbackQuery.message.chat.id,
  });
};

export const deleteKeyboardMarkup = async (ctx: any, message?: string) => {
  // it should be sent before any message
  const messageOptions = {
    reply_markup: {
      remove_keyboard: true,
    },
  };
  const text = '\u200C' + '.' + '\u200C';
  await ctx.reply(message || text, messageOptions);
  await deleteMessage(ctx, {
    message_id: (parseInt(ctx.message.message_id) + 1).toString(),
    chat_id: ctx.message.chat.id,
  });
};

export const findSender = (ctx: any) => {
  let sender;
  if (ctx?.callbackQuery) sender = ctx?.callbackQuery?.from;
  if (ctx?.inline_query) sender = ctx?.inline_query?.from;
  if (ctx?.message) sender = ctx?.message?.from;
  if (ctx?.update.inline_query) sender = ctx?.update.inline_query?.from;
  return sender;
};

export const sendMediaGroup = async (ctx: any, phtos: any[], caption: string = 'Here are the images you uploaded') => {
  const mediaGroup = phtos.map((image: any) => ({
    media: image,
    type: 'photo',
    caption: caption,
  }));
  await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);
};

export const hasCallbackQuery = (ctx: any, queryStarter: string) => {
  if (!ctx.callbackQuery) return false;
  const query = ctx.callbackQuery.data;
  return query.startsWith(queryStarter);
};

export const sendMessage = async (ctx: any, chatId: number, message: string, sender_id: string, message_id: string) => {
  return await ctx.telegram.sendMessage(chatId, message, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[{ text: '✍️ Reply', callback_data: `replyMessage_${sender_id}_${message_id}` }]],
    },
  });
};
export const messagePostPreview = async (bot: any, chatId: any, message: string, post_id: string) => {
  return await bot.telegram.sendMessage(chatId, message, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[{ text: 'View Detail', url: `${config.bot_url}?start=postDetail_${post_id}` }]],
    },
  });
};

export const sendMediaGroupToUser = async (
  ctx: any,
  chatId: string,
  photos: any[],
  caption: string = 'Images associated with the post',
) => {
  const mediaGroup = photos.map((image: any) => ({
    media: image,
    type: 'photo',
    caption: caption,
  }));
  await ctx.telegram.sendMediaGroup(chatId, mediaGroup);
};

export const sendMediaGroupToChannel = async (
  ctx: any,
  photos: any[],
  caption: string = 'Images associated with the post',
) => {
  const mediaGroup = photos.map((image: any) => ({
    media: image,
    type: 'photo',
    caption: caption,
  }));
  await ctx.telegram.sendMediaGroup(config.channel_id, mediaGroup);
};
