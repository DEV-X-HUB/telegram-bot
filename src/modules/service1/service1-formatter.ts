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
    return [
      Markup.keyboard([
        [Markup.button.callback('Option 7', 'Option 7'), Markup.button.callback('Option 8', 'Option 8')],
        [Markup.button.callback('Option 9', 'Option 9'), Markup.button.callback('Back', 'Back')],
      ]).resize(),
    ];
  }
}

export default Service1Formatter;
