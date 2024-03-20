// Function that posts a message to a channel
export const postToChannel = async (ctx: any, message: string) => {
  await ctx.telegram.sendMessage(process.env.CHANNEL_ID, message);
};
