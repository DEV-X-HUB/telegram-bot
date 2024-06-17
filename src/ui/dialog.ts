import Bot from '../loaders/bot';

import { Context } from 'telegraf';
// Display notification(popup) when user click on inline keyboard
async function displayDialog(ctx: any, displayMessage: string, show_alert: boolean = false) {
  console.log('called');
  const bot = Bot();
  if (bot != null) {
    try {
      return await ctx.answerCbQuery(displayMessage, { show_alert: show_alert });
    } catch (error) {
      console.log(error);
    }
  }
}

export { displayDialog };
