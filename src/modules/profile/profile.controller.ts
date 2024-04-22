import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback, findSender } from '../../utils/constants/chat';
import { registrationValidator } from '../../utils/validator/registration-validator';
import { calculateAge } from '../../utils/constants/date';
import config from '../../config/config';

import { Markup } from 'telegraf';
import { areEqaul, isInInlineOption } from '../../utils/constants/string';

import ProfileFormatter from './profile-formatter';
import ProfileService from './profile.service';
import MainMenuController from '../mainmenu/mainmenu.controller';
import { NotifyOption } from '../../types/params';
const profileService = new ProfileService();
const profileFormatter = new ProfileFormatter();
class ProfileController {
  constructor() {}
  saveToState(ctx: any, userData: any) {
    ctx.wizard.state.userData = {
      tg_id: userData?.tg_id,
      id: userData?.id,
      display_name: userData?.display_name,
      bio: userData?.bio,
      gender: userData?.gender,
      notify_option: userData?.notify_option,
      followers: userData?.followers.length,
      followings: userData?.followings.length,
      posts: userData?.posts.length,
      created_at: userData?.created_at,
    };
  }

  async preview(ctx: any) {
    const sender = findSender(ctx);
    const userData = await profileService.getProfileDataWithTgId(sender.id);
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
          return ctx.reply(...profileFormatter.editOptions());
        }
        case 'my_followers': {
          const followers = await profileService.getFollowersByUserId(userData.id);
          await deleteMessageWithCallback(ctx);
          ctx.wizard.state.activity = 'followers_list_view';
          return ctx.replyWithHTML(...profileFormatter.formateFollowersList(followers));
        }
        case 'my_followings': {
          const followings = await profileService.getFollowingsByUserId(userData.id);

          await deleteMessageWithCallback(ctx);
          ctx.wizard.state.activity = 'followings_list_view';
          return ctx.replyWithHTML(...profileFormatter.formateFollowingsList(followings));
        }

        case 'my_posts': {
          const user = findSender(ctx);

          const { posts, success, message } = await profileService.getUserPostsTgId(user.id);

          if (!success || !posts) return ctx.reply(profileFormatter.messages.postFetchError);

          if (posts?.length == 0) return ctx.reply(profileFormatter.messages.noPostMsg);

          await deleteMessageWithCallback(ctx);
          ctx.wizard.state.activity = 'post_list_view';

          // map over the questions array and return the question preview
          posts.map((post: any) => {
            return ctx.replyWithHTML(...profileFormatter.postPreview(post));
          });
        }

        case 'profile_setting': {
          ctx.wizard.state.activity = 'profile_setting';
          deleteMessageWithCallback(ctx);
          return ctx.reply(...profileFormatter.settingDisplay());
        }
        case 'back': {
          deleteMessageWithCallback(ctx);
          ctx?.scene?.leave();
          return MainMenuController.onStart(ctx);
        }

