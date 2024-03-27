import Bot from '../loaders/bot';

// Display notification(popup) when user click on inline keyboard
async function displayDialog(displayMessage: string, callbackQuery: string, ctx: any) {
  const bot = Bot();
  if (bot != null) {
    return await ctx.answerCbQuery(displayMessage, { show_alert: true });
  }
}

export { displayDialog };
