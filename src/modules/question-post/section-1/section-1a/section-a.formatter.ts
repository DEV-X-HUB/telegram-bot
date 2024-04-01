import { InlineKeyboardButtons, MarkupButtons } from '../../../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../../../types/components';

class QustionPostFormatter {
  categories: TableMarkupKeyboardButtons;
  arBrOption: TableInlineKeyboardButtons;
  bIDiOption: TableInlineKeyboardButtons;
  backOption: TableMarkupKeyboardButtons;
  woredaList: TableInlineKeyboardButtons;
  messages = {
    useButtonError: 'Please use Buttons to select options',
  };
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
        { text: 'DI', cbString: 'di' },
      ],
      [{ text: 'Back', cbString: 'back' }],
    ];
    this.backOption = [[{ text: 'Back', cbString: 'back' }]];
    this.woredaList = [
      [
        { text: 'woreda 1', cbString: 'woreda_1' },
        { text: 'woreda 2', cbString: 'woreda_2' },
      ],
      [
        { text: 'woreda 3', cbString: 'woreda_3' },
        { text: 'woreda 4', cbString: 'woreda_4' },
      ],
      [
        { text: 'woreda 5', cbString: 'woreda_5' },
        { text: 'woreda 6', cbString: 'woreda_6' },
      ],
      [
        { text: 'woreda 7', cbString: 'woreda_7' },
        { text: 'woreda 8', cbString: 'woreda_8' },
      ],
      [
        { text: 'woreda 9', cbString: 'woreda_9' },
        { text: 'woreda 10', cbString: 'woreda_10' },
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
  chooseOptionDisplayString() {
    return ['Please Choose on category from the options'];
  }
  chooseOptionDisplay() {
    return [MarkupButtons(this.categories, true)];
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

  getPreviewData(state: any) {
    return `#${state.category.replace(/ /g, '_')}\n________________\n\n${state.ar_br.toLocaleUpperCase()}\n\nWoreda: ${state.woreda} \n\nLast digit: ${state.last_digit} ${state.bi_di.toLocaleUpperCase()} \n\nSp. Locaton: ${state.location} \n\nDescription: ${state.description} \n\nContact: @resurrection99 \n\nBy: Natnael\n\nStatus : ${state.status}`;
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
          { text: 'AR/BR', cbString: 'ar_br' },
          { text: 'BI/DI', cbString: 'bi_di' },
        ],

        [
          { text: 'Location', cbString: 'location' },
          { text: 'Woreda', cbString: 'woreda' },
        ],
        [
          { text: 'Last Digit', cbString: 'last_digit' },
          { text: 'Description', cbString: 'description' },
        ],
        [
          { text: 'photo', cbString: 'photo' },
          { text: 'Cancel', cbString: 'cancel' },
        ],
        [{ text: 'Done', cbString: 'editing_done' }],
      ]),
    ];
  }

  async editFieldDispay(editFiled: string) {
    switch (editFiled) {
      case 'ar_br':
        return this.arBrOptionDisplay();
      case 'bi_di':
        return this.bIDIOptionDisplay();
      case 'woreda':
        return this.woredaListDisplay();
      case 'last_digit':
        return this.lastDidtitPrompt();
      case 'location':
        return this.locationPrompt();
      case 'description':
        return this.descriptionPrompt();

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

export default QustionPostFormatter;
