import { Markup } from 'telegraf';

export const urlButton = (buttonText: string, url: string, hidable?: boolean) => {
  return Markup.inlineKeyboard([Markup.button.url(buttonText, url, hidable)]);
};

export const InlineKeyboardButtons = (tableButtons: TableInlineKeyboardButtons) => {
  return Markup.inlineKeyboard(getButtonRows(tableButtons));
};
export const MarkupButton = (tableButtons: TableInlineKeyboardButtons) => {
  return Markup.keyboard(getButtonRows(tableButtons)).resize();
};

//
export type InlineKeyboardButton = {
  text: string;
  cbString: string; // callback string
  hidebale?: boolean;
};
export type MarkupKeyboardButton = {
  text: string;
  cbString: string; // callback string
  hidebale?: boolean;
};
export type RowInlineKeyboardButtons = InlineKeyboardButton[];
export type TableInlineKeyboardButtons = RowInlineKeyboardButtons[];

export type RowMarkupKeyboardButtons = MarkupKeyboardButton[];
export type TableMarkupKeyboardButtons = RowMarkupKeyboardButtons[];

const getCulumnButtons = (buttons: RowInlineKeyboardButtons) => {
  return [...buttons.map(({ text, cbString, hidebale }) => Markup.button.callback(text, cbString, hidebale))];
};
const getButtonRows = (buttonRows: TableInlineKeyboardButtons) => {
  return [...buttonRows.map((buttonRow) => getCulumnButtons(buttonRow))];
};