        default: {
          ctx.reply('Unknown Command');
        }
      }
    else {
      ctx.reply(profileFormatter.messages.useButtonError);
    }
  }
  async viewProfileByThirdParty(ctx: any, userId: string) {
    const currentUserData = findSender(ctx);
    const currentUser = await profileService.getProfileByTgId(currentUserData.id);
    if (!currentUser) return;

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

  async editProfileOption(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(profileFormatter.messages.useButtonError);

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
    if (!callbackQuery) return ctx.reply(profileFormatter.messages.useButtonError);
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
    if (!callbackQuery) return ctx.reply(profileFormatter.messages.useButtonError);
    switch (callbackQuery.data) {
      case 'back': {
        ctx.wizard.state.activity = 'preview';
        await deleteMessageWithCallback(ctx);
        return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
      }
    }
  }
  async postList(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(profileFormatter.messages.useButtonError);
    switch (callbackQuery.data) {
      case 'cancel': {
        ctx.wizard.state.activity = 'preview';
        await deleteMessageWithCallback(ctx);
        return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
      }
    }
  }

  async chooseGender(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return await ctx.reply(profileFormatter.messages.useButtonError);

    const callbackMessage = callbackQuery.data;
    switch (callbackMessage) {
      case 'Back': {
        await deleteMessageWithCallback(ctx);
        ctx.reply(...profileFormatter.ageFormatter());
        return ctx.wizard.back();
      }
      default: {
        ctx.wizard.state.gender = callbackMessage;
        await deleteMessageWithCallback(ctx);
        ctx.reply(...profileFormatter.emailFormatter());
        return ctx.wizard.next();
      }
    }
  }

  async enterEmail(ctx: any) {
    const message = ctx.message.text;
    if (message == 'Back') {
      ctx.reply(...profileFormatter.chooseGenderFormatter());
      return ctx.wizard.back();
    }
    if (message == 'Skip') {
      ctx.wizard.state.email = null;
      await deleteKeyboardMarkup(ctx, profileFormatter.messages.countryPrompt);
      ctx.reply(...(await profileFormatter.chooseCountryFormatter()));
      return ctx.wizard.next();
    }
    const validationMessage = registrationValidator('email', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.email = ctx.message.text;
    await deleteKeyboardMarkup(ctx, profileFormatter.messages.countryPrompt);
    ctx.reply(...(await profileFormatter.chooseCountryFormatter()));
    return ctx.wizard.next();
  }

  async chooseCountry(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return await ctx.reply(profileFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) {
      await deleteMessageWithCallback(ctx);
      ctx.reply(...profileFormatter.emailFormatter());
      return ctx.wizard.back();
    }
    const [countryCode, country] = callbackQuery.data.split(':');
    ctx.wizard.state.country = country;
    ctx.wizard.state.countryCode = countryCode;
    ctx.wizard.state.currentRound = 0;
    await deleteMessageWithCallback(ctx);
    ctx.reply(...(await profileFormatter.chooseCityFormatter(countryCode, 0)));
    return ctx.wizard.next();
  }

  async chooseCity(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(profileFormatter.messages.useButtonError);

    deleteMessageWithCallback(ctx);
    switch (callbackQuery.data) {
      case 'back': {
        if (ctx.wizard.state.currentRound == 0) {
          ctx.reply(...(await profileFormatter.chooseCountryFormatter()));
          return ctx.wizard.back();
        }
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
        return ctx.reply(...(await profileFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, 0)));
      }
      case 'next': {
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
        return ctx.reply(
          ...(await profileFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound)),
        );
      }
      default:
        ctx.wizard.state.city = callbackQuery.data;
        ctx.wizard.state.currentRound = 0;
        ctx.reply(...profileFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.next();
    }
  }

  async editRegister(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...profileFormatter.chooseGenderFormatter());
        return ctx.wizard.back();
      }
      await ctx.reply('some thing');
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'preview_edit': {
          ctx.wizard.state.editField = null;
          await deleteMessageWithCallback(ctx);
          ctx.reply(...profileFormatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }
        case 'register_data': {
          const response = await profileService.registerUser(ctx.wizard.state, callbackQuery.from.id);

          if (response.success) {
            await deleteMessageWithCallback(ctx);
            ctx.reply(...profileFormatter.registrationSuccess());
            ctx.scene.leave();
            return MainMenuController.onStart(ctx);
          } else {
            ctx.reply(...profileFormatter.registrationError());
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
        return ctx.reply(...profileFormatter.editPreview(state), { parse_mode: 'HTML' });
      if (!editField) return await ctx.reply('invalid input ');

      const validationMessage = registrationValidator(ctx.wizard.state.editField, ctx.message.text);
      if (validationMessage != 'valid') return await ctx.reply(validationMessage);

      ctx.wizard.state[editField] =
        editField == 'age' ? calculateAge(messageText) : (ctx.wizard.state[editField] = messageText);
      ctx.wizard.state.editField = null;
      deleteKeyboardMarkup(ctx);
      return ctx.reply(...profileFormatter.editPreview(state), { parse_mode: 'HTML' });
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
        ctx.reply(...profileFormatter.registrationSuccess());
        ctx.scene.leave();
        return MainMenuController.onStart(ctx);
      }

      const registrationAttempt = parseInt(ctx.wizard.state.registrationAttempt);
      ctx.reply(...profileFormatter.registrationError());
      if (registrationAttempt >= 2) {
        await deleteMessageWithCallback(ctx);
        ctx.scene.leave();
        return MainMenuController.onStart(ctx);
      }
      return (ctx.wizard.state.registrationAttempt = registrationAttempt ? registrationAttempt + 1 : 1);
    }
    if (areEqaul(callbackMessage, 'back', true)) {
      deleteMessageWithCallback(ctx);
      return ctx.reply(...profileFormatter.editPreview(state), { parse_mode: 'HTML' });
    }
    if (editField) {
      //  if edit filed is selected
      if (callbackMessage.includes(':')) {
        const [countryCode, country] = callbackMessage.split(':');
        ctx.wizard.state.country = country;
        ctx.wizard.state.countryCode = countryCode;
        ctx.wizard.state.currentRound = 0;
        await deleteMessageWithCallback(ctx);
        ctx.reply(...(await profileFormatter.chooseCityFormatter(countryCode, ctx.wizard.state.currentRound)));
        return ctx.wizard.next();
      }
      ctx.wizard.state[editField] = callbackMessage;
      await deleteMessageWithCallback(ctx);
      ctx.wizard.state.editField = null;
      return ctx.reply(...profileFormatter.editPreview(state), { parse_mode: 'HTML' });
    }
    if (fileds.some((filed) => filed == callbackMessage)) {
      // selecting field to change
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );
      await ctx.reply(
        ...(await profileFormatter.editFiledDispay(
          callbackMessage,
          callbackMessage == 'city' ? ctx.wizard.state.countryCode : null,
        )),
        profileFormatter.goBackButton(),
      );
      ctx.wizard.state.currentRound = 0;
      if (areEqaul(callbackMessage, 'city', true)) return ctx.wizard.next();
      return;
    }
  }
  async editCity(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(profileFormatter.messages.useButtonError);

    deleteMessageWithCallback(ctx);
    switch (callbackQuery.data) {
      case 'back': {
        if (ctx.wizard.state.currentRound == 0) {
          ctx.reply(...profileFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
          return ctx.wizard.back();
        }
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
        return ctx.reply(...(await profileFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, 0)));
      }
      case 'next': {
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
        return ctx.reply(
          ...(await profileFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound)),
        );
      }
      default:
        ctx.wizard.state.city = callbackQuery.data;
        ctx.reply(...profileFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.back();
    }
  }
  async settingPreview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(profileFormatter.messages.useButtonError);
    switch (callbackQuery.data) {
      case 'back': {
        ctx.wizard.state.activity = 'preview';
        deleteMessageWithCallback(ctx);
        return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
      }
      case 'notify_setting': {
        ctx.wizard.state.activity = 'notify_setting';
        deleteMessageWithCallback(ctx);
        return ctx.reply(...profileFormatter.notifyOptionDisplay(ctx.wizard.state.userData.notify_option, true));
      }
    }
  }
  async changeNotifSetting(ctx: any) {
    const sender = findSender(ctx);
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(profileFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) {
      ctx.wizard.state.activity = 'profile_setting';
      deleteMessageWithCallback(ctx);
      return ctx.reply(...profileFormatter.settingDisplay());
    }

    const [_, message] = callbackQuery.data.split('_');

    const { success } = await profileService.updateNotifySettingByTgId(sender.id.toString(), message);
    if (!success) return ctx.reply(profileFormatter.messages.updateNotifyOptionError);
    ctx.wizard.state.userData.notify_option = message;

    return ctx.editMessageReplyMarkup({
      inline_keyboard: profileFormatter.notifyOptionDisplay(message),
    });
  }
}

export default ProfileController;
