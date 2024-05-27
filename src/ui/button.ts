import { Markup } from 'telegraf';
import {
  RowInlineKeyboardButtons,
  RowMarkupKeyboardButtons,
  TableInlineKeyboardButtons,
  TableMarkupKeyboardButtons,
} from '../types/ui';

export const urlButton = (buttonText: string, url: string, hidable?: boolean) => {
  return Markup.inlineKeyboard([Markup.button.url(buttonText, url, hidable)]);
};

export const InlineKeyboardButtons = (tableButtons: TableInlineKeyboardButtons) => {
  return Markup.inlineKeyboard(getButtonRows(tableButtons));
};
export const MarkupButtons = (tableButtons: TableMarkupKeyboardButtons, onetime?: boolean) => {
  if (onetime) return Markup.keyboard(getButtonRows(tableButtons)).oneTime().resize();
  return Markup.keyboard(getButtonRows(tableButtons)).resize();
};

const getCulumnButtons = (buttons: RowInlineKeyboardButtons | RowMarkupKeyboardButtons) => {
  return [...buttons.map(({ text, cbString, hidebale }) => Markup.button.callback(text, cbString, hidebale))];
};
export const getButtonRows = (buttonRows: TableInlineKeyboardButtons | TableMarkupKeyboardButtons) => {
  return [...buttonRows.map((buttonRow) => getCulumnButtons(buttonRow))];
};
