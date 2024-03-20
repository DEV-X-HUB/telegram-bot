// Function to forward a message to a channel
export const forwardMessageToChannel = async (ctx: any) => {
  return await ctx.telegram.forwardMessage(process.env.CHANNEL_ID, ctx.chat.id, ctx.message.message_id);
};
