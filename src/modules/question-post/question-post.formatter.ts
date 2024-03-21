import { InlineKeyboardButtons, MarkupButtons } from '../../components/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../types/components';

class QustionPostFormatter {
  categories: TableMarkupKeyboardButtons;
  arBrOption: TableInlineKeyboardButtons;
  bIDiOption: TableInlineKeyboardButtons;
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
      [{ text: 'Back', cbString: 'back' }],
    ];
    this.bIDiOption = [
      [
        { text: 'BI', cbString: 'bi' },
        { text: 'Di', cbString: 'di' },
      ],
      [{ text: 'Back', cbString: 'back' }],
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
        { text: 'other', cbString: 'other' },
        { text: 'back', cbString: 'back' },
      ],
    ];
  }
  goBackButton(oneTime: boolean = true) {
    return MarkupButtons(this.backOption, oneTime);
  }
  chooseOptionString() {
    return ['Please Choose on category from the options'];
  }
  chooseOptionDisplay() {
    return ['Please Choose on category from the options', MarkupButtons(this.categories, true)];
  }
  arBrOptionDisplay() {
    return ['Please Choose from two', InlineKeyboardButtons(this.arBrOption)];
  }
  woredaListDisplay() {
    return ['Please Choose Your Woreda', InlineKeyboardButtons(this.woredaList)];
  }
  bIDIOptionDisplay() {
    return ['Please Choose ID first Icon', InlineKeyboardButtons(this.bIDiOption), this.goBackButton(false)];
  }
  lastDidtitPrompt() {
    return ['Enter Last Digit ', this.goBackButton(false)];
  }
  locationPrompt() {
    return ['Enter sub city and location ', this.goBackButton(false)];
  }
  descriptionPrompt() {
    return ['Enter Description maximum 200 words ', this.goBackButton(false)];
  }
  photoPrompt() {
    return ['Attach four photos ', this.goBackButton(false)];
  }
}

export default QustionPostFormatter;
