import { InlineKeyboardButtons, MarkupButtons } from '../../../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../../../types/components';
import { areEqaul } from '../../../../utils/constants/string';
import config from '../../../../config/config';
import { NotifyOption } from '../../../../types/params';

class ConstructionFormatter {
  inlineBackButton: TableInlineKeyboardButtons;
  messages = {
    useButtonError: 'Please use buttons to select options',
    unknowOptionError: 'Unknown Option!',
    notifyOptionPrompt: 'Select who can be notified this question',
    sizePrompt: 'Please specify the size',
    locationPrompt: 'Please enter your location',
    companyExpriencePrompt: 'Please choose of the company',
    landSizePrompt: 'Please choose prefered land size',
    documentRequestTypePrompt: 'Please choose document request',
    landStatusPrompt: 'Please enter  land status',
    descriptionPrompt: `Enter Description maximum ${config.desc_word_length} words`,
    attachPhotoPrompt: 'Attach four images with diffrent angle',
    reviewPrompt: 'Preview your post and press once you are done',
    postSuccessMsg: 'Posted Successfully',
    postErroMsg: 'Post Error',
    mentionPost: 'Select post to mention',
    noPreviousPosts: "You don't have any approved question before.",
    somethingWentWrong: 'Something went wrong',
  };
  sizeOption: TableInlineKeyboardButtons = [
    [
      { text: 'Big', cbString: 'Big' },
      { text: 'Small', cbString: 'Small' },
    ],
    [{ text: 'Back', cbString: 'back' }],
  ];
  companyExperienceOption: TableInlineKeyboardButtons = [
    [
      { text: '1 Year', cbString: '1 Year' },
      { text: '2-5 Years', cbString: '2-5 Years' },
      { text: '5-10 Year', cbString: '5-10 Year' },
    ],
    [
      { text: '10+ Years', cbString: '10+ Years' },
      { text: 'Back', cbString: 'back' },
    ],
  ];
  landSizeOption: TableInlineKeyboardButtons = [
    [
      { text: '<100m2', cbString: '<100m2' },
      { text: '100-300m2', cbString: '100-300m2' },
      { text: '300-600m2', cbString: '300-600m2' },
    ],
    [
      { text: '600-900m2', cbString: '600-900m2' },
      { text: '900-1200m2', cbString: '900-1200m2' },
      { text: '1200-1500m2', cbString: '1200-1500m2' },
    ],
    [
      { text: '1500-1800m2', cbString: '1500-1800m2' },
      { text: '1800-2100m2', cbString: '1800-2100m2' },
      { text: '2100-2400m2', cbString: '2100-2400m2' },
    ],
    [
      { text: '2400-2700m2', cbString: '2400-2700m2' },
      { text: '2700-3000m2', cbString: '2700-3000m2' },
      { text: '3000-3300m2', cbString: '3000-3300m2' },
    ],

    [
      { text: 'Above 3300m2', cbString: 'Above 3300m2' },
      { text: 'Back', cbString: 'back' },
    ],
  ];
  documentRequestOption: TableInlineKeyboardButtons = [
    [{ text: 'Update documents', cbString: 'Update documents' }],
    [{ text: 'Renew professional license', cbString: 'Renew professional license' }],
    [{ text: 'Upgrade company grade', cbString: 'Upgrade company grade' }],
    [{ text: 'Back', cbString: 'back' }],
  ];
  landStatusOption: TableInlineKeyboardButtons = [
    [{ text: 'Under consruction', cbString: 'Under consruction' }],
    [{ text: 'New construction', cbString: 'New construction' }],
    [{ text: 'As built', cbString: 'As built' }],
    [{ text: 'Back', cbString: 'back' }],
  ];
  backOption: TableInlineKeyboardButtons = [[{ text: 'Back', cbString: 'back' }]];

  constructor() {
    this.inlineBackButton = [[{ text: 'Back', cbString: 'back' }]];
  }
  goBackButton(oneTime: boolean = true) {
    return MarkupButtons(this.backOption, oneTime);
  }
  chooseSizeDisplay() {
    return [this.messages.sizePrompt, InlineKeyboardButtons(this.sizeOption)];
  }
  companyExpienceDisplay() {
    return [this.messages.companyExpriencePrompt, InlineKeyboardButtons(this.companyExperienceOption)];
  }
  documentRequestDisplay() {
    return [this.messages.documentRequestTypePrompt, InlineKeyboardButtons(this.documentRequestOption)];
  }
  landSizeDisplay() {
    return [this.messages.landSizePrompt, InlineKeyboardButtons(this.landSizeOption)];
  }
  landStatusDisplay() {
    return [this.messages.landStatusPrompt, InlineKeyboardButtons(this.landStatusOption)];
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
    if (areEqaul(state.size, 'small', true))
      return `${state.mention_post_data ? `Related from: \n\n${state.mention_post_data}\n_____________________\n\n` : ''}#${state.category}\n________________\n\n${state.size} \n\nLocation: ${state.location}  \n\nExperience: ${state.company_experience} \n\nDocument: ${state.document_request_type}\n\nDescription: ${state.description} \n\nContact: @resurrection99 \n\nBy: <a href="${config.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n\nStatus : ${state.status}`;
    return `${state.mention_post_data ? `Related from: \n\n${state.mention_post_data}\n_____________________\n\n` : ''}#${state.category}\n________________\n\n${state.size} \n\nLang size: ${state.land_size} \n\nLand Status: ${state.land_status}\n\nLocation: ${state.location}\n\nDescription: ${state.description} \n\n
    By: <a href="${config.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\nStatus : ${state.status}`;
  }

  preview(state: any, submitState: string = 'preview') {
    return [
      this.getPreviewData(state),
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
      areEqaul(state.size, 'small', true)
        ? InlineKeyboardButtons([
            [
              { text: 'Location', cbString: 'location' },
              { text: 'Company Experience', cbString: 'company_experience' },
            ],

            [
              { text: 'Document', cbString: 'document_request_type' },
              { text: 'Description', cbString: 'description' },
            ],
            [{ text: 'Done', cbString: 'editing_done' }],
          ])
        : InlineKeyboardButtons([
            [
              { text: 'Land Size', cbString: 'land_size' },
              { text: 'Land Status', cbString: 'land_status' },
            ],
            [
              { text: 'Location', cbString: 'location' },
              { text: 'Description', cbString: 'description' },
            ],

            [{ text: 'Done', cbString: 'editing_done' }],
          ]),
    ];
  }

  async editFieldDispay(editFiled: string) {
    switch (editFiled) {
      case 'land_size':
        return this.landSizeDisplay();
      case 'land_status':
        return this.landStatusDisplay();
      case 'document_request_type':
        return this.documentRequestDisplay();
      case 'company_experience':
        return this.companyExpienceDisplay();
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

  noPostsErrorMessage() {
    return [this.messages.noPreviousPosts, InlineKeyboardButtons(this.inlineBackButton)];
  }

  postingSuccessful() {
    return [this.messages.postSuccessMsg];
  }
  postingError() {
    return [this.messages.postErroMsg];
  }

  somethingWentWrongError() {
    return [this.messages.somethingWentWrong];
  }
}

export default ConstructionFormatter;
