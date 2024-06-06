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
import { capitalizeFirstLetter } from '../../utils/helpers/string';

class RegistrationFormatter {
  countries: any[] = [];
  countryCodes: any[] = ['et', 'ke', 'ug', 'tz'];
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
    firstNamePrompt: 'Please enter your First name ',
    lastNamePrompt: 'Please enter your Last name ',
    agePrompt: 'Please  your age as a number between 14 - 100 OR enter your date of Birth in dd/mm/yyyy format ',
    genderPrompt: ' Please choose your gender ',
    emailPrompt: ' Please enter your personal Email ',
    countryPrompt: ' Please choose your country ',
    cityPrompt: ' Please choose your City ',
    registerPrompt: 'Please register to use the service',
    activationPrompt:
      '<b>You are currently deactivated</b>\nYou are not allowed to  <b>post</b> or <b>message any one</b>.\n<i>Please contact help center use such services</i> ',
  };

  constructor() {
    this.countries = getSelectedCoutryList();
  }
  useButtonError(optionName: string) {
    return this.messages.useButtonError + optionName;
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

  shareContact() {
    return [
      'lets start your first registration. Please share your contact.',
      Markup.keyboard([Markup.button.contactRequest('Share my contact'), 'Cancel'])
        .oneTime()
        .resize(),
      ,
      this.goBackButton(),
    ];
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
    return `<b>${capitalizeFirstLetter(state.first_name)} ${capitalizeFirstLetter(state.last_name)}</b>\n________________\n\n<b>First name</b>: ${capitalizeFirstLetter(state.first_name)} \n\n<b>Last name</b>: ${capitalizeFirstLetter(state.last_name)} \n\n<b>Age</b>: ${state.age} \n\n<b>Gender</b>: ${state.gender}\n\n<b>Residence</b> : ${state.city},${state.country}\n\n<b>Email</b>: ${state.email || 'None'}\n\n<b>Phone Number</b>: ${state.phone_number}`;
  }
  preview(state: any) {
    return [
      this.getPreviewData(state),
      InlineKeyboardButtons([
        [
          { text: 'Edit', cbString: 'preview_edit' },
          { text: 'Register', cbString: 'register_data' },
        ],
      ]),
    ];
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
          { text: 'Done', cbString: 'editing_done' },
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
