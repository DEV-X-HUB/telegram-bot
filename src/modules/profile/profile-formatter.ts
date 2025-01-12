import { Markup } from 'telegraf';
import { InlineKeyboardButtons, MarkupButtons } from '../../ui/button';
import {
  breakeArrayTowNColumn,
  getCitiesOfCountry,
  getFilteredCoutryList,
  getSelectedCoutryList,
  iterateCities,
} from '../../utils/helpers/country-list';
import { ICity } from 'country-state-city';
import { areEqaul, capitalizeFirstLetter } from '../../utils/helpers/string';
import { formatDateFromIsoString } from '../../utils/helpers/date';
import config from '../../config/config';
import { NotifyOption } from '../../types/params';
import PostFormatter from '../post/post.formmater';

type PostUpdateStatus = 'open' | 'close' | 'cancel' | 'pending';

class ProfileFormatter {
  postFormtter;
  countries: any[] = [];
  countryCodes: any[] = ['et'];
  previewButtons = [
    [{ text: '✏️ Edit Profile', cbString: `edit_profile` }],
    [{ text: 'My Posts', cbString: `my_posts` }],
    [
      { text: 'Followers', cbString: `my_followers` },
      { text: 'Following', cbString: `my_followings` },
    ],
    [
      { text: 'Setting', cbString: `profile_setting` },
      { text: 'Back', cbString: `back` },
    ],
  ];
  backButtonCallback = [[{ text: 'Back', cbString: `back` }]];
  editOptionsButtons = [
    [{ text: ' Edit Name', cbString: `display_name` }],
    [{ text: 'Edit Bio', cbString: `bio` }],
    [{ text: 'Edit Gender', cbString: `gender` }],
    [{ text: 'Back', cbString: `back` }],
  ];
  settingButtons = [
    [{ text: 'Post Notify Setting', cbString: `notify_setting` }],
    [{ text: 'Back', cbString: `back` }],
  ];
  clearDisplayNameButton = [[{ text: 'Or Be Anonymous', cbString: `clear_display_name` }]];

  messages = {
    notifyOptionPrompt: 'Select who can be notified this question',
    useButtonError: 'Please use the buttons above to choose ',
    dbError: 'Unable to process your request please try again ',
    userExitErrorMsg: 'You have already registed for this bot. feel free to navigate other services',
    termsAndConditionsPromt:
      'Do you agree with these Terms and Conditions?  Please select Yes or No from the Buttons below',
    termsAndConditionsDisagreeWarning:
      'You can not use this platform without accepting the terms and conditions. Please accept the terms and conditions with the above button to proceed.',
    shareContactPrompt: 'lets start your first registration. Please share your contact.',
    shareContactWarning:
      'You have to share your contact to proceed. Please use the "Share Contact" button below to share your contact.',
    namePrompt: 'Please enter your name ',
    bioPrompt: 'Please enter your Bio ',
    genderPrompt: ' Please select your gender ',
    emailPrompt: ' Please enter your personal Email ',
    countryPrompt: ' Please choose your country ',
    cityPrompt: ' Please choose your City ',
    settingPrompt: ' Customize your experience',

    postFetchError: 'Unable to fetch your posts',
    noPostMsg: 'Your have not posted any thing yet !',
    updateNotifyOptionError: 'Unable to change notify setting!',
    displayNameTakenMsg: 'The name is reserved!, Please try another.',
    userBlockPrompt: 'Are you sure you want to block? ',
    blockSuccess: 'You have blocked  this user',
    unBlockSuccess: 'You have unblocked this user',
    userNotFound: 'User Not Found',
  };
  constructor() {
    this.countries = getSelectedCoutryList();
    this.postFormtter = new PostFormatter();
  }

  postActions(post_id: string, status: PostUpdateStatus) {
    if (status == 'pending')
      return [
        [
          {
            text: 'Cancel',
            cbString: `cancelPost:${post_id}`,
          },
        ],
      ];

    if (status == 'open') {
      return [
        [
          {
            text: 'Close',
            cbString: `closePost:${post_id}`,
          },
        ],
      ];
    }

    if (status == 'close') {
      return [
        [
          {
            text: 'Open',
            cbString: `openPost:${post_id}`,
          },
        ],
      ];
    }
    return [
      [
        {
          text: 'Open',
          cbString: `openPost:${post_id}`,
        },
      ],
    ];
  }

