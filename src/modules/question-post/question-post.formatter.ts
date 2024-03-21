import { InlineKeyboardButtons, MarkupButtons } from '../../components/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../types/components';

class QustionPostFormatter {
  categories: TableMarkupKeyboardButtons;
  arBrOption: TableInlineKeyboardButtons;
  backOption: TableMarkupKeyboardButtons;
  woredaList: TableInlineKeyboardButtons;
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
    this.arBrOption = [
      [
        { text: 'AR', cbString: 'ar' },
        { text: 'BR', cbString: 'br' },
      ],
    ];
    this.backOption = [[{ text: 'Back', cbString: 'back' }]];
    this.woredaList = [
      [
        { text: 'woreda', cbString: 'woreda' },
        { text: 'woreda', cbString: 'woreda' },
      ],
      [
        { text: 'woreda', cbString: 'woreda' },
        { text: 'woreda', cbString: 'woreda' },
      ],
      [
        { text: 'woreda', cbString: 'woreda' },
        { text: 'woreda', cbString: 'woreda' },
      ],
      [
        { text: 'woreda', cbString: 'woreda' },
        { text: 'woreda', cbString: 'woreda' },
      ],
      [
        { text: 'woreda', cbString: 'woreda' },
        { text: 'woreda', cbString: 'woreda' },
      ],
      [
        { text: 'woreda', cbString: 'woreda' },
        { text: 'other', cbString: 'other' },
      ],
    ];
  }
  goBackButton() {
    return MarkupButtons(this.backOption);
  }
  chooseOptionDisplay() {
    return ['Please Choose on category from the options', MarkupButtons(this.categories)];
  }
  arBrOptionDisplay() {
    return ['Please Choose from two', InlineKeyboardButtons(this.arBrOption), this.goBackButton()];
  }
  woredaListDisplay() {
    return ['Please Choose Your Woreda', InlineKeyboardButtons(this.woredaList), this.goBackButton()];
  }
}

export default QustionPostFormatter;
