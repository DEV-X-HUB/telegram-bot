import { InlineKeyboardButtons } from '../components/button';

class RegistrationFormatter {
  constructor() {}
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

  firstNameformatter() {
    return [`Please choose your first name `];
  }
  lastNameformatter() {
    return [`Please choose your last name `];
  }
  ageFormatter() {
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

export default RegistrationFormatter;
