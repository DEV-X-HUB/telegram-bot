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

  getPreviewData(state: any) {
    return `#${state.category.replace(/ /g, '_')}\n\n________________\n\nTitle: ${state.sector} \n\nEstimated Capital: ${state.estimated_capital} \n\nEnterprise Name: ${state.enterprise_name} \n\nDescription: ${state.description} \n\nContact: @resurrection99 \n\nDashboard: BT1234567\n\nStatus : ${state.status}`;
  }

  preview(state: any) {
    return [
      this.getPreviewData(state),
      InlineKeyboardButtons([
        [
          { text: 'Edit', cbString: 'preview_edit' },
          { text: 'Notify Settings', cbString: 'notify_settings' },
          { text: 'Post', cbString: 'post_data' },
        ],
        [
          { text: 'Mention previous post', cbString: 'mention_previous_post' },
          { text: 'Cancel', cbString: 'cancel' },
        ],
      ]),
    ];
  }

  editPreview(state: any) {
    return [
      this.getPreviewData(state),
      InlineKeyboardButtons([
        [
          { text: 'Sector', cbString: 'sector' },
          { text: 'Number of worker', cbString: 'number_of_worker' },
        ],
        [
          { text: 'Enterprise Name', cbString: 'enterprise_name' },
          { text: 'Estimated Capital', cbString: 'estimated_capital' },
        ],
        [
          { text: 'Description', cbString: 'description' },
          { text: 'Cancel', cbString: 'cancel' },
        ],
        [{ text: 'Done', cbString: 'editing_done' }],
      ]),
    ];
  }

  async editFieldDisplay(editField: string) {
    switch (editField) {
      case 'sector':
        return this.sectorPrompt();
      case 'estimated_capital':
        return this.estimatedCapitalPrompt();
      case 'enterprise_name':
        return this.enterpriseNamePrompt();
      case 'description':
        return this.descriptionPrompt();
      default:
        return this.inputError();
    }
  }
}

export default ManufactureFormatter;
