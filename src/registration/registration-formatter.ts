import { Markup } from 'telegraf';
import { InlineKeyboardButtons } from '../components/button';
import { getAllCountries, getCitiesOfCountry } from '../utils/constants/country-list';

class RegistrationFormatter {
  constructor() {}
  termsAndConditionsDisplay() {
    return [
      `Do you agree with these Terms and Conditions?  Please select Yes or No from the Buttons below`,

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

  goBackButton() {
    //back button with callback string
    return Markup.keyboard([Markup.button.callback('Back', 'back')])
      .oneTime()
      .resize();
  }

  chooseGenderFormatter() {
    return [
      `Please choose your gender`,
      InlineKeyboardButtons([
        [
          { text: 'Male', cbString: 'gender_male' },
          { text: 'Female', cbString: 'gender_female' },
        ],
      ]),
    ];
  }
  chooseGenderEroorFormatter() {
    return [`Please use the buttons above to choose gender`];
  }

  shareContact() {
    return [
      'lets start your first registration. Please share your contact.',
      Markup.keyboard([Markup.button.contactRequest('Share my contact'), 'Cancel'])
        .oneTime()
        .resize(),
    ];
  }
  shareContactWarning() {
    return [
      'You have to share your contact to proceed. Please use the "Share Contact" button below to share your contact.',
    ];
  }

  firstNameformatter() {
    return [`Please enter your first name `];
  }

  lastNameformatter() {
    return [`Please enter your last name`];
  }
  ageFormatter() {
    return [`Please choose your Age `];
  }

  emailFormatter() {
    return [`Please enter your personal Email `];
  }

  async chooseCountryFormatter() {
    const countries = await getAllCountries();
    return [
      'Please choose your country',
      InlineKeyboardButtons([
        // map the country list to the buttons
        ...countries.map((country: any) => [{ text: country.name, cbString: `${country.isoCode}:${country.name}` }]),
      ]),
    ];
  }

  // choose city based on the selected country
  async chooseCityFormatter(countryCode: string) {
    const cityList = await getCitiesOfCountry(countryCode);
    if (cityList)
      return [
        'Please choose your city',
        InlineKeyboardButtons([
          // map the country list to the buttons
          ...cityList.map((city: any) => [{ text: city.name, cbString: city.name }]),
        ]),
      ];

    return ['Unable to find cities'];
  }

  getPreviewData(state: any) {
    return `<b>${state.first_name} ${state.last_name}</b>\n________________\n\n<b>First name</b>: ${state.first_name} \n\n<b>Last name</b>: ${state.last_name} \n\n<b>Age</b>: ${state.age} \n\n<b>Gender</b>: ${state.gender}\n\n<b>Residence</b> : ${state.city},${state.country}\n\n<b>Email</b>: ${state.email}`;
  }
  preview(state: any) {
    return [
      this.getPreviewData(state),
      InlineKeyboardButtons([
        [
          { text: 'edit', cbString: 'preview_edit' },
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
          { text: 'first name', cbString: 'first_name' },
          { text: 'last name', cbString: 'last_name' },
        ],
        [
          { text: 'country', cbString: 'country' },
          { text: 'city', cbString: 'city' },
        ],
        [
          { text: 'age', cbString: 'age' },
          { text: 'gender', cbString: 'gender' },
        ],

        [{ text: 'Done', cbString: 'register_data' }],
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
        return await this.chooseCityFormatter(extraKey || '');
      default:
        return ['none'];
    }
  }
}

export default RegistrationFormatter;