  postPreview(post: any) {
    if (!post) return ["You don't have any questions yet. Click on 'Post Question' below to start."];

    return [
      this.postFormtter.getFormattedQuestionPreview(post),
      InlineKeyboardButtons(this.postActions(post.id, post.status)),
    ];
  }

  useButtonError(optionName: string) {
    return this.messages.useButtonError + optionName;
  }

  blockSuccess(user_displayname: any) {
    return [...(this.messages.blockSuccess + user_displayname)];
  }
  unBlockSuccess(user_displayname: any) {
    return [...(this.messages.unBlockSuccess + user_displayname)];
  }
  preview(userData: any) {
    return [this.formatePreview(userData), InlineKeyboardButtons(this.previewButtons)];
  }
  blockUserDisplay(user: any) {
    const blockBriefication = 'Blocking means no interaction with user';
    return [
      `${this.messages.userBlockPrompt} ${user.display_name}\n\n` + blockBriefication,
      InlineKeyboardButtons([
        [
          { text: ' Yes, Block ', cbString: `blockUser'_${user.id}` },
          { text: 'No, Cancel', cbString: `cancelBlock'_${user.id}` },
        ],
      ]),
    ];
  }
  profilePreviwByThirdParty(userData: any, followed: boolean, bloked: boolean) {
    // -------------
    return [
      this.formatePreviewByThirdParty(userData),
      InlineKeyboardButtons([
        [
          {
            text: `${followed ? 'Unfollow' : 'Follow'}`,
            cbString: `${followed ? 'unfollow' : 'follow'}_${userData.id}`,
          },

          {
            text: `💬 Message`,
            cbString: `sendMessage_${userData.id}`,
          },
          {
            text: `${bloked ? '⭕️ Unblock' : '🚫 Block'}`,
            cbString: `${bloked ? 'unblock' : 'asktoBlock'}_${userData.id}`,
          },
        ],
      ]),
    ];
  }
  getProfileButtons(user_id: any, followed: boolean, bloked: boolean) {
    return [
      {
        text: `${followed ? 'Unfollow' : 'Follow'}`,
        callback_data: `${followed ? 'unfollow' : 'follow'}_${user_id}`,
      },

      {
        text: `💬 Message`,
        callback_data: `sendMessage_${user_id}`,
      },
      {
        text: `${bloked ? '⭕️ Unblock' : '🚫 Block'}`,
        callback_data: `${bloked ? 'unblock' : 'asktoBlock'}_${user_id}`,
      },
    ];
  }

  formatePreview(userData: any) {
    const header = `${userData.display_name || `Anonymous${areEqaul(userData.gender, 'male', true) ? '👨‍🦱' : ' 👧'}`}   | ${userData.followers} Followers | ${userData.followings} Followings\n`;
    const gap = '---------------------------------------\n';
    const qaStat = `Posted ${userData.posts} Posts, Joined ${formatDateFromIsoString(userData.created_at)}\n`;
    const bio = `\nBio: ${userData.bio || 'none'}`;
    return header + gap + qaStat + bio;
  }
  formatePreviewByThirdParty(userData: any) {
    const header = `${userData.display_name || `Anonymous${areEqaul(userData.gender, 'male', true) ? ' 👨‍🦱' : ' 👧'}`}  | ${userData.followers.length} Followers | ${userData.followings.length} Followings\n`;
    const gap = '---------------------------------------\n';
    const qaStat = `Posted ${userData.posts.length} Posts, Joined ${formatDateFromIsoString(userData.created_at)}\n`;
    const bio = `\nBio: ${userData.bio || 'none'}`;
    return header + gap + qaStat + bio;
  }

  editOptions() {
    return ['Edit your Profile', InlineKeyboardButtons(this.editOptionsButtons)];
  }

  genderOpton(gender: string) {
    return [
      [{ text: `${areEqaul(gender, 'male', true) ? '✅' : ''} Male`, cbString: `male` }],
      [{ text: `${areEqaul(gender, 'female', true) ? '✅' : ''} Female`, cbString: `female` }],
      [{ text: 'Back', cbString: `back` }],
    ];
  }

