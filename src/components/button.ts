import { Markup } from 'telegraf';

export const urlButton = (buttonText: string, url: string, hidable?: boolean) => {
  return Markup.inlineKeyboard([Markup.button.url(buttonText, url, hidable)]);
};
