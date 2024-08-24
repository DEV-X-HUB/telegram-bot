"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getButtonRows = exports.MarkupButtons = exports.InlineKeyboardButtons = exports.urlButton = void 0;
const telegraf_1 = require("telegraf");
const urlButton = (buttonText, url, hidable) => {
    return telegraf_1.Markup.inlineKeyboard([telegraf_1.Markup.button.url(buttonText, url, hidable)]);
};
exports.urlButton = urlButton;
const InlineKeyboardButtons = (tableButtons) => {
    return telegraf_1.Markup.inlineKeyboard((0, exports.getButtonRows)(tableButtons));
};
exports.InlineKeyboardButtons = InlineKeyboardButtons;
const MarkupButtons = (tableButtons, onetime) => {
    if (onetime)
        return telegraf_1.Markup.keyboard((0, exports.getButtonRows)(tableButtons)).oneTime().resize();
    return telegraf_1.Markup.keyboard((0, exports.getButtonRows)(tableButtons)).resize();
};
exports.MarkupButtons = MarkupButtons;
const getCulumnButtons = (buttons) => {
    return [
        ...buttons.map(({ text, cbString, hidebale, url, isUrl }) => isUrl ? telegraf_1.Markup.button.url(text, url, hidebale) : telegraf_1.Markup.button.callback(text, cbString, hidebale)),
    ];
};
const getButtonRows = (buttonRows) => {
    return [...buttonRows.map((buttonRow) => getCulumnButtons(buttonRow))];
};
exports.getButtonRows = getButtonRows;
//# sourceMappingURL=button.js.map