import { Markup } from 'telegraf';
import { RowInlineKeyboardButtons, RowMarkupKeyboardButtons, TableInlineKeyboardButtons } from '../types/components';

export const urlButton = (buttonText: string, url: string, hidable?: boolean) => {
  return Markup.inlineKeyboard([Markup.button.url(buttonText, url, hidable)]);
};

export const InlineKeyboardButtons = (tableButtons: TableInlineKeyboardButtons) => {
  return Markup.inlineKeyboard(getButtonRows(tableButtons));
};
export const MarkupButtons = (tableButtons: TableInlineKeyboardButtons, onetime?: boolean) => {
  if (onetime) return Markup.keyboard(getButtonRows(tableButtons)).oneTime().resize();
  return Markup.keyboard(getButtonRows(tableButtons)).resize();
};

const getCulumnButtons = (buttons: RowInlineKeyboardButtons | RowMarkupKeyboardButtons) => {
  return [...buttons.map(({ text, cbString, hidebale }) => Markup.button.callback(text, cbString, hidebale))];
};
const getButtonRows = (buttonRows: TableInlineKeyboardButtons) => {
  return [...buttonRows.map((buttonRow) => getCulumnButtons(buttonRow))];
};
