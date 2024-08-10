"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const button_1 = require("../../../ui/button");
class Section1Formatter {
    constructor() {
        this.messages = {
            categoriesPrompt: 'Please Choose on category from the options',
        };
        this.categories = [
            [
                { text: 'Section 1A', cbString: 'section_1a' },
                { text: 'Section 1B', cbString: 'section_1b' },
            ],
            [
                { text: 'Section 1C', cbString: 'section_1c' },
                { text: 'Back', cbString: 'Back' },
            ],
        ];
        this.backOption = [[{ text: 'Back', cbString: 'back' }]];
    }
    goBackButton(oneTime = true) {
        return (0, button_1.MarkupButtons)(this.backOption, oneTime);
    }
    chooseOptionDislay() {
        return [this.messages.categoriesPrompt, (0, button_1.MarkupButtons)(this.categories, true)];
    }
}
exports.default = Section1Formatter;
//# sourceMappingURL=section-1.formatter.js.map