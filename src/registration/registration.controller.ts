import { Telegraf, Markup, Scenes } from 'telegraf';
import { InlineKeyboardButtons } from '../components/button';
import RegistrationFrommater from './registration-formmate';

class RegistrationController {
  registrationFormmater;
  constructor() {
    this.registrationFormmater = new RegistrationFrommater();
  }
  async agreeTermsDisplay(ctx: any) {
    await ctx.reply('https://telegra.ph/TERMS-AND-CONDITIONS-09-16-2');
    await ctx.reply(
      `Do you agree with these Terms and Conditions?  Please select Yes or No from the Buttons below`,

      InlineKeyboardButtons([
        [
          { text: 'Yes', cbString: 'agree_terms' },
          { text: 'NO', cbString: 'dont_agree_terms' },
        ],
        [{ text: 'Back', cbString: 'back_from_terms' }],
      ]),
    );

    return ctx.wizard.next();
  }
  async ageeTermsHanlder(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery)
      switch (callbackQuery.data) {
        case 'agree_terms': {
          ctx.reply('lets start your first registration ');
          ctx.reply('first name ');
          return ctx.wizard.next();
        }
        case 'dont_agree_terms': {
          ctx.reply(
            'You can not use this platform without accepting the terms and conditions. Please accept the terms and conditions with the above button to proceed. ',
          );
          return ctx.wizard.leave();
        }
        case 'back_from_terms': {
          return ctx.scene.enter('main');
        }
        default: {
          return ctx.reply('unknowns');
        }
      }
    else {
      console.log('noo');
    }
    // else ctx.wizard.preve
  }
  async chooseGender(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      await ctx.reply(...this.registrationFormmater.chooseGenderFommater());
    } else
      switch (callbackQuery.data) {
        case 'gender_male': {
          ctx.wizard.state.gender = 'male';
          ctx.reply('age ');
          return ctx.wizard.next();
        }
        case 'gender_female': {
          ctx.wizard.state.gender = 'male';
          ctx.reply('age ');
          return ctx.wizard.next();
        }
        default: {
          await ctx.reply(...this.registrationFormmater.chooseGenderFommater());
        }
      }

    return ctx.wizard.next();
  }
}

export default RegistrationController;
