export const deleteMessage = async (ctx: any, messageData: { message_id: string; chat_id: string }) => {
  await ctx.telegram.deleteMessage(messageData.chat_id, messageData.message_id);
};

export const deleteMessageWithCallback = async (ctx: any) => {
  return await deleteMessage(ctx, {
    message_id: ctx.callbackQuery.message.message_id,
    chat_id: ctx.callbackQuery.message.chat.id,
  });
};

export const deleteKeyboardMarkup = async (ctx: any) => {
  // it should be sent before any message
  const messageOptions = {
    reply_markup: {
      remove_keyboard: true,
    },
  };

  await ctx.reply('.', messageOptions);
  await deleteMessage(ctx, {
    message_id: (parseInt(ctx.message.message_id) + 1).toString(),
    chat_id: ctx.message.chat.id,
  });
};
