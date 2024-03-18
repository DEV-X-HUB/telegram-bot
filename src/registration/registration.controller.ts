import { Telegraf, Markup, Scenes } from 'telegraf';
import { InlineKeyboardButtons } from '../components/button';
import RegistrationFormatter from './registration-formatter';
import { checkAndRedirectToScene, checkCommandInWizardScene } from '../middleware/check-command';
import { deleteMessage, deleteMessageWithCallback } from '../utils/chat';

const registrationFormatter = new RegistrationFormatter();

const goBack = () => {
  return (ctx: any) => {
    ctx.wizard.back();
    return ctx.wizard.step();
  };
};

class RegistrationController {
  constructor() {}
  async agreeTermsDisplay(ctx: any) {
    await ctx.reply('https://telegra.ph/TERMS-AND-CONDITIONS-09-16-2');
    await ctx.reply(...registrationFormatter.termsAndConditionsDisplay());

    return ctx.wizard.next();
  }
  async agreeTermsHandler(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery)
      switch (callbackQuery?.data) {
        case 'agree_terms': {
          // console.log()
          ctx.reply('lets start your first registration ');
          await deleteMessageWithCallback(ctx);
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
    const contact = ctx?.message?.contact;
    const text = ctx.message.text;
    if (text && text == 'Cancel') {
      return ctx.reply(...registrationFormatter.shareContactWarning());
    } else if (contact) {
      ctx.reply(...registrationFormatter.firstNameformatter());
      ctx.wizard.state.phone_number = contact.phone_number;

      const message = ctx?.message;
      // console.log('message', message);
      if (message?.contact) {
        ctx.wizard.state.contact = message.contact;
        ctx.reply(
          ...registrationFormatter.firstNameformatter(),

          //back button with callback string
          Markup.keyboard([Markup.button.callback('Back', 'back')])
            .oneTime()
            .resize(),
        );

        return ctx.wizard.next();
      }
      ctx.reply(...registrationFormatter.shareContactWarning());
    }
  }

  async enterFirstName(ctx: any) {
    const message = ctx.message.text;
    if (message == 'Back') {
      return ctx.reply(...registrationFormatter.firstNameformatter());
    }
    ctx.wizard.state.first_name = message;
    ctx.reply(
      ...registrationFormatter.lastNameformatter(),
      //back button with callback string
      Markup.keyboard([Markup.button.callback('Back', 'back')])
        .oneTime()
        .resize(),
    );

    return ctx.wizard.next();
  }
  async enterLastName(ctx: any) {
    const message = ctx.message.text;
    if (message == 'Back') {
      ctx.reply(...registrationFormatter.firstNameformatter());
      return ctx.wizard.back();
    }
    ctx.wizard.state.last_name = ctx.message.text;
    ctx.reply(...registrationFormatter.ageFormatter(), Markup.keyboard(['Back']).oneTime().resize());
    return ctx.wizard.next();
  }

  async enterAge(ctx: any) {
    const message = ctx.message?.text;
    if (message && message == 'Back') {
      ctx.reply(...registrationFormatter.lastNameformatter());
      return ctx.wizard.back();
    }
    ctx.wizard.state.age = ctx.message.text;
    ctx.reply(...registrationFormatter.chooseGenderFormatter(), Markup.keyboard(['Back']).oneTime().resize());
    return ctx.wizard.next();
  }
  async chooseGender(ctx: any) {
    const message = ctx.message?.text;

    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      if (message && message == 'Back') {
        ctx.reply(...registrationFormatter.ageFormatter());
        return ctx.wizard.back();
      }
      await ctx.reply(
        ...registrationFormatter.chooseGenderEroorFormatter(),
        Markup.keyboard(['Back']).oneTime().resize(),
      );
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'gender_male': {
          ctx.wizard.state.gender = 'male';
          await deleteMessageWithCallback(ctx);
          ctx.reply(...registrationFormatter.preview(state));
          return ctx.wizard.next();
        }
        case 'gender_female': {
          ctx.wizard.state.gender = 'male';
          await deleteMessageWithCallback(ctx);
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
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...registrationFormatter.chooseGenderFormatter(), Markup.keyboard(['Back']).oneTime().resize());
        return ctx.wizard.back();
      }
      await ctx.reply('some thing');
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'preview_edit': {
          ctx.wizard.state.editField = null;
          await deleteMessageWithCallback(ctx);
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
    const state = ctx.wizard.state;
    const fileds = ['first_name', 'last_name', 'age', 'gender'];
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      const editField = ctx.wizard.state?.editField;
      if (editField) {
        ctx.wizard.state[ctx.wizard.state.editField] = ctx.message.text;
        ctx.reply(...registrationFormatter.editPreview(state));
      } else await ctx.reply('invalid input ');
    } else {
      // save the mesage id for later deleting
      ctx.wizard.state.previousMessageData = {
        message_id: ctx.callbackQuery.message.message_id,
        chat_id: ctx.callbackQuery.message.chat.id,
      };
      switch (callbackQuery.data) {
        case 'register_data': {
          return ctx.reply('registed');
        }
        case 'gender_male': {
          await deleteMessageWithCallback(ctx);
          ctx.wizard.state.gender = 'male';
          return ctx.reply(...registrationFormatter.editPreview(state));
        }
        case 'gender_female': {
          await deleteMessageWithCallback(ctx);
          ctx.wizard.state.gender = 'female';
          return ctx.reply(...registrationFormatter.editPreview(state));
        }
        default: {
          if (fileds.some((filed) => filed == callbackQuery.data)) {
            // changing filed data
            ctx.wizard.state.editField = callbackQuery.data;
            console.log(ctx.wizard.state.previousMessageData, 'pppppp');

            await ctx.telegram.deleteMessage(
              ctx.wizard.state.previousMessageData.chat_id,
              ctx.wizard.state.previousMessageData.message_id,
            );
            await ctx.reply(...registrationFormatter.editFiledDispay(callbackQuery.data));
          } else {
            if (ctx.wizard.state.editField) {
              // selecting  editable field
              ctx.wizard.state[ctx.wizard.state.editField] = ctx.message.text;
              await ctx.reply(...registrationFormatter.editPreview(state));
            }
            ctx.reply('invalid option');
          }
        }
      }
    }
  }
}

export default RegistrationController;
