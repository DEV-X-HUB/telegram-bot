import { InlineKeyboardButtons, MarkupButtons } from '../../../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../../../types/components';
import config from '../../../../config/config';
import { areEqaul } from '../../../../utils/constants/string';
import { NotifyOption } from '../../../../types/params';

class Post1AFormatter {
  categories: TableMarkupKeyboardButtons;
  arBrOption: TableInlineKeyboardButtons;
  bIDiOption: TableInlineKeyboardButtons;
  backOption: TableMarkupKeyboardButtons;
  woredaList: TableInlineKeyboardButtons;
  messages = {
    useButtonError: 'Please use Buttons to select options',
    categoryPrompt: 'Please Choose on category from the options',
    notifyOptionPrompt: 'Select who can be notified this question',
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
    mentionPost: 'Select post to mention',
    noPreviousPosts: "You don't have any approved question before.",
    somethingWentWrong: 'Something went wrong, please try again',
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

  notifyOptionDisplay(notifyOption: NotifyOption) {
    return [
      this.messages.notifyOptionPrompt,
      InlineKeyboardButtons([
        [
          {
            text: `${areEqaul(notifyOption, 'follower', true) ? '✅' : ''} Your Followers`,
            cbString: `notify_follower`,
          },
        ],
        [
          {
            text: `${areEqaul(notifyOption, 'friend', true) ? '✅' : ''} Your freinds (People you follow and follow you)`,
            cbString: `notify_friend`,
          },
        ],
        [{ text: `${areEqaul(notifyOption, 'none', true) ? '✅' : ''} none`, cbString: `notify_none` }],
      ]),
    ];
  }

  getDetailData(state: any) {
    return `${state.mention_post_data ? `<i>Related from: \n\n${state.mention_post_data}</i>\n_____________________\n\n` : ''}<b>#${state.category.replace(/ /g, '_')}</b>\n________________\n\n<b>${state.arbr_value?.toLocaleUpperCase()}</b>\n\n<b>Woreda:</b> ${state.woreda} \n\n<b>Last digit:</b> ${state.last_digit} ${state.id_first_option?.toLocaleUpperCase()} \n\n<b>Sp. Locaton:</b> ${state.location} \n\n<b>Description:</b> ${state.description} \n\n<b>By:</b> <a href="${config.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status :</b> ${state.status}`;
  }

  getPreviewData(state: any) {
    return `<b>#${state.category.replace(/ /g, '_')}</b>\n________________\n\n<b>${state.arbr_value?.toLocaleUpperCase()}</b>\n\n<b>Description:</b> ${state.description} \n\n<b>By:</b> <a href="${config.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status :</b> ${state.status}`;
  }

  noPostsErrorMessage() {
    return [this.messages.noPreviousPosts];
  }
  mentionPostMessage() {
    return [this.messages.mentionPost, this.goBackButton()];
  }
  displayPreviousPostsList(post: any) {
    // Check if post.description is defined before accessing its length
    const description =
      post.description && post.description.length > 20 ? post.description.substring(0, 30) + '...' : post.description;

    const message = `#${post.category}\n_______\n\nDescription : ${description}\n\nStatus : ${post.status}`;

    const buttons = InlineKeyboardButtons([
      [
        { text: 'Select post', cbString: `select_post_${post.id}` },
        { text: 'Back', cbString: 'back' },
      ],
    ]);
    return [message, buttons];
  }

  preview(state: any, submitState: string = 'preview') {
    return [
      this.getDetailData(state),
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
      this.getDetailData(state),
      InlineKeyboardButtons([
        [
          { text: 'AR/BR', cbString: 'arbr_value' },
          { text: 'BI/DI', cbString: 'id_first_option' },
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
          { text: 'Cancel', cbString: 'cancel_edit' },
        ],
        [{ text: 'Done', cbString: 'editing_done' }],
      ]),
    ];
  }

  async editFieldDispay(editFiled: string) {
    switch (editFiled) {
      case 'arbr_value':
        return this.arBrOptionDisplay();
      case 'id_first_option':
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

export default Post1AFormatter;