  editPrompt(editFiled: string, gender: string) {
    switch (editFiled) {
      case 'display_name':
        return [this.messages.namePrompt, this.goBackButton()];
      case 'bio':
        return [this.messages.bioPrompt, this.goBackButton()];
      case 'gender':
        return [this.messages.genderPrompt, InlineKeyboardButtons(this.genderOpton(gender))];
      default:
        return [this.messages.namePrompt, this.goBackButton()];
    }
  }

  formateFollowersList(followers: any[]) {
    let followerList = '';
    const header = `${followers.length} Followers  \n`;
    const gap = '\n-----------------------------------\n';

    if (followers.length == 0)
      return [
        header + gap + "You don't have any followers yet." + gap,
        InlineKeyboardButtons([[{ text: '🔙back', cbString: 'back' }]]),
      ];

    followers.forEach((follower, index) => {
      followerList += ` <a href="${config.bot_url}?start=userProfile_${follower.id}">${follower.display_name != null ? follower.display_name : 'Anonymous '}</a> ${followers.length == index + 1 ? '' : '\n'}`;
    });

    return [header + gap + followerList + gap, InlineKeyboardButtons([[{ text: '🔙back', cbString: 'back' }]])];
  }
  formateFollowingsList(followings: any[]) {
    let followingList = '';
    const header = `${followings.length} followings \n`;
    const gap = '\n-----------------------------------\n';

    if (followings.length == 0)
      return [
        header + gap + 'You are not following anynone' + gap,
        InlineKeyboardButtons([[{ text: '🔙back', cbString: 'back' }]]),
      ];

    followings.forEach((following, index) => {
      followingList += ` <a href="${config.bot_url}?start=userProfile_${following.id}">${following.display_name != null ? following.display_name : 'Anonymous '}</a> ${followings.length == index + 1 ? '' : '\n'}`;
    });

    return [header + gap + followingList + gap, InlineKeyboardButtons([[{ text: '🔙back', cbString: 'back' }]])];
  }

  termsAndConditionsDisplay() {
    return [
      this.messages.termsAndConditionsPromt,
      InlineKeyboardButtons([
        [
          { text: 'Yes', cbString: 'agree_terms' },
          { text: 'No', cbString: 'dont_agree_terms' },
        ],
        [{ text: 'Back', cbString: 'back_from_terms' }],
      ]),
    ];
  }
  userExistMessage() {
    return [`You have already registed for this bot. feel free to navigate other services`];
  }

  termsAndConditionsDisagreeDisplay() {
    return [
      `You can not use this platform without accepting the terms and conditions. Please accept the terms and conditions with the above button to proceed.`,
    ];
  }
  deleteMarkup() {
    return Markup.removeKeyboard();
  }

  goBackButton(withSkip?: boolean) {
    //back button with callback string
    if (withSkip)
      return MarkupButtons([
        [
          { text: 'Back', cbString: 'back' },
          { text: 'Skip', cbString: 'skip' },
        ],
      ])
        .oneTime()
        .resize()
        .persistent(false);

    return Markup.keyboard([Markup.button.callback('Back', 'back')])
      .oneTime()
      .resize()
      .persistent(false);
  }

  shareContactWarning() {
    return [
      'You have to share your contact to proceed. Please use the "Share Contact" button below to share your contact.',
    ];
  }

  firstNameformatter() {
    return [`Please enter your first name `, this.goBackButton()];
  }

  lastNameformatter() {
    return [`Please enter your last name`, this.goBackButton()];
  }

  ageFormatter() {
    return [
      `Please  your age as a number between 14 - 100 OR enter your date of Birth in dd/mm/yyyy format  `,
      this.goBackButton(),
    ];
  }
  chooseGenderFormatter(editing?: boolean) {
    return [
      '  Please choose your gender',
      InlineKeyboardButtons([
        [
          { text: 'Male', cbString: 'Male' },
          { text: 'Female', cbString: 'Female' },
        ],
        editing ? [] : [{ text: 'Back', cbString: 'Back' }],
      ]),
    ];
  }

  chooseGenderEroorFormatter() {
    return [`Please use the buttons above to choose gender`];
  }
  emailFormatter(editing?: boolean) {
    // if the email is bieng edidted skip button is not shown
    return [`Please enter your personal Email `, this.goBackButton(editing ? false : true)];
  }

