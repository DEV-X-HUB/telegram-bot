import { InlineKeyboardButtons, MarkupButtons } from '../../../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../../../types/components';
import config from '../../../../config/config';
import { NotifyOption } from '../../../../types/params';
import { areEqaul } from '../../../../utils/constants/string';

class ChickenFarmFormatter {
  estimatedCapitalOption: TableInlineKeyboardButtons;
  backOption: TableMarkupKeyboardButtons;
  inlineBackButton: TableInlineKeyboardButtons;
  messages = {
    sectorPrompt: 'Specific sector for chicken farm?',
    estimatedCapitalPrompt: 'What is the estimated capital?',
    enterpriseNamePrompt: 'Name for the small scale enterprise?',
    descriptionPrompt: 'Enter description maximimum 45 words',
    notifyOptionPrompt: 'Select who can be notified this question',
    displayError: 'Invalid input, please try again',
    postingSuccessful: 'Posted Successfully',
    postingError: 'Posting failed',
    mentionPost: 'Select post to mention',
    noPreviousPosts: "You don't have any approved question before.",
    somethingWentWrong: 'Something went wrong, please try again',
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

    this.inlineBackButton = [[{ text: 'Back', cbString: 'back' }]];
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

  //  </b>
  //  <b>

  //  <i>
  // </i>

  getDetailData(state: any) {
    return `${state.mention_post_data ? `Related from: \n\n<i>${state.mention_post_data}</i>\n_____________________\n\n` : ''}<b>#${state.category}</b>\n_______\n\n <b>Title </b>: ${state.sector}\n\n <b>Estimated Capital </b>: ${state.estimated_capital} \n\n<b>Enterprise Name </b>: ${state.enterprise_name} \n\n <b>Description</b>: ${state.description} \n\n\<b>By </b>: <a href="${config.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status</b> : ${state.status}`;
  }

  getPreviewData(state: any) {
    return `<b>#${state.category}<b>\n_______\n\n<b>Title</b>: ${state.sector}\n\n <b>Description </b>: ${state.description} \n\n\<b>By</b>: <a href="${config.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n <b>Status </b> : ${state.status}`;
  }

  noPostsErrorMessage() {
    return [this.messages.noPreviousPosts, InlineKeyboardButtons(this.inlineBackButton)];
  }
  mentionPostMessage() {
    return [this.messages.mentionPost, this.goBackButton()];
  }

  displayPreviousPostsList(post: any) {
    // Check if post.description is defined before accessing its length
    const description =
      post.description && post.description.length > 20 ? post.description.substring(0, 30) + '...' : post.description;

    const message = `<b>#${post.category}</b>\n_______\n\n<b>Description</b>: ${description}\n\n<b>Status</b> : ${post.status}`;

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
              { text: 'Notify Settings', cbString: 'notify_settings' },
              { text: 'Post', cbString: 'post_data' },
            ],
            [
              {
                text: `${state.mention_post_data ? 'Remove mention post' : 'Mention previous post'}`,
                // cbString : 'Mention previous post'

                cbString: `${state.mention_post_data ? 'remove_mention_previous_post' : 'mention_previous_post'}`,
              },
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
    return [this.messages.displayError];
  }

  postingSuccessful() {
    return [this.messages.postingSuccessful];
  }

  postingError() {
    return [this.messages.postingError];
  }

  somethingWentWrongError() {
    return [this.messages.somethingWentWrong];
  }
}

export default ChickenFarmFormatter;
