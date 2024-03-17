import { Telegraf, Markup, Scenes } from 'telegraf';
import { InlineKeyboardButtons } from '../components/button';
import RegistrationFormatter from './registration-formatter';
import { checkCommandInWizardScene } from '../middleware/check-command';

const registrationFormatter = new RegistrationFormatter();

class RegistrationController {
  constructor() {}
  async agreeTermsDisplay(ctx: any) {
    await ctx.reply('https://telegra.ph/TERMS-AND-CONDITIONS-09-16-2');
    await ctx.reply(
      `Do you agree with these Terms and Conditions?  Please select Yes or No from the Buttons below`,

      InlineKeyboardButtons([
        [
          { text: 'Yes', cbString: 'agree_terms' },
          { text: 'No', cbString: 'dont_agree_terms' },
        ],
        [{ text: 'Back', cbString: 'back_from_terms' }],
      ]),
    );

    return ctx.wizard.next();
  }
  async agreeTermsHandler(ctx: any) {
    if (await checkCommandInWizardScene(ctx)) return;
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery)
      switch (callbackQuery.data) {
        case 'agree_terms': {
          ctx.reply('lets start your first registration ');
          ctx.reply(...registrationFormatter.firstNameformatter());
          return ctx.wizard.next();
        }
        case 'dont_agree_terms': {
          ctx.reply(
            'You can not use this platform without accepting the terms and conditions. Please accept the terms and conditions with the above button to proceed. ',
          );
          // call the function to display the terms and conditions again
          return ctx.wizard.leave();
        }
        case 'back_from_terms': {
          // return one step back
          return ctx.wizard.leave();
        }
        default: {
          ctx.reply('Unknown Command');
          return ctx.wizard.back();
        }
      }
    else {
      ctx.reply('Please use the buttons to select your choice');
    }
  }

  async enterFirstName(ctx: any) {
    if (await checkCommandInWizardScene(ctx)) return;
    ctx.wizard.state.first_name = ctx.message.text;
    ctx.reply(...registrationFormatter.lastNameformatter());
    return ctx.wizard.next();
  }

  async enterLastName(ctx: any) {
    if (await checkCommandInWizardScene(ctx)) return;
    ctx.wizard.state.last_name = ctx.message.text;
    ctx.reply(...registrationFormatter.ageFormatter());
    return ctx.wizard.next();
  }
  async enterAge(ctx: any) {
    if (await checkCommandInWizardScene(ctx)) return;
    ctx.wizard.state.age = ctx.message.text;
    ctx.reply(...registrationFormatter.chooseGenderFormatter());
    return ctx.wizard.next();
  }

  async chooseGender(ctx: any) {
    if (await checkCommandInWizardScene(ctx)) return;
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      await ctx.reply(...registrationFormatter.chooseGenderFormatter());
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'gender_male': {
          ctx.wizard.state.gender = 'male';
          ctx.reply(...registrationFormatter.preview(state.first_name, state.last_name, state.age, 'male'));
          return ctx.wizard.next();
        }
        case 'gender_female': {
          ctx.wizard.state.gender = 'male';
          ctx.reply(...registrationFormatter.preview(state.first_name, state.last_name, state.age, 'female'));
          return ctx.wizard.next();
        }
        default: {
          await ctx.reply(...registrationFormatter.chooseGenderFormatter());
        }
      }
    }
  }

  async editRegister() {}
}

export default RegistrationController;
