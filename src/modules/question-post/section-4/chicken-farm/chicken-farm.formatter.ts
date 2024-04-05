import { InlineKeyboardButtons, MarkupButtons } from '../../../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../../../types/components';

class ChickenFarmFormatter {
  estimatedCapitalOption: TableInlineKeyboardButtons;
  backOption: TableMarkupKeyboardButtons;
  messages = {
    sectorPrompt: 'Specific sector for chicken farm?',
    estimatedCapitalPrompt: 'What is the estimated capital?',
    enterpriseNamePrompt: 'Name for the small scale enterprise?',
    descriptionPrompt: 'Enter description maximimum 45 words',
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

    this.backOption = [[{ text: 'Back', cbString: 'back' }]];
  }

  sectorPrompt() {
    return [this.messages.sectorPrompt, this.goBackButton()];
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
          { text: 'Estimated Capital', cbString: 'estimated_capital' },
        ],
        [
          { text: 'Enterprise Name', cbString: 'enterprise_name' },
          { text: 'Description', cbString: 'description' },
        ],
        [
          { text: 'Cancel', cbString: 'cancel' },
          { text: 'Done', cbString: 'editing_done' },
        ],
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

  inputError() {
    return ['Invalid input, please try again'];
  }

  postingSuccessful() {
    return ['Posted Successfully'];
  }

  postingError() {
    return ['Posting failed'];
  }
}

export default ChickenFarmFormatter;
