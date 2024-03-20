import RegistrationFormatter from './registration-formatter';
import { deleteMessage, deleteMessageWithCallback } from '../../utils/constants/chat';
import { registrationValidator } from '../../utils/validator/registration-validator';
import { calculateAge } from '../../utils/constants/date';
import RegistrationService from './restgration.service';
import config from '../../config/config';

const registrationFormatter = new RegistrationFormatter();
const registrationService = new RegistrationService();

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
      ctx.reply(...registrationFormatter.firstNameformatter(), registrationFormatter.goBackButton());
      return ctx.wizard.next();
    } else return ctx.reply(...registrationFormatter.shareContactWarning());
  }

  async enterFirstName(ctx: any) {
    const message = ctx.message.text;
    if (message == 'Back') {
      return ctx.reply(...registrationFormatter.firstNameformatter());
    }
    const validationMessage = registrationValidator('first_name', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);

    ctx.wizard.state.first_name = message;
    ctx.reply(...registrationFormatter.lastNameformatter(), registrationFormatter.goBackButton());

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
    ctx.reply(...registrationFormatter.ageFormatter(), registrationFormatter.goBackButton());
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
    ctx.reply(...registrationFormatter.chooseGenderFormatter(), registrationFormatter.goBackButton());
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
      await ctx.reply(...registrationFormatter.chooseGenderEroorFormatter(), registrationFormatter.goBackButton());
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'gender_male': {
          ctx.wizard.state.gender = 'male';
          await deleteMessageWithCallback(ctx);
          ctx.reply(...registrationFormatter.emailFormatter());
          return ctx.wizard.next();
        }
        case 'gender_female': {
          ctx.wizard.state.gender = 'male';
          await deleteMessageWithCallback(ctx);
          ctx.reply(...registrationFormatter.emailFormatter());
          return ctx.wizard.next();
        }
        default: {
          await ctx.reply(...registrationFormatter.chooseGenderFormatter(), registrationFormatter.goBackButton());
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
        ctx.reply(...registrationFormatter.emailFormatter());
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
        await ctx.reply(...registrationFormatter.chooseGenderFormatter(), registrationFormatter.goBackButton());
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
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      // changing field value
      const editField = ctx.wizard.state?.editField;
      if (editField) {
        const validationMessage = registrationValidator(ctx.wizard.state.editField, ctx.message.text);
        if (validationMessage != 'valid') return await ctx.reply(validationMessage);

        if (ctx.wizard.state.editField == 'age')
          ctx.wizard.state[ctx.wizard.state.editField] = calculateAge(ctx.message.text);
        ctx.wizard.state[ctx.wizard.state.editField] = ctx.message.text;
        ctx.reply(...registrationFormatter.editPreview(state), { parse_mode: 'HTML' });
      } else await ctx.reply('invalid input ');
    } else {
      // save the mesage id for later deleting
      ctx.wizard.state.previousMessageData = {
        message_id: ctx.callbackQuery.message.message_id,
        chat_id: ctx.callbackQuery.message.chat.id,
      };
      switch (callbackQuery.data) {
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
        case 'gender_male': {
          await deleteMessageWithCallback(ctx);
          ctx.wizard.state.gender = 'male';
          return ctx.reply(...registrationFormatter.editPreview(state), { parse_mode: 'HTML' });
        }
        case 'gender_female': {
          await deleteMessageWithCallback(ctx);
          ctx.wizard.state.gender = 'female';
          return ctx.reply(...registrationFormatter.editPreview(state), { parse_mode: 'HTML' });
        }
        default: {
          if (fileds.some((filed) => filed == callbackQuery.data)) {
            // selecting field to change
            ctx.wizard.state.editField = callbackQuery.data;
            await ctx.telegram.deleteMessage(
              ctx.wizard.state.previousMessageData.chat_id,
              ctx.wizard.state.previousMessageData.message_id,
            );
            if (callbackQuery.data == 'city')
              return await ctx.reply(
                ...(await registrationFormatter.editFiledDispay(callbackQuery.data, ctx.wizard.state.countryCode)),
              );
            await ctx.reply(...(await registrationFormatter.editFiledDispay(callbackQuery.data)));
          } else {
            if (callbackQuery.data.includes(':')) {
              const [countryCode, country] = callbackQuery.data.split(':');
              ctx.wizard.state.country = country;
              ctx.wizard.state.countryCode = countryCode;

              await deleteMessageWithCallback(ctx);
              ctx.reply(...(await registrationFormatter.chooseCityFormatter(countryCode)));
            } else {
              ctx.wizard.state.city = callbackQuery.data;
              await deleteMessageWithCallback(ctx);
              return ctx.reply(...registrationFormatter.editPreview(state), { parse_mode: 'HTML' });
            }
          }
        }
      }
    }
  }
}

export default RegistrationController;
