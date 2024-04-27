import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback, findSender } from '../../utils/constants/chat';
import { registrationValidator } from '../../utils/validator/registration-validator';
import { calculateAge } from '../../utils/constants/date';
import config from '../../config/config';

import { Markup } from 'telegraf';
import { areEqaul } from '../../utils/constants/string';

import RegistrationFormatter from './registration-formatter';
import RegistrationService from './restgration.service';
import MainMenuController from '../mainmenu/mainmenu.controller';
import CreateUserDto from '../../types/dto/create-user.dto';
const registrationService = new RegistrationService();
const registrationFormatter = new RegistrationFormatter();
class RegistrationController {
  constructor() {}
  async agreeTermsDisplay(ctx: any) {
    await ctx.reply(config.terms_condtion_link, {
      reply_markup: {
        remove_keyboard: true,
      },
    });

    await ctx.reply(...registrationFormatter.termsAndConditionsDisplay(), { parse_mode: 'Markdown' });
    ctx.wizard.state.registering = 'registering';
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
          return ctx.reply(registrationFormatter.messages.termsAndConditionsDisagreeWarning);
        }
        case 'back_from_terms': {
          await deleteMessageWithCallback(ctx);
          await deleteMessage(ctx, {
            message_id: (parseInt(callbackQuery.message.message_id) - 1).toString(),
            chat_id: callbackQuery.message.chat.id,
          });
          ctx.scene.leave();
          return MainMenuController.onStart(ctx);
        }

