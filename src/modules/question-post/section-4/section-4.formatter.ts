import { InlineKeyboardButtons, MarkupButtons } from '../../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../../types/components';

class Section4Formatter {
  categories: TableInlineKeyboardButtons = [
    [
      { text: 'Manufacture', cbString: 'manufacture' },
      { text: 'Chicken Farm', cbString: 'chicken-farm' },
      { text: 'Construction', cbString: 'construction' },
    ],

    [{ text: 'Back', cbString: 'back' }],
  ];
  backOption: TableMarkupKeyboardButtons = [[{ text: 'Back', cbString: 'back' }]];

  messages = {
    useButtonError: 'Please use Buttons to select options',
    categoriesPrompt: 'Please Choose one category from the options',
  };
  constructor() {}
  goBackButton(oneTime: boolean = true) {
    return MarkupButtons(this.backOption, oneTime);
  }

  chooseOptionDislay() {
    return [this.messages.categoriesPrompt, InlineKeyboardButtons(this.categories)];
  }
}
export default Section4Formatter;
