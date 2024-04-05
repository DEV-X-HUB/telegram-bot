import Bot from '../loaders/bot';

// Display notification(popup) when user click on inline keyboard
async function displayDialog(ctx: any, displayMessage: string) {
  const bot = Bot();
  if (bot != null) {
    return await ctx.answerCbQuery(displayMessage, { show_alert: true });
  }
}

export { displayDialog };
