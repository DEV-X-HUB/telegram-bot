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
    return [`Please use the buttons above to choose   gender`];
  }

  firstNameformatter() {
    return [`Please choose your first name `];
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
    return ['you have to share your contact'];
  }
  lastNameformatter() {
    return [`Please choose your last name `];
  }
  ageFormatter() {
    return [`Please choose your Age `];
  }

  emailFormatter() {
    return [`Please enter your personal Email `];
  }

  chooseCountryFormatter() {
    return [
      'Please choose your country',
      InlineKeyboardButtons([
        [
          { text: 'Afghanistan', cbString: 'Afghanistan' },
          { text: 'Albania', cbString: 'Albania' },
          { text: 'Algeria', cbString: 'Algeria' },
          { text: 'Andorra', cbString: 'Andorra' },
          { text: 'Angola', cbString: 'Angola' },
        ],
      ]),
    ];
  }

  // choose city based on the selected country
  chooseCityFormatter() {
    return [
      'Please choose your city',
      InlineKeyboardButtons([
        [
          { text: 'Kabul', cbString: 'Kabul' },
          { text: 'Tirana', cbString: 'Tirana' },
          { text: 'Algiers', cbString: 'Algiers' },
          { text: 'Andorra la Vella', cbString: 'Andorra la Vella' },
          { text: 'Luanda', cbString: 'Luanda' },
          { text: 'Other', cbString: 'other_city' },
          { text: 'Back', cbString: 'back_to_country' },
        ],
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
