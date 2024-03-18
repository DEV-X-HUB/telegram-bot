import { Telegraf, Markup, Scenes } from 'telegraf';
import { InlineKeyboardButtons } from '../components/button';

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
      "lets start your first registration. \nPlease use the 'Share Contact' Keyboard button below to share you contact. If you can not see the button, use the four dots icon below to make it visible.",
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

  chooseCountryFormatter(countries: any) {
    return [
      'Please choose your country',
      InlineKeyboardButtons([
        // map the country list to the buttons
        ...countries.map((country: any) => [{ text: country.name, cbString: `${country.isoCode}:${country.name}` }]),
      ]),
    ];
  }

  // choose city based on the selected country
  chooseCityFormatter(cities: any) {
    return [
      'Please choose your city',
      InlineKeyboardButtons([
        // map the country list to the buttons
        ...cities.map((city: any) => [{ text: city.name, cbString: city.name }]),
      ]),
    ];
  }

  getPreviewData(state: any) {
    return `Your Data\n first name : ${state.first_name} \n last name : ${state.last_name} \n  age : ${state.age} \n gender : ${state.gender}`;
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
          { text: 'age', cbString: 'age' },
          { text: 'gender', cbString: 'gender' },
        ],

        [{ text: 'Done', cbString: 'register_data' }],
      ]),
    ];
  }
  editFiledDispay(editFiled: string) {
    switch (editFiled) {
      case 'first_name':
        return this.firstNameformatter();
      case 'last_name':
        return this.lastNameformatter();
      case 'age':
        return this.ageFormatter();
      case 'gender':
        return this.chooseGenderFormatter();
      default:
        return ['none'];
    }
  }
  // getDisplayData(dataField: any) {
  //   const data = {
  //     phone_number: 'Phone Number',
  //     first_name: 'First Name',
  //     last_name: 'Last Name',
  //     age: 'Age',
  //     gender: 'Gender',
  //   };
  //   return data[dataField];
  // }
}

export default RegistrationFormatter;
