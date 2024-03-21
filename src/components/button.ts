import { Markup } from 'telegraf';
import {
  RowInlineKeyboardButtons,
  RowMarkupKeyboardButtons,
  TableInlineKeyboardButtons,
  UrlButtonOptions,
} from '../types/components';

export const urlButton = ({ buttonText, url, hidable }: UrlButtonOptions) => {
  return Markup.inlineKeyboard([Markup.button.url(buttonText, url, hidable)]);
};

export const InlineKeyboardButtons = (tableButtons: TableInlineKeyboardButtons) => {
  return Markup.inlineKeyboard(getButtonRows(tableButtons));
};
export const MarkupButtons = (tableButtons: TableInlineKeyboardButtons) => {
  return Markup.keyboard(getButtonRows(tableButtons)).resize();
};

const getCulumnButtons = (buttons: RowInlineKeyboardButtons | RowMarkupKeyboardButtons) => {
  return [...buttons.map(({ text, cbString, hidebale }) => Markup.button.callback(text, cbString, hidebale))];
};
const getButtonRows = (buttonRows: TableInlineKeyboardButtons) => {
  return [...buttonRows.map((buttonRow) => getCulumnButtons(buttonRow))];
};
