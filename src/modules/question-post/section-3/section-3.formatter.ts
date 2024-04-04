import { InlineKeyboardButtons, MarkupButtons } from '../../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../../types/components';

class Section3Formatter {
  birthOrMaritalOption: TableInlineKeyboardButtons;
  backOption: TableMarkupKeyboardButtons;
  constructor() {
    this.birthOrMaritalOption = [
      [
        { text: 'Birth', cbString: 'birth' },
        { text: 'Marital', cbString: 'marital' },
      ],
      [{ text: 'Back', cbString: 'back' }],
    ];
    this.backOption = [[{ text: 'Back', cbString: 'back' }]];
  }
  birthOrMaritalOptionDisplay() {
    return ['Choose an option', InlineKeyboardButtons(this.birthOrMaritalOption)];
  }
  titlePrompt() {
    return ['What is the title?', this.goBackButton(false)];
  }
  descriptionPrompt() {
    return ['Enter description maximimum 45 words'];
  }
  photoPrompt() {
    return ['Attach four photos ', this.goBackButton(false)];
  }

  goBackButton(oneTime: boolean = true) {
    return MarkupButtons(this.backOption, oneTime);
  }

  getPreviewData(state: any) {
    return `#${state.category.replace(/ /g, '_')}\n\n________________\n\nTitle: ${state.title} \n\nDescription: ${state.description} \n\nContact: @resurrection99 \n\nDashboard: BT1234567\n\nStatus : ${state.status}`;
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
          { text: 'Birth/Marital', cbString: 'birth_or_marital' },
          { text: 'Title', cbString: 'title' },
        ],
        [
          { text: 'Description', cbString: 'description' },

          { text: 'Photo', cbString: 'photo' },
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
      case 'birth_or_marital':
        return this.birthOrMaritalOptionDisplay();
      case 'title':
        return this.titlePrompt();
      case 'description':
        return this.descriptionPrompt();
      case 'photo':
        return this.photoPrompt();
      default:
        return this.displayError();
    }
  }
  postingSuccessful() {
    return ['Posted Successfully'];
  }

  displayError() {
    return ['Invalid input, please try again'];
  }
}

export default Section3Formatter;
