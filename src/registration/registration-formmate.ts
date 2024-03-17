import { InlineKeyboardButtons } from '../components/button';

class RegistrationFrommater {
  constructor() {}
  chooseGenderFommater() {
    return [
      `Please choose your gender`,
      InlineKeyboardButtons([
        [
          { text: 'Male', cbString: 'gender_male' },
          { text: 'Femail', cbString: 'gender_female' },
        ],
      ]),
    ];
  }

  firstNamefommater() {
    return [`Please choose your first name `];
  }
  lastNamefommater() {
    return [`Please choose your last name `];
  }
  ageFommater() {
    return [`Please choose your Age `];
  }
  preview(first_name: string, last_name: string, age: number | string, gender: string) {
    return [
      `Your Data\n first name : ${first_name} \n last name : ${last_name} \n  age : ${age} \n gender : ${gender}`,
      InlineKeyboardButtons([
        [
          { text: 'edit', cbString: 'preview_edit' },
          { text: 'Register', cbString: 'register_data' },
        ],
      ]),
    ];
  }
}

export default RegistrationFrommater;
