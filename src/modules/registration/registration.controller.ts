import RegistrationFormatter from './registration-formatter';
import { deleteMessage, deleteMessageWithCallback } from '../../utils/constants/chat';
import { registrationValidator } from '../../utils/validator/registration-validator';
import { calculateAge } from '../../utils/constants/date';
import RegistrationService from './restgration.service';
import config from '../../config/config';

const registrationFormatter = new RegistrationFormatter();
const registrationService = new RegistrationService();
import { Markup } from 'telegraf';
import { areEqaul } from '../../utils/constants/string';
console.log(Markup.removeKeyboard);
class RegistrationController {
  constructor() {}
  async agreeTermsDisplay(ctx: any) {
    await ctx.reply(config.terms_condtion_link);
    await ctx.reply(...registrationFormatter.termsAndConditionsDisplay(), { parse_mode: 'Markdown' });
    return ctx.wizard.next();
  }
  async agreeTermsHandler(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery)
      switch (callbackQuery?.data) {
        case 'agree_terms': {
          await deleteMessageWithCallback(ctx);
          ctx.reply(...registrationFormatter.shareContact());
          return ctx.wizard.next();
        }
        case 'dont_agree_terms': {
          return ctx.reply(...registrationFormatter.termsAndConditionsDisagreeDisplay());
        }
        case 'back_from_terms': {
          await deleteMessageWithCallback(ctx);
          await deleteMessage(ctx, {
            message_id: (parseInt(callbackQuery.message.message_id) - 1).toString(),
            chat_id: callbackQuery.message.chat.id,
          });
          ctx.scene.leave();
          return ctx.scene.enter('start');
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
      ctx.wizard.state.phone_number = contact.phone_number;
      ctx.reply(...registrationFormatter.firstNameformatter(), Markup.removeKeyboard());
      return ctx.wizard.next();
    } else return ctx.reply(...registrationFormatter.shareContactWarning());
  }

  async enterFirstName(ctx: any) {
    await ctx.editMessageReplyMarkup();
    const message = ctx.message.text;
    if (message == 'Back') {
      return ctx.reply(...registrationFormatter.firstNameformatter());
    }
    const validationMessage = registrationValidator('first_name', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);

    ctx.wizard.state.first_name = message;
    ctx.reply(...registrationFormatter.lastNameformatter());

    return ctx.wizard.next();
  }
  async enterLastName(ctx: any) {
    const message = ctx.message.text;
    if (message == 'Back') {
      ctx.reply(...registrationFormatter.firstNameformatter());
      return ctx.wizard.back();
    }
    const validationMessage = registrationValidator('last_name', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);

    ctx.wizard.state.last_name = ctx.message.text;
    ctx.reply(...registrationFormatter.ageFormatter());
    return ctx.wizard.next();
  }

