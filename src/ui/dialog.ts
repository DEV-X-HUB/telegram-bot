import Bot from '../loaders/bot';

// Display notification(popup) when user click on inline keyboard
async function displayDialog(ctx: any, displayMessage: string) {
  const bot = Bot();
  if (bot != null) {
    try {
      return await ctx.answerCbQuery(displayMessage, { show_alert: true });
    } catch (error) {
      console.log(error);
    }
  }
}

// Display modal dialog with a message
async function displayModal(ctx: any, displayMessage: string) {
  const bot = Bot();
  if (bot != null) {
    try {
      return await ctx.answerCbQuery(displayMessage, true);
    } catch (error) {
      console.log(error);
    }
  }
}

export { displayDialog, displayModal };
