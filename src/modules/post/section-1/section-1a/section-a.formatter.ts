import { InlineKeyboardButtons, MarkupButtons } from '../../../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../../../types/components';
import config from '../../../../config/config';

class QustionPostFormatter {
  categories: TableMarkupKeyboardButtons;
  arBrOption: TableInlineKeyboardButtons;
  bIDiOption: TableInlineKeyboardButtons;
  backOption: TableMarkupKeyboardButtons;
  woredaList: TableInlineKeyboardButtons;
  messages = {
    useButtonError: 'Please use Buttons to select options',
    categoryPrompt: 'Please Choose on category from the options',
    optionPrompt: 'Please Choose on category from the options',
    arBrPromt: 'Please Choose from two',
    chosseWoredaPrompt: 'Please Choose Your Woreda',
    biDiPrompt: 'Please Choose ID first Icon',
    lastDigitPrompt: 'Enter Last Digit',
    locationPrompt: 'Enter sub city and location',
    descriptionPrompt: `Enter Description maximum ${config.desc_word_length} words`,
    attachPhotoPrompt: 'Attach four photos ',
    reviewPrompt: 'Preview your post and press once you are done',
    postSuccessMsg: 'Posted Successfully',
    postErroMsg: 'Post Error',
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
    return [this.messages.categoryPrompt];
  }
  chooseOptionDisplayString() {
    return [this.messages.optionPrompt];
  }
  chooseOptionDisplay() {
    return [MarkupButtons(this.categories, true)];
  }
  arBrOptionDisplay() {
    return [this.messages.arBrPromt, InlineKeyboardButtons(this.arBrOption)];
  }
  woredaListDisplay() {
    return [this.messages.chosseWoredaPrompt, InlineKeyboardButtons(this.woredaList)];
  }
  bIDIOptionDisplay() {
    return [this.messages.biDiPrompt, InlineKeyboardButtons(this.bIDiOption), this.goBackButton(false)];
  }
  lastDidtitDisplay() {
    return [this.messages.lastDigitPrompt, this.goBackButton(false)];
  }
  locationDisplay() {
    return [this.messages.locationPrompt, this.goBackButton(false)];
  }
  descriptionDisplay() {
    return [this.messages.descriptionPrompt, this.goBackButton(false)];
  }
  photoDisplay() {
    return [this.messages.attachPhotoPrompt, this.goBackButton(false)];
  }

  getPreviewData(state: any) {
    return `#${state.category.replace(/ /g, '_')}\n________________\n\n${state.ar_br.toLocaleUpperCase()}\n\nWoreda: ${state.woreda} \n\nLast digit: ${state.last_digit} ${state.bi_di.toLocaleUpperCase()} \n\nSp. Locaton: ${state.location} \n\nDescription: ${state.description} \nBy: <a href="${config.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n\nStatus : ${state.status}`;
  }

  preview(state: any, submitState: string = 'preview') {
    return [
      this.getPreviewData(state),
      submitState == 'preview'
        ? InlineKeyboardButtons([
            [
              { text: 'Edit', cbString: 'preview_edit' },
              { text: 'Notify settings', cbString: 'notify_settings' },
              { text: 'Post', cbString: 'post_data' },
            ],
            [
              { text: 'Mention previous post', cbString: 'mention_previous_post' },
              { text: 'Cancel', cbString: 'cancel' },
            ],
          ])
        : this.getPostSubmitButtons(submitState),
    ];
  }

  getPostSubmitButtons(submitState: string) {
    return submitState == 'submitted'
      ? InlineKeyboardButtons([
          [{ text: 'Cancel', cbString: 'cancel_post' }],
          [{ text: 'Main menu', cbString: 'main_menu' }],
        ])
      : InlineKeyboardButtons([
          [{ text: 'Resubmit', cbString: 're_submit_post' }],
          [{ text: 'Main menu', cbString: 'main_menu' }],
        ]);
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
        return this.lastDidtitDisplay();
      case 'location':
        return this.locationDisplay();
      case 'description':
        return this.descriptionDisplay();

      case 'photo':
        return this.photoDisplay();
      case 'cancel':
        return await this.goBackButton();
      default:
        return ['none'];
    }
  }

  previewCallToAction() {
    return [this.messages.reviewPrompt];
  }

  postingSuccessful() {
    return [this.messages.postSuccessMsg];
  }
  postingError() {
    return [this.messages.postErroMsg];
  }
}

export default QustionPostFormatter;
