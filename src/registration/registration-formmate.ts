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
}

export default RegistrationFrommater;
