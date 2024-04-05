import { InlineKeyboardButtons, MarkupButtons } from '../../../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../../../types/components';

class ManufactureFormatter {
  estimatedCapitalOption: TableInlineKeyboardButtons;
  numberOfWorkerOption: TableInlineKeyboardButtons;
  backOption: TableMarkupKeyboardButtons;
  messages = {
    sectorPrompt: 'Specific sector for manufacture?',
    numberOfWorkerPrompt: 'Number of worker provide?',
    estimatedCapitalPrompt: 'What is the estimated capital?',
    enterpriseNamePrompt: 'Name for the small scale enterprise?',
    descriptionPrompt: 'Enter description maximimum 45 words',
    photoPrompt: 'Attach four clear images with different angles',
    postingSuccessful: 'Posted Successfully',
    displayError: 'Invalid input, please try again',
    postingError: 'Posting failed',
  };
  constructor() {
    this.estimatedCapitalOption = [
      [
        { text: 'Bronze', cbString: 'bronze' },
        { text: 'Silver', cbString: 'silver' },
      ],
      [
        { text: 'Gold', cbString: 'gold' },
        { text: 'Platinum', cbString: 'platinum' },
      ],
      [
        { text: 'Diamond', cbString: 'diamond' },
        { text: 'Back', cbString: 'back' },
      ],
    ];

    this.numberOfWorkerOption = [
      [
        { text: '1', cbString: '1' },
        { text: '2', cbString: '2' },
      ],

      [
        { text: '3', cbString: '3' },
        { text: '4', cbString: '4' },
      ],
      [
        { text: '5', cbString: '5' },
        { text: '6', cbString: '6' },
      ],
      [
        { text: '7', cbString: '7' },
        { text: 'Back', cbString: 'back' },
      ],
    ];

    this.backOption = [[{ text: 'Back', cbString: 'back' }]];
  }

  sectorPrompt() {
    return [this.messages.sectorPrompt, this.goBackButton()];
  }

  numberOfWorkerPrompt() {
    return [this.messages.numberOfWorkerPrompt, InlineKeyboardButtons(this.numberOfWorkerOption)];
  }

  estimatedCapitalPrompt() {
    return [this.messages.estimatedCapitalPrompt, InlineKeyboardButtons(this.estimatedCapitalOption)];
  }

  enterpriseNamePrompt() {
    return [this.messages.enterpriseNamePrompt, this.goBackButton()];
  }

  descriptionPrompt() {
    return [this.messages.descriptionPrompt];
  }
  photoPrompt() {
    return [this.messages.photoPrompt, this.goBackButton(false)];
  }

  goBackButton(oneTime: boolean = true) {
    return MarkupButtons(this.backOption, oneTime);
  }
}

export default ManufactureFormatter;
