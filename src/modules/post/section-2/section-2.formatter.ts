import { InlineKeyboardButtons, MarkupButtons } from '../../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../../types/components';
import config from '../../../config/config';
import { NotifyOption } from '@prisma/client';
import { areEqaul } from '../../../utils/constants/string';

class Post2Formatter {
  backOption: TableMarkupKeyboardButtons;
  typeOptions: TableInlineKeyboardButtons;
  messages = {
    typePrompt: 'What are you Looking for',
    enterTitlePrompt: 'Enter Title',
    typePrompt1: '',

    descriptionPrompt: `Enter Description maximum ${config.desc_word_length} words`,
    attachPhotoPromp: 'Attach a photo',
    useButtonError: 'Please use Buttons to select options',
    mentionPost: 'Select post to mention',
    noPreviousPosts: "You don't have any approved question before.",
    somethingWentWrong: 'Something went wrong, please try again',
    notifyOptionPrompt: 'Select who can be notified this question',
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
  photoDisplay() {
    return [this.messages.attachPhotoPromp, this.goBackButton(false)];
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
    return `#${state.category}\n________________\n\n${state.service_type} \n\n\Title: ${state.title}  \n\nDescription: ${state.description} \n\nBy: <a href="${config.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\nStatus : ${state.status}`;
  }

  getPreviewData(state: any) {
    return `#${state.category}\n________________\n\n${state.service_type} \n\n\Title: ${state.title}  \n\nDescription: ${state.description} \n\nBy: <a href="${config.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\nStatus : ${state.status}`;
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
      case 'service_type':
        return this.typeOptionsDisplay();
      case 'title':
        return this.enterDescriptionDisplay();
      case 'description':
        return this.enterDescriptionDisplay();

      case 'photo':
        return this.photoDisplay();
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

export default Post2Formatter;
