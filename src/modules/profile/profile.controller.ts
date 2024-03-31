import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback } from '../../utils/constants/chat';
import { registrationValidator } from '../../utils/validator/registration-validator';
import { calculateAge } from '../../utils/constants/date';
import config from '../../config/config';

import { Markup } from 'telegraf';
import { areEqaul, isInInlineOption } from '../../utils/constants/string';

import RegistrationFormatter from './profile-formatter';
import ProfileService from './profile.service';
const profileService = new ProfileService();
const profileFormatter = new RegistrationFormatter();
const registrationFormatter = new RegistrationFormatter();
class RegistrationController {
  constructor() {}
  saveToState(ctx: any, userData: any) {
    ctx.wizard.state.userData = {
      tg_id: userData?.tg_id,
      id: userData?.id,
      display_name: userData?.display_name,
      bio: userData?.bio,
      gender: userData?.gender,
      followers: userData?.followers.length,
      followings: userData?.followings.length,
      questions: userData?.questions.length,
      answers: userData?.answers.length,
      created_at: userData?.created_at,
    };
  }
  async preview(ctx: any) {
    let tg_id;
    if (ctx.callbackQuery) tg_id = ctx.callbackQuery.from.id;
    else tg_id = ctx.message.from.id;

    const userData = await profileService.getProfileDataWithTgId(tg_id);
    this.saveToState(ctx, userData);
    ctx.wizard.state.activity = 'preview';
    return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
  }
  async previewHandler(ctx: any) {
    const userData = ctx.wizard.state.userData;
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery)
      switch (callbackQuery.data) {
        case 'edit_profile': {
          await deleteMessageWithCallback(ctx);
          ctx.wizard.state.activity = 'profile_edit_option_view';
          return ctx.reply(...registrationFormatter.editOptions());
        }
        case 'my_followers': {
          const followers = await profileService.getFollowersByUserId(userData.id);
          console.log(followers);
          await deleteMessageWithCallback(ctx);
          ctx.wizard.state.activity = 'followers_list_view';
          return ctx.reply(...registrationFormatter.formateFollowersList(followers));
        }
        case 'my_followings': {
          const followings = await profileService.getFollowingsByUserId(userData.id);
          console.log(followings);
          await deleteMessageWithCallback(ctx);
          ctx.wizard.state.activity = 'followings_list_view';
          return ctx.reply(...registrationFormatter.formateFollowingsList(followings));
        }
        default: {
          ctx.reply('Unknown Command');
        }
      }
    else {
      ctx.reply(registrationFormatter.messages.useButtonError);
    }
  }

  async editProfileOption(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(registrationFormatter.messages.useButtonError);

    deleteMessageWithCallback(ctx);
    if (areEqaul(callbackQuery.data, 'back', true)) return this.preview(ctx);
    ctx.wizard.state.activity = 'profile_edit_editing';
    ctx.wizard.state.editField = callbackQuery.data;
    return ctx.reply(...profileFormatter.editPrompt(callbackQuery.data, ctx.wizard.state.userData.gender));
  }
  async editProfileEditField(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    const message = ctx.message;
    const state = ctx.wizard.state;
    if (callbackQuery) {
      state.userData.gender = callbackQuery.data;
      const newData = await profileService.updateProfile(state.userData.id, {
        bio: state.userData.bio,
        gender: state.userData.gender,
        display_name: state.userData.display_name,
      });
      deleteMessageWithCallback(ctx);
      this.saveToState(ctx, newData);
      ctx.wizard.state.activity = 'preview';
      return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
    }
    state.userData[state.editField] = message.text;
    const newData = await profileService.updateProfile(state.userData.id, {
      bio: state.userData.bio,
      gender: state.userData.gender,
      display_name: state.userData.display_name,
    });
    this.saveToState(ctx, newData);
    ctx.wizard.state.activity = 'preview';
    return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
  }

  async followingList(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(registrationFormatter.messages.useButtonError);
    switch (callbackQuery.data) {
      case 'back': {
        ctx.wizard.state.activity = 'preview';
        await deleteMessageWithCallback(ctx);
        return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
      }
    }
  }
  async followersList(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(registrationFormatter.messages.useButtonError);
    switch (callbackQuery.data) {
      case 'back': {
        ctx.wizard.state.activity = 'preview';
        await deleteMessageWithCallback(ctx);
        return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
      }
    }
  }
  async questoinList(ctx: any) {
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
  async answerList(ctx: any) {
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
          const response = await profileService.registerUser(ctx.wizard.state, callbackQuery.from.id);

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

    if (callbackMessage == 'register_data') {
      // registration
      const response = await profileService.registerUser(ctx.wizard.state, callbackQuery.from.id);

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
