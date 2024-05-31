import { InlineKeyboardButtons, MarkupButtons } from '../../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../../types/ui';
import config from '../../../config/config';
import { NotifyOption } from '../../../types/params';
import { areEqaul, trimParagraph } from '../../../utils/helpers/string';

class Section3Formatter {
  birthOrMaritalOption: TableInlineKeyboardButtons;
  backOption: TableMarkupKeyboardButtons;
  messages = {
    chooseOption: 'Choose an option',
    titlePrompt: 'What is the title?',
    useButtonError: 'Please use Buttons to select options',
    categoryPrompt: 'Please Choose on category from the options',
    notifyOptionPrompt: 'Select who can be notified this question',
    reviewPrompt: 'Preview your post and press once you are done',
    optionPrompt: 'Please Choose on category from the options',
    attachPhotoPrompt: 'Attach one photo',
    descriptionPrompt: `Enter Description maximum ${config.desc_word_length} words`,
    postSuccessMsg: 'Posted Successfully',
    postErroMsg: 'Post Error',
    mentionPost: 'Select post to mention',
    noPreviousPosts: "You don't have any approved question before.",
    somethingWentWrong: 'Something went wrong, please try again',
  };
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
    return [this.messages.chooseOption, InlineKeyboardButtons(this.birthOrMaritalOption)];
  }
  titlePrompt() {
    return [this.messages.titlePrompt, this.goBackButton(false)];
  }
  descriptionPrompt() {
    return [this.messages.descriptionPrompt];
  }
  photoPrompt() {
    return [this.messages.attachPhotoPrompt, this.goBackButton(false)];
  }

  goBackButton(oneTime: boolean = true) {
    return MarkupButtons(this.backOption, oneTime);
  }

  getDetailData(state: any) {
    return `${state.mention_post_data ? `<i>Related from:</i> \n\n${state.mention_post_data}\n\n` : ''}<b>#${state.category}</b>\n\n________________\n\n<b>${state.birth_or_marital}</b>\n\n<b>Title:</b> ${state.title} \n\n<b>Description:</b> ${state.description} \n\n<b>By:</b> <a href="${config.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status</b> : ${state.status}`;
  }

  getPreviewData(state: any) {
    return `<b>#${state.category}</b>\n\n________________\n\n<b>${state.birth_or_marital}</b>\n\n<b>Description:</b> ${trimParagraph(state.description)} \n\nBy: <a href="${config.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status :</b> ${state.status}`;
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

  postingSuccessful() {
    return ['Posted Successfully'];
  }

  displayError() {
    return ['Invalid input, please try again'];
  }

  previewCallToAction() {
    return [this.messages.reviewPrompt];
  }

  postingError() {
    return [this.messages.postErroMsg];
  }
  somethingWentWrong() {
    return [this.messages.somethingWentWrong];
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
}

export default Section3Formatter;
