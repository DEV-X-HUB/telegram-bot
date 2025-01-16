"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const button_1 = require("../../../ui/button");
class Section4Formatter {
    constructor() {
        this.categories = [
            [
                { text: 'Manufacture', cbString: 'manufacture' },
                { text: 'Chicken Farm', cbString: 'chicken-farm' },
                { text: 'Construction', cbString: 'construction' },
            ],
            [{ text: 'Back', cbString: 'back' }],
        ];
        this.backOption = [[{ text: 'Back', cbString: 'back' }]];
        this.messages = {
            useButtonError: 'Please use Buttons to select options',
            categoriesPrompt: 'Please Choose one category from the options',
        };
    }
    goBackButton(oneTime = true) {
        return (0, button_1.MarkupButtons)(this.backOption, oneTime);
    }
    chooseOptionDislay() {
        return [this.messages.categoriesPrompt, (0, button_1.InlineKeyboardButtons)(this.categories)];
    }
}
exports.default = Section4Formatter;
//# sourceMappingURL=section-4.formatter.js.map