  async enterAge(ctx: any) {
    const message = ctx.message?.text;
    if (message && message == 'Back') {
      ctx.reply(...registrationFormatter.lastNameformatter());
      return ctx.wizard.back();
    }
    const validationMessage = registrationValidator('age', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);

    const age = calculateAge(ctx.message.text);
    ctx.wizard.state.age = age;
    ctx.reply(...registrationFormatter.chooseGenderFormatter(), Markup.removeKeyboard());
    return ctx.wizard.next();
  }
  async chooseGender(ctx: any) {
    const message = ctx.message?.text;

    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      if (message && message == 'Back') {
        await deleteMessage(ctx, {
          message_id: (parseInt(ctx.message.message_id) - 1).toString(),
          chat_id: ctx.message.chat.id,
        });
        ctx.reply(...registrationFormatter.ageFormatter());
        return ctx.wizard.back();
      }
      await ctx.reply(...registrationFormatter.chooseGenderEroorFormatter());
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'gender_male': {
          ctx.wizard.state.gender = 'male';
          await deleteMessageWithCallback(ctx);
          ctx.reply(...registrationFormatter.emailFormatter(), registrationFormatter.goBackButton(true));
          return ctx.wizard.next();
        }
        case 'gender_female': {
          ctx.wizard.state.gender = 'male';
          await deleteMessageWithCallback(ctx);
          ctx.reply(...registrationFormatter.emailFormatter());
          return ctx.wizard.next();
        }
        case 'Back': {
          await deleteMessageWithCallback(ctx);
          ctx.reply(...registrationFormatter.ageFormatter());
          return ctx.wizard.back();
        }
        default: {
          await ctx.reply(...registrationFormatter.chooseGenderFormatter());
        }
      }
    }
  }

  async enterEmail(ctx: any) {
    const message = ctx.message.text;

    if (message == 'Back') {
      ctx.reply(...registrationFormatter.chooseGenderFormatter());
      return ctx.wizard.back();
    }
    if (message == 'Skip') {
      ctx.wizard.state.email = null;
      ctx.reply(...(await registrationFormatter.chooseCountryFormatter()));
      return ctx.wizard.next();
    }
    const validationMessage = registrationValidator('email', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.email = ctx.message.text;

    ctx.reply(...(await registrationFormatter.chooseCountryFormatter()));
    return ctx.wizard.next();
  }

  async chooseCountry(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await deleteMessage(ctx, {
          message_id: (parseInt(ctx.message.message_id) - 1).toString(),
          chat_id: ctx.message.chat.id,
        });
        ctx.reply(...registrationFormatter.emailFormatter(), registrationFormatter.goBackButton(true));
        return ctx.wizard.back();
      } else return ctx.reply('please use the buttons to choose your county');
    } else {
      const [countryCode, country] = callbackQuery.data.split(':');
      ctx.wizard.state.country = country;
      ctx.wizard.state.countryCode = countryCode;
      await deleteMessageWithCallback(ctx);
      ctx.reply(...(await registrationFormatter.chooseCityFormatter(countryCode)));
      return ctx.wizard.next();
    }
  }

  async chooseCity(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      const message = ctx.message?.text;
      if (message && message == 'Back') {
        await deleteMessage(ctx, {
          message_id: (parseInt(ctx.message.message_id) - 1).toString(),
          chat_id: ctx.message.chat.id,
        });
        ctx.reply(...(await registrationFormatter.chooseCountryFormatter()));
        return ctx.wizard.back();
      } else return ctx.reply('please use the buttons to choose your city');
    } else {
      ctx.wizard.state.city = callbackQuery.data;
      await deleteMessageWithCallback(ctx);
      ctx.reply(...registrationFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.next();
    }
  }

  async editRegister(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...registrationFormatter.chooseGenderFormatter());
        return ctx.wizard.back();
      }
      await ctx.reply('some thing');
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'preview_edit': {
          ctx.wizard.state.editField = null;
          await deleteMessageWithCallback(ctx);
          ctx.reply(...registrationFormatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }
        case 'register_data': {
          const response = await registrationService.registerUser(ctx.wizard.state, callbackQuery.from.id);

          if (response.success) {
            await deleteMessageWithCallback(ctx);
            ctx.reply(...registrationFormatter.registrationSuccess());
            return ctx.scene.enter('start');
          } else {
            ctx.reply(...registrationFormatter.registrationError());
            if (parseInt(ctx.wizard.state.registrationAttempt) >= 2) {
              await deleteMessageWithCallback(ctx);
              return ctx.scene.enter('start');
            }
            return (ctx.wizard.state.registrationAttempt = ctx.wizard.state.registrationAttempt
              ? parseInt(ctx.wizard.state.registrationAttempt) + 1
              : 1);
          }
        }
        default: {
          await ctx.reply('aggain body');
        }
      }
    }
  }
  async editData(ctx: any) {
    const state = ctx.wizard.state;
    const fileds = ['first_name', 'last_name', 'age', 'gender', 'city', 'country', 'email'];
    const callbackQuery = ctx?.callbackQuery;
    const editField = ctx.wizard.state?.editField;
    if (!callbackQuery) {
      // changing field value
      const messageText = ctx.message.text;
      if (areEqaul(messageText, 'back', true))
        return ctx.reply(...registrationFormatter.editPreview(state), { parse_mode: 'HTML' });
      if (!editField) return await ctx.reply('invalid input ');

      const validationMessage = registrationValidator(ctx.wizard.state.editField, ctx.message.text);
      if (validationMessage != 'valid') return await ctx.reply(validationMessage);

      ctx.wizard.state[editField] =
        editField == 'age' ? calculateAge(messageText) : (ctx.wizard.state[editField] = messageText);
      ctx.wizard.state.editField = null;
      return ctx.reply(...registrationFormatter.editPreview(state), { parse_mode: 'HTML' });
    }

    // if callback exists
    // save the mesage id for later deleting
    ctx.wizard.state.previousMessageData = {
      message_id: ctx.callbackQuery.message.message_id,
      chat_id: ctx.callbackQuery.message.chat.id,
    };
    const callbackMessage = callbackQuery.data;

    if (callbackMessage == 'register_data') {
      // registration
      const response = await registrationService.registerUser(ctx.wizard.state, callbackQuery.from.id);

      if (response.success) {
        await deleteMessageWithCallback(ctx);
        ctx.reply(...registrationFormatter.registrationSuccess());
        return ctx.scene.enter('start');
      }

      const registrationAttempt = parseInt(ctx.wizard.state.registrationAttempt);
      ctx.reply(...registrationFormatter.registrationError());
      if (registrationAttempt >= 2) {
        await deleteMessageWithCallback(ctx);
        return ctx.scene.enter('start');
      }
      return (ctx.wizard.state.registrationAttempt = registrationAttempt ? registrationAttempt + 1 : 1);
    }
    if (editField) {
      //  if edit filed is selected
      if (callbackMessage.includes(':')) {
        const [countryCode, country] = callbackMessage.split(':');
        ctx.wizard.state.country = country;
        ctx.wizard.state.countryCode = countryCode;
        await deleteMessageWithCallback(ctx);
        return ctx.reply(...(await registrationFormatter.chooseCityFormatter(countryCode)));
      }
      ctx.wizard.state[editField] = callbackMessage;
      await deleteMessageWithCallback(ctx);
      ctx.wizard.state.editField = null;
      return ctx.reply(...registrationFormatter.editPreview(state), { parse_mode: 'HTML' });
    }
    if (fileds.some((filed) => filed == callbackMessage)) {
      // selecting field to change
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );
      return await ctx.reply(
        ...(await registrationFormatter.editFiledDispay(
          callbackMessage,
          callbackMessage == 'city' ? ctx.wizard.state.countryCode : null,
        )),
        registrationFormatter.goBackButton(),
      );
    }
  }
}

export default RegistrationController;
