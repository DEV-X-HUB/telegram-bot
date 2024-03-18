export const deleteMessage = async (ctx: any, messageData: { message_id: string; chat_id: string }) => {
  await ctx.telegram.deleteMessage(messageData.chat_id, messageData.message_id);
};
