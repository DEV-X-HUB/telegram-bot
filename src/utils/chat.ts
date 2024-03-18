export const deleteMessage = async (ctx: any, messageData: { message_id: string; chat_id: string }) => {
  await ctx.telegram.deleteMessage(messageData.chat_id, messageData.message_id);
};

export const deleteMessageWithCallback = async (ctx: any) => {
  return await deleteMessage(ctx, {
    message_id: ctx.callbackQuery.message.message_id,
    chat_id: ctx.callbackQuery.message.chat.id,
  });
};
