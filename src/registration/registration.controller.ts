import { Telegraf, Markup, Scenes } from 'telegraf';
import { InlineKeyboardButtons } from '../components/button';
import RegistrationFormatter from './registration-formatter';
import { checkAndRedirectToScene, checkCommandInWizardScene } from '../middleware/check-command';

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
    console.log(ctx);
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery)
      switch (callbackQuery.data) {
        case 'agree_terms': {
          // console.log()
          ctx.reply('lets start your first registration ');
          ctx.reply(...registrationFormatter.shareContact());
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

  async shareContact(ctx: any) {
    console.log(ctx.message);
    const contact = ctx?.message?.contact;
    const text = ctx.message.text;
    console.log(ctx.message.contact);
    console.log(ctx.message.text);
    if (text && text == '❌ Cancel') {
      return ctx.reply(...registrationFormatter.shareContactWarning());
    } else if (contact) {
      ctx.reply(...registrationFormatter.firstNameformatter());
      ctx.wizard.state.phone_number = contact.phone_number;
      return ctx.wizard.next();
    }
    ctx.reply(...registrationFormatter.shareContactWarning());
  }

  async enterFirstName(ctx: any) {
    if (await checkCommandInWizardScene(ctx)) return;

    ctx.wizard.state.first_name = ctx.message.text;
    ctx.reply(...registrationFormatter.lastNameformatter(), Markup.keyboard(['Back']).oneTime().resize());

    return ctx.wizard.next();
  }
  async enterLastName(ctx: any) {
    ctx.wizard.state.last_name = ctx.message.text;
    ctx.reply(...registrationFormatter.ageFormatter(), Markup.keyboard(['Back']).oneTime().resize());
    return ctx.wizard.next();
  }
  async enterAge(ctx: any) {
    ctx.wizard.state.age = ctx.message.text;
    ctx.reply(...registrationFormatter.chooseGenderFormatter(), Markup.keyboard(['Back']).oneTime().resize());
    return ctx.wizard.next();
  }
  async chooseGender(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      await ctx.reply(...registrationFormatter.chooseGenderFormatter(), Markup.keyboard(['Back']).oneTime().resize());
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'gender_male': {
          console.log(ctx.wizard.state);
          ctx.wizard.state.gender = 'male';
          ctx.reply(...registrationFormatter.preview(state));
          return ctx.wizard.next();
        }
        case 'gender_female': {
          ctx.wizard.state.gender = 'male';
          ctx.reply(...registrationFormatter.preview(state));
          return ctx.wizard.next();
        }
        default: {
          await ctx.reply(
            ...registrationFormatter.chooseGenderFormatter(),
            Markup.keyboard(['Back']).oneTime().resize(),
          );
        }
      }
    }
  }
  async editRegister(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      await ctx.reply('some thing');
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'preview_edit': {
          ctx.wizard.state.editField = null;
          ctx.reply(...registrationFormatter.editPreview(state));
          return ctx.wizard.next();
        }
        case 'register_data': {
          ctx.reply('registed');
          // return ctx.wizard.next();
        }
        default: {
          await ctx.reply('aggain body');
        }
      }
    }
  }
  async editData(ctx: any) {
    console.log(ctx);
    const state = ctx.wizard.state;
    const fileds = ['first_name', 'last_name', 'age', 'gender'];
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      if (ctx.wizard.state.editField) {
        ctx.wizard.state[ctx.wizard.state.editField] = ctx.message.text;
        ctx.reply(...registrationFormatter.editPreview(state));
      } else await ctx.reply('invalid input ');
    } else {
      switch (callbackQuery.data) {
        case 'register_data': {
          return ctx.reply('registed');
        }
        case 'gender_male': {
          console.log(ctx.wizard.state);
          ctx.wizard.state.gender = 'male';
          return ctx.reply(...registrationFormatter.editPreview(state));
        }
        case 'gender_female': {
          ctx.wizard.state.gender = 'female';
          return ctx.reply(...registrationFormatter.editPreview(state));
        }
        default: {
          if (fileds.some((filed) => filed == callbackQuery.data)) {
            ctx.wizard.state.editField = callbackQuery.data;
            await ctx.reply(...registrationFormatter.editFiledDispay(callbackQuery.data));
          } else {
            if (ctx.wizard.state.editField) {
              ctx.wizard.state[ctx.wizard.state.editField] = ctx.message.text;
              ctx.reply(...registrationFormatter.editPreview(state));
            }
            ctx.reply('invalid option');
          }
        }
      }
    }
  }
  async upateFiled(ctx: any) {
    const fileds = ['first_name', 'last_name', 'age', 'gender'];
    const callbackQuery = ctx.callbackQuery;
    console.log(callbackQuery);
    return;
    if (!callbackQuery) {
      await ctx.reply('some thing');
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'done': {
          ctx.reply('registed');
          // return ctx.wizard.next();
        }

        default: {
          if (fileds.some((filed) => filed == callbackQuery.data)) {
            ctx.wizard.state.editField = callbackQuery.data;
            await ctx.reply('aggain body');
          }
        }
      }
    }
  }
}

export default RegistrationController;
