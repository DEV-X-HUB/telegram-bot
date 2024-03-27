import { Markup } from 'telegraf';
import { InlineKeyboardButtons, MarkupButtons } from '../../ui/button';
import {
  breakeArrayTowNColumn,
  getCitiesOfCountry,
  getFilteredCoutryList,
  getSelectedCoutryList,
  iterateCities,
} from '../../utils/constants/country-list';
import { ICity } from 'country-state-city';
import { areEqaul, capitalizeFirstLetter } from '../../utils/constants/string';

class RegistrationFormatter {
  countries: any[] = [];
  countryCodes: any[] = ['et'];
  previewButtons = [
    [{ text: '✏️ Edit Profile', cbString: `edit_profile` }],
    [
      { text: 'My Question', cbString: `my_questions` },
      { text: 'My Answers', cbString: `my_questions` },
    ],
    [
      { text: 'Followers', cbString: `my_questions` },
      { text: 'Following', cbString: `my_questions` },
    ],
    [{ text: 'Setting', cbString: `my_questions` }],
  ];
  editOptionsButtons = [
    [{ text: ' Edit Name', cbString: `display_name` }],
    [{ text: 'Edit Bio', cbString: `bio` }],
    [{ text: 'Edit Gender', cbString: `gender` }],
    [{ text: 'Back', cbString: `back` }],
  ];

  messages = {
    useButtonError: 'Please use the buttons above to choose ',
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
  };

  constructor() {
    this.countries = getSelectedCoutryList();
  }
  useButtonError(optionName: string) {
    return this.messages.useButtonError + optionName;
  }

  preview(userData: any) {
    return [this.formatePreview(userData), InlineKeyboardButtons(this.previewButtons)];
  }

  formatePreview(userData: any) {
    const header = `${userData.display_name || `Anonymous${areEqaul(userData.gender, 'male', true) ? '👨‍🦱' : '👧'}`}  | 0 Rep | ${userData.followers.length} Followers | ${userData.followings.length} Followings\n`;
    const gap = '---------------------------------------\n';
    const bio = `\nBio: ${userData.bio || 'none'}`;
    return header + gap + bio;
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
      case 'name':
        return [this.messages.namePrompt];
      case 'bio':
        return [this.messages.bioPrompt];
      case 'gender':
        return [this.messages.genderPrompt, InlineKeyboardButtons(this.genderOpton(gender))];
      default:
        return [this.messages.namePrompt];
    }
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
}

export default RegistrationFormatter;
