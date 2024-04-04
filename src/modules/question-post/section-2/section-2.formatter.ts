import { InlineKeyboardButtons, MarkupButtons } from '../../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../../types/components';

class QustionPostSection2Formatter {
  backOption: TableMarkupKeyboardButtons;
  typeOptions: TableInlineKeyboardButtons;
  messages = {
    typePrompt: 'What are you Looking for',
    enterTitlePrompt: 'Enter Title',
    typePrompt1: '',
    descriptionPrompt: 'Enter Description maximum 200 words ',
    attachPhotoPromp: 'Attach a photo',
    useButtonError: 'Please use Buttons to select options',
  };
  constructor() {
    this.typeOptions = [
      [
        { text: 'Amendment', cbString: 'amendment' },
        { text: 'Correction', cbString: 'correction' },
      ],
      [{ text: 'Back', cbString: 'back' }],
    ];
    this.backOption = [[{ text: 'Back', cbString: 'back' }]];
  }

  goBackButton(oneTime: boolean = true) {
    return MarkupButtons(this.backOption, oneTime);
  }

  typeOptionsDisplay() {
    return [this.messages.typePrompt, InlineKeyboardButtons(this.typeOptions)];
  }
  enterTiteDisplay() {
    return [this.messages.enterTitlePrompt, this.goBackButton(true)];
  }
  enterDescriptionDisplay() {
    return [this.messages.descriptionPrompt, this.goBackButton(false)];
  }
  photoPrompt() {
    return [this.messages.attachPhotoPromp, this.goBackButton(false)];
  }

  getPreviewData(state: any) {
    return `#${'Section 2'}\n________________\n\n${state.type} \n\Title: ${state.title}  \n\nDescription: ${state.description} \n\nContact: @resurrection99 \n\nBy: Natnael\n\nStatus : ${state.status}`;
  }

  preview(state: any) {
    return [
      this.getPreviewData(state),
      InlineKeyboardButtons([
        [
          { text: 'Edit', cbString: 'preview_edit' },
          { text: 'Notify settings', cbString: 'notify_settings' },
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
          { text: 'Type', cbString: 'type' },
          { text: 'Title', cbString: 'title' },
        ],

        [
          { text: 'Description', cbString: 'description' },
          { text: 'photo', cbString: 'photo' },
        ],
        [
          { text: 'Cancel', cbString: 'cancel' },
          { text: 'Done', cbString: 'editing_done' },
        ],
      ]),
    ];
  }

  async editFieldDispay(editFiled: string) {
    switch (editFiled) {
      case 'type':
        return this.typeOptionsDisplay();
      case 'title':
        return this.enterDescriptionDisplay();
      case 'description':
        return this.enterDescriptionDisplay();

      case 'photo':
        return this.photoPrompt();
      case 'cancel':
        return await this.goBackButton();
      default:
        return ['none'];
    }
  }

  previewCallToAction() {
    return ['Preview your post and press once you are done'];
  }

  postingSuccessful() {
    return ['Posted Successfully'];
  }
  postingError() {
    return ['Post Error'];
  }
}

export default QustionPostSection2Formatter;
