import { Markup } from 'telegraf';

export const urlButton = (buttonText: string, url: string, hidable?: boolean) => {
  return Markup.inlineKeyboard([Markup.button.url(buttonText, url, hidable)]);
};

export const InlineKeyboardButtons = (tableButtons: TableInlineKeyboardButtons) => {
  return Markup.inlineKeyboard(getButtonRows(tableButtons));
};

//
export type InlineKeyboardButton = {
  text: string;
  cbString: string; // callback string
  hidebale?: boolean;
};
export type RowInlineKeyboardButtons = InlineKeyboardButton[];
export type TableInlineKeyboardButtons = RowInlineKeyboardButtons[];

const getCulumnButtons = (buttons: RowInlineKeyboardButtons) => {
  return [...buttons.map(({ text, cbString, hidebale }) => Markup.button.callback(text, cbString, hidebale))];
};
const getButtonRows = (buttonRows: TableInlineKeyboardButtons) => {
  return [...buttonRows.map((buttonRow) => getCulumnButtons(buttonRow))];
};