  async chooseCountryFormatter(editing?: boolean) {
    const countries = await getFilteredCoutryList(this.countryCodes);
    return [
      'Please choose your country',
      InlineKeyboardButtons([
        // map the country list to the buttons
        ...countries.map((country: any) => [
          { text: `${country.flag} ${country.name}`, cbString: `${country.isoCode}:${country.name}` },
        ]),
        [{ text: 'Back', cbString: 'Back' }],
      ]),
    ];
  }

  // choose city based on the selected country
  async chooseCityFormatter(countryCode: string, currentRound: any) {
    let cities: any[] = [];
    const citiesExtracted = await getCitiesOfCountry(countryCode);
    if (citiesExtracted) cities = citiesExtracted;
    const { cityList, lastRound } = iterateCities(cities, 30, parseInt(currentRound));

    if (cityList)
      return [
        'Please choose your city',
        InlineKeyboardButtons(
          // map the country list to the buttons
          [
            ...cityList.map((city) => [{ text: city.name, cbString: city.name }]),

            [{ text: 'Other', cbString: 'Other' }],
            !lastRound ? [{ text: '➡️ Next', cbString: 'next' }] : [],
            [{ text: '⬅️ Back', cbString: 'back' }],
          ],
        ),
        InlineKeyboardButtons(
          // map the country list to the buttons
          [[{ text: 'Other', cbString: 'Other' }]],
        ),
      ];

    return [
      'Unable to find cities',
      InlineKeyboardButtons(
        // map the country list to the buttons
        [[{ text: 'Back', cbString: 'back' }], [{ text: 'Other', cbString: 'Other' }]],
      ),
    ];
  }

  getPreviewData(state: any) {
    return `${capitalizeFirstLetter(state.first_name)} ${capitalizeFirstLetter(state.last_name)}\n________________\n\nFirst name: ${capitalizeFirstLetter(state.first_name)} \n\nLast name: ${capitalizeFirstLetter(state.last_name)} \n\nAge: ${state.age} \n\nGender: ${state.gender}\n\nResidence : ${state.city},${state.country}\n\nEmail: ${state.email || 'None'}\n\nPhone Number: ${state.phone_number}`;
  }

  editPreview(state: any) {
    return [
      this.getPreviewData(state),
      InlineKeyboardButtons([
        [
          { text: 'First name', cbString: 'first_name' },
          { text: 'Last name', cbString: 'last_name' },
        ],

        [
          { text: 'Age/DOB', cbString: 'age' },
          { text: 'Gender', cbString: 'gender' },
        ],
        [
          { text: 'Residence Country', cbString: 'country' },
          { text: 'Residence City', cbString: 'city' },
        ],

        [
          { text: 'Email', cbString: 'email' },
          { text: 'Done', cbString: 'register_data' },
        ],
      ]),
    ];
  }
  async editFiledDispay(editFiled: string, extraKey?: string) {
    switch (editFiled) {
      case 'first_name':
        return this.firstNameformatter();
      case 'last_name':
        return this.lastNameformatter();
      case 'age':
        return this.ageFormatter();
      case 'gender':
        return this.chooseGenderFormatter();
      case 'country':
        return await this.chooseCountryFormatter();
      case 'city':
        return await this.chooseCityFormatter(extraKey || '', 0);
      case 'email':
        return await this.emailFormatter(true);
      default:
        return ['none'];
    }
  }
  registrationError() {
    return [`Unable to register you please try again`];
  }
  registrationSuccess() {
    return [`Your have registered successfully!`];
  }
  settingDisplay() {
    return [this.messages.settingPrompt, InlineKeyboardButtons(this.settingButtons)];
  }
  notifyOptionDisplay(notifyOption: NotifyOption, first?: boolean) {
    return first
      ? [
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
            [{ text: 'Back', cbString: 'back' }],
          ]),
        ]
      : [
          [
            {
              text: `${areEqaul(notifyOption, 'follower', true) ? '✅' : ''} Your Followers`,
              callback_data: `notify_follower`,
            },
          ],
          [
            {
              text: `${areEqaul(notifyOption, 'friend', true) ? '✅' : ''} Your freinds (People you follow and follow you)`,
              callback_data: `notify_friend`,
            },
          ],
          [{ text: `${areEqaul(notifyOption, 'none', true) ? '✅' : ''} none`, callback_data: `notify_none` }],
          [{ text: 'Back', callback_data: 'back' }],
        ];
  }
}

export default ProfileFormatter;
