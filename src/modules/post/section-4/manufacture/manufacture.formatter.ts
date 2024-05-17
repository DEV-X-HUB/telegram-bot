import { InlineKeyboardButtons, MarkupButtons } from '../../../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../../../types/ui';
import { areEqaul } from '../../../../utils/constants/string';
import { NotifyOption } from '../../../../types/params';
import config from '../../../../config/config';

class ManufactureFormatter {
  estimatedCapitalOption: TableInlineKeyboardButtons;
  numberOfWorkerOption: TableInlineKeyboardButtons;
  backOption: TableMarkupKeyboardButtons;
  messages = {
    useButtonError: 'Please use buttons to select options',
    unknowOptionError: 'Unknown Option!',
    notifyOptionPrompt: 'Select who can be notified this question',
    sectorPrompt: 'Specific sector for manufacture?',
    numberOfWorkerPrompt: 'Number of worker provide?',
    estimatedCapitalPrompt: 'What is the estimated capital?',
    enterpriseNamePrompt: 'Name for the small scale enterprise?',
    descriptionPrompt: 'Enter description maximimum 45 words',
    photoPrompt: 'Attach four clear images with different angles',
    postingSuccessful: 'Posted Successfully',
    inputError: 'Invalid input, please try again',
    reviewPrompt: 'Preview your post and press once you are done',
    postingSuccess: 'Posted Successfully',
    postErroMsg: 'Post Error',
    mentionPost: 'Select post to mention',
    noPreviousPosts: "You don't have any approved question before.",
    somethingWentWrong: 'Something went wrong',
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

  getDetailData(state: any) {
    return `<b>#${state.category.replace(/ /g, '_')} </b>\n\n________________\n\n<b>Title </b>: ${state.sector}\n\n<b>Worker</b>: ${state.number_of_worker} \n\n<b>Estimated Capital</b>: ${state.estimated_capital} \n\n<b>Enterprise Name</b>: ${state.enterprise_name} \n\n<b>Description</b>: ${state.description} \n\n<b>By</b>: <a href="${config.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>
    \n\n<b>Status</b> : ${state.status}`;
  }

  getPreviewData(state: any) {
    return `<b>#${state.category.replace(/ /g, '_')} </b>\n\n________________\n\n<b>Title </b>: ${state.sector}\n\n<b>Enterprise Name</b>: ${state.enterprise_name} \n\n<b>Description</b>: ${state.description} \n\n<b>By</b>: <a href="${config.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n\n<b>Status</b> : ${state.status}`;
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

  mentionPostMessage() {
    return [this.messages.mentionPost, this.goBackButton()];
  }

  displayPreviousPostsList(post: any) {
    // Check if post.description is defined before accessing its length
    const description =
      post.description && post.description.length > 20 ? post.description.substring(0, 30) + '...' : post.description;

    const message = `#${post.category}\n_______\n\n<b>Description </b>: ${description}\n\n<b>Status</b> : ${post.status}`;

    const buttons = InlineKeyboardButtons([
      [
        { text: 'Select post', cbString: `select_post_${post.id}` },
        { text: 'Back', cbString: 'back' },
      ],
    ]);
    return [message, buttons];
  }

  noPostsErrorMessage() {
    return [this.messages.noPreviousPosts, InlineKeyboardButtons(this.backOption)];
  }

  postingSuccessful() {
    return ['Posted Successfully'];
  }

  postingError() {
    return ['Posting failed'];
  }
  inputError() {
    return ['Invalid input, please try again'];
  }
  somethingWentWrongError() {
    return [this.messages.somethingWentWrong];
  }
}

export default ManufactureFormatter;
