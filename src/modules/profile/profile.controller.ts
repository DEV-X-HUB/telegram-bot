import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback, findSender } from '../../utils/constants/chat';
import { registrationValidator } from '../../utils/validator/registration-validator';
import { calculateAge } from '../../utils/constants/date';
import config from '../../config/config';

import { Markup } from 'telegraf';
import { areEqaul, isInInlineOption } from '../../utils/constants/string';

import RegistrationFormatter from './profile-formatter';
import ProfileService from './profile.service';
import MainMenuController from '../mainmenu/mainmenu.controller';
const profileService = new ProfileService();
const profileFormatter = new RegistrationFormatter();
const registrationFormatter = new RegistrationFormatter();
class ProfileController {
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

  async viewProfileByThirdParty(ctx: any, userId: string) {
    const currentUserData = findSender(ctx);
    const currentUser = await profileService.getProfileByTgId(currentUserData.id);
    if (!currentUser) return;
    // console.log(currentUser.id, userId); retur
    if (currentUser?.id == userId) {
      return ctx.scene.enter('Profile');
    }

    const { status, isFollowing } = await profileService.isFollowing(currentUser?.id, userId);
    if (status == 'fail') return ctx.reply(profileFormatter.messages.dbError);

    const userData = await profileService.getProfileDataWithId(userId);
    return ctx.reply(...profileFormatter.profilePreviwByThirdParty(userData, isFollowing));
  }
  async handleFollow(ctx: any, query: string) {
    const [_, userId] = query.split('_');
    const currentUserData = findSender(ctx);
    const currentUser = await profileService.getProfileByTgId(currentUserData.id);
    if (!currentUser) return;

    const { status } = await profileService.followUser(currentUser?.id, userId);
    if (status == 'fail') return ctx.reply(profileFormatter.messages.dbError);

    const userData = await profileService.getProfileDataWithId(userId);
    if (userData)
      return ctx.editMessageReplyMarkup({
        inline_keyboard: [[{ text: 'Unfollow', callback_data: `unfollow_${userData.id}` }]],
      });
  }
  async handlUnfollow(ctx: any, query: string) {
    const [_, userId] = query.split('_');
    const currentUserData = findSender(ctx);
    const currentUser = await profileService.getProfileByTgId(currentUserData.id);
    if (!currentUser) return;

    const userData = await profileService.getProfileDataWithId(userId);

    const { status } = await profileService.unfollowUser(currentUser?.id, userId);
    if (status == 'fail') return ctx.reply(profileFormatter.messages.dbError);

    if (userData)
      return ctx.editMessageReplyMarkup({
        inline_keyboard: [[{ text: 'Follow', callback_data: `follow1_${userData?.id}` }]],
      });
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

        case 'my_questions': {
          let tg_id;
          if (ctx.callbackQuery) tg_id = ctx.callbackQuery.from.id;
          else tg_id = ctx.message.from.id;

          const user = await profileService.getProfileDataWithTgId(tg_id);
          console.log('user', user);
          const questions: any = await profileService.getQuestionsOfUser(userData.id);

          console.log(questions);
          await deleteMessageWithCallback(ctx);
          ctx.wizard.state.activity = 'questions_list_view';

          // map over the questions array and return the question preview
          questions.map((question: any) => {
            return ctx.reply(...profileFormatter.questionPreview(question));
          });
        }

        case 'cancel': {
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
  async questionsList(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(registrationFormatter.messages.useButtonError);
    switch (callbackQuery.data) {
      case 'cancel': {
        ctx.wizard.state.activity = 'preview';
        await deleteMessageWithCallback(ctx);
        return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
      }
    }
  }
  async answersList(ctx: any) {}
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
            ctx.scene.leave();
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

    if (callbackMessage == 'register_data') {
      // registration
      const response = await profileService.registerUser(ctx.wizard.state, callbackQuery.from.id);

      if (response.success) {
        await deleteMessageWithCallback(ctx);
        ctx.reply(...registrationFormatter.registrationSuccess());
        ctx.scene.leave();
        return MainMenuController.onStart(ctx);
      }

      const registrationAttempt = parseInt(ctx.wizard.state.registrationAttempt);
      ctx.reply(...registrationFormatter.registrationError());
      if (registrationAttempt >= 2) {
        await deleteMessageWithCallback(ctx);
        ctx.scene.leave();
        return MainMenuController.onStart(ctx);
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

export default ProfileController;
