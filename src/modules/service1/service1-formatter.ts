import { Markup } from 'telegraf';
import { MarkupButtons } from '../../components/button';

class Service1Formatter {
  constructor() {}
  chooseOptionDisplay() {
    const markupOptions = [
      [
        { text: 'Option 1', cbString: 'option 1' },
        { text: 'Option 2', cbString: 'option 2' },
      ],
      [
        { text: '🔍 Search questions', cbString: 'Option 3' },
        { text: '🔍 Search questions', cbString: 'option 3' },
      ],
      [
        { text: 'Option 5', cbString: 'Option 5' },
        { text: 'Option 6', cbString: 'Option 6' },
      ],
      [
        { text: 'Back', cbString: 'Back' },
        { text: 'Next ', cbString: 'Next' },
      ],
    ];
    return [MarkupButtons(markupOptions)];
  }
  chooseNextOptionDisplay() {
    const markupOptions = [
      [
        { text: 'Option 7', cbString: 'Option 7' },
        { text: 'Option 8', cbString: 'Option 8' },
      ],
      [
        { text: 'Option 9', cbString: 'Option 9' },
        { text: 'Back', cbString: 'Back' },
      ],
    ];
    return [MarkupButton(markupOptions)];
  }
}

export default Service1Formatter;
