import { MarkupButtons } from '../../../ui/button';
import { TableMarkupKeyboardButtons } from '../../../types/components';

class Section1Formatter {
  categories: TableMarkupKeyboardButtons;
  backOption: TableMarkupKeyboardButtons;
  messages = {
    categoriesPrompt: 'Please Choose on category from the options',
  };
  constructor() {
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
  goBackButton(oneTime: boolean = true) {
    return MarkupButtons(this.backOption, oneTime);
  }

  chooseOptionDislay() {
    return [this.messages.categoriesPrompt, MarkupButtons(this.categories, true)];
  }
}
export default Section1Formatter;
