import { Telegraf, Markup, Scenes } from 'telegraf';
import { InlineKeyboardButtons } from '../components/button';
import RegistrationFrommater from './registration-formmate';

const registrationFormmater = new RegistrationFrommater();

class RegistrationController {
  constructor() {}
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
          ctx.reply(...registrationFormmater.firstNamefommater());
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

  async enterFirstName(ctx: any) {
    ctx.wizard.state.first_name = ctx.message.text;
    ctx.reply(...registrationFormmater.lastNamefommater());
    return ctx.wizard.next();
  }

  async enterLastName(ctx: any) {
    ctx.wizard.state.last_name = ctx.message.text;
    ctx.reply(...registrationFormmater.ageFommater());
    return ctx.wizard.next();
  }
  async enterAge(ctx: any) {
    ctx.wizard.state.age = ctx.message.text;
    ctx.reply(...registrationFormmater.chooseGenderFommater());
    return ctx.wizard.next();
  }

  async chooseGender(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      await ctx.reply(...registrationFormmater.chooseGenderFommater());
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'gender_male': {
          ctx.wizard.state.gender = 'male';
          ctx.reply(...registrationFormmater.preview(state.first_name, state.last_name, state.age, 'male'));
          return ctx.wizard.next();
        }
        case 'gender_female': {
          ctx.wizard.state.gender = 'male';
          ctx.reply(...registrationFormmater.preview(state.first_name, state.last_name, state.age, 'female'));
          return ctx.wizard.next();
        }
        default: {
          await ctx.reply(...registrationFormmater.chooseGenderFommater());
        }
      }
    }
  }

  async editRegister() {}
}

export default RegistrationController;