        default: {
          ctx.reply('Unknown Command');
          return ctx.wizard.back();
        }
      }
    else {
      ctx.reply(registrationFormatter.messages.useButtonError);
    }
  }

  async shareContact(ctx: any) {
    const contact = ctx?.message?.contact;
    const text = ctx.message.text;
    const chat_id = ctx.message.chat.id;
    const username = ctx.message.from.username;

    if (text && text == 'Cancel') {
      return ctx.reply(...registrationFormatter.shareContactWarning());
    } else if (contact) {
      ctx.wizard.state.phone_number = contact.phone_number;
      if (username) {
        ctx.wizard.state.username = `https://t.me/${username}`;
        ctx.wizard.state.chat_id = chat_id;
      }
      ctx.reply(...registrationFormatter.firstNameformatter());
      return ctx.wizard.next();
    } else return ctx.reply(...registrationFormatter.shareContactWarning());
  }

  async enterFirstName(ctx: any) {
    const message = ctx.message.text;
    if (message == 'Back') {
      ctx.scene.leave();
      return ctx.scene.enter('register');
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
    await deleteKeyboardMarkup(ctx, registrationFormatter.messages.genderPrompt);
    ctx.reply(...registrationFormatter.chooseGenderFormatter(), Markup.removeKeyboard());
    return ctx.wizard.next();
  }
  async chooseGender(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return await ctx.reply(registrationFormatter.messages.useButtonError);

    const callbackMessage = callbackQuery.data;
    switch (callbackMessage) {
      case 'Back': {
        await deleteMessageWithCallback(ctx);
        ctx.reply(...registrationFormatter.ageFormatter());
        return ctx.wizard.back();
      }
      default: {
        ctx.wizard.state.gender = callbackMessage;
        await deleteMessageWithCallback(ctx);
        ctx.reply(...registrationFormatter.emailFormatter());
        return ctx.wizard.next();
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
      await deleteKeyboardMarkup(ctx, registrationFormatter.messages.countryPrompt);
      ctx.reply(...(await registrationFormatter.chooseCountryFormatter()));
      return ctx.wizard.next();
    }
    const validationMessage = registrationValidator('email', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.email = ctx.message.text;
    await deleteKeyboardMarkup(ctx, registrationFormatter.messages.countryPrompt);
    ctx.reply(...(await registrationFormatter.chooseCountryFormatter()));
    return ctx.wizard.next();
  }

  async chooseCountry(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return await ctx.reply(registrationFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) {
      await deleteMessageWithCallback(ctx);
      ctx.reply(...registrationFormatter.emailFormatter());
      return ctx.wizard.back();
    }
    const [countryCode, country] = callbackQuery.data.split(':');
    ctx.wizard.state.country = country;
    ctx.wizard.state.countryCode = countryCode;
    ctx.wizard.state.currentRound = 0;
    await deleteMessageWithCallback(ctx);
    ctx.reply(...(await registrationFormatter.chooseCityFormatter(countryCode, 0)));
    return ctx.wizard.next();
  }

  async chooseCity(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(registrationFormatter.messages.useButtonError);

    deleteMessageWithCallback(ctx);
    switch (callbackQuery.data) {
      case 'back': {
        if (ctx.wizard.state.currentRound == 0) {
          ctx.reply(...(await registrationFormatter.chooseCountryFormatter()));
          return ctx.wizard.back();
        }
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
        return ctx.reply(...(await registrationFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, 0)));
      }
      case 'next': {
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
        return ctx.reply(
          ...(await registrationFormatter.chooseCityFormatter(
            ctx.wizard.state.countryCode,
            ctx.wizard.state.currentRound,
          )),
        );
      }
      default:
        ctx.wizard.state.city = callbackQuery.data;
        ctx.wizard.state.currentRound = 0;
        ctx.reply(...registrationFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.next();
    }
  }

  async editRegister(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    const sender = findSender(ctx);
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
          const createUserDto: CreateUserDto = {
            tg_id: sender.id.toString(),
            username: state.username,
            first_name: state.first_name,
            last_name: state.last_name,
            phone_number: state.phone_number,
            email: state.email,
            country: state.country,
            city: state.city,
            gender: state.gender,
            age: parseInt(state.age),
            chat_id: state.chat_id.toString(),
            display_name: null,
          };

          const response = await registrationService.registerUser(createUserDto);

          if (response.success) {
            await deleteMessageWithCallback(ctx);
            ctx.reply(...registrationFormatter.registrationSuccess());
            ctx.scene.leave();

            ctx.wizard.state.registering = false;
            return MainMenuController.onStart(ctx);
          } else {
            ctx.reply(...registrationFormatter.registrationError());
            if (parseInt(ctx.wizard.state.registrationAttempt) >= 2) {
              await deleteMessageWithCallback(ctx);
              ctx.scene.leave();
              return MainMenuController.onStart(ctx);
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
      deleteKeyboardMarkup(ctx);
      return ctx.reply(...registrationFormatter.editPreview(state), { parse_mode: 'HTML' });
    }

    // if callback exists
    // save the mesage id for later deleting
    ctx.wizard.state.previousMessageData = {
      message_id: ctx.callbackQuery.message.message_id,
      chat_id: ctx.callbackQuery.message.chat.id,
    };
    const callbackMessage = callbackQuery.data;

    if (callbackMessage == 'editing_done') {
      await deleteMessageWithCallback(ctx);
      ctx.reply(...registrationFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      return MainMenuController.onStart(ctx);
    }
    if (areEqaul(callbackMessage, 'back', true)) {
      deleteMessageWithCallback(ctx);
      return ctx.reply(...registrationFormatter.editPreview(state), { parse_mode: 'HTML' });
    }
    if (editField) {
      //  if edit filed is selected
      if (callbackMessage.includes(':')) {
        const [countryCode, country] = callbackMessage.split(':');
        ctx.wizard.state.country = country;
        ctx.wizard.state.countryCode = countryCode;
        ctx.wizard.state.currentRound = 0;
        await deleteMessageWithCallback(ctx);
        ctx.reply(...(await registrationFormatter.chooseCityFormatter(countryCode, ctx.wizard.state.currentRound)));
        return ctx.wizard.next();
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
      await ctx.reply(
        ...(await registrationFormatter.editFiledDispay(
          callbackMessage,
          callbackMessage == 'city' ? ctx.wizard.state.countryCode : null,
        )),
        registrationFormatter.goBackButton(),
      );
      ctx.wizard.state.currentRound = 0;
      if (areEqaul(callbackMessage, 'city', true)) return ctx.wizard.next();
      return;
    }
  }
  async editCity(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(registrationFormatter.messages.useButtonError);

    deleteMessageWithCallback(ctx);
    switch (callbackQuery.data) {
      case 'back': {
        if (ctx.wizard.state.currentRound == 0) {
          ctx.reply(...registrationFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
          return ctx.wizard.back();
        }
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
        return ctx.reply(...(await registrationFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, 0)));
      }
      case 'next': {
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
        return ctx.reply(
          ...(await registrationFormatter.chooseCityFormatter(
            ctx.wizard.state.countryCode,
            ctx.wizard.state.currentRound,
          )),
        );
      }
      default:
        ctx.wizard.state.city = callbackQuery.data;
        ctx.reply(...registrationFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.back();
    }
  }
}

export default RegistrationController;
