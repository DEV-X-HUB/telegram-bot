import {
  deleteKeyboardMarkup,
  deleteMessageWithCallback,
  findSender,
  replyUserPostPreviewWithContext,
} from '../../utils/helpers/chat';
import { registrationValidator } from '../../utils/validator/registration-validator';
import { calculateAge } from '../../utils/helpers/date';
import config from '../../config/config';
import CreateUserDto from '../../types/dto/create-user.dto';
import { Context } from 'telegraf';

import { Markup } from 'telegraf';
import { areEqaul, extractElements, getSectionName, isInInlineOption } from '../../utils/helpers/string';

import ProfileFormatter from './profile-formatter';
import ProfileService from './profile.service';
import MainMenuController from '../mainmenu/mainmenu.controller';
import PostService from '../post/post.service';
import { PostCategory } from '../../types/params';
import { profileValidator } from '../../utils/validator/profile-validator';

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
      country: userData?.country,
      city: userData?.city,
      age: userData?.age,
      email: userData?.email,
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

    await deleteKeyboardMarkup(ctx, profileFormatter.formatePreview(ctx.wizard.state.userData));
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

          for (const post of posts) {
            const sectionName = getSectionName(post.category) as PostCategory;
            if ((post as any)[sectionName]?.photo && (post as any)[sectionName]?.photo[0]) {
              await replyUserPostPreviewWithContext({
                ctx,
                photoURl: (post as any)[sectionName].photo[0],
                caption: profileFormatter.postPreview(post)[0] as string,
                post_id: post.id,
                status: post.status,
              });
            } else ctx.replyWithHTML(...profileFormatter.postPreview(post)); // if post has no photo
          }
          break;
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

    if (currentUser && currentUser?.id == userId) {
      return ctx.scene.enter('Profile');
    }

    const { status, isFollowing } = await profileService.isFollowing(currentUser?.id || '', userId);
    if (status == 'fail') return ctx.reply(profileFormatter.messages.dbError);

    const userData = await profileService.getProfileDataWithId(userId);
    const { isBlocked } = await profileService.isBlockedBy(currentUser?.id || '', userId);
    if (!userData) return ctx.reply(profileFormatter.messages.userNotFound);

    return ctx.reply(...profileFormatter.profilePreviwByThirdParty(userData, isFollowing, isBlocked));
  }
  async handleFollow(ctx: any, query: string) {
    const [_, userId] = query.split('_');
    const currentUserData = findSender(ctx);
    const currentUser = await profileService.getProfileByTgId(currentUserData.id);
    if (!currentUser) return;

    const { status } = await profileService.followUser(currentUser?.id, userId);
    if (status == 'fail') return ctx.reply(profileFormatter.messages.dbError);

    const userData = await profileService.getProfileDataWithId(userId);

    const { isBlocked } = await profileService.isBlockedBy(currentUser?.id || '', userId);

    if (userData)
      try {
        return ctx.editMessageReplyMarkup({
          inline_keyboard: [profileFormatter.getProfileButtons(userData.id, true, isBlocked)],
        });
      } catch (error) {
        console.log(error);
      }
  }
  async handlUnfollow(ctx: any, query: string) {
    const [_, userId] = query.split('_');
    const currentUserData = findSender(ctx);
    const currentUser = await profileService.getProfileByTgId(currentUserData.id);
    if (!currentUser) return;

    const userData = await profileService.getProfileDataWithId(userId);

    const { status } = await profileService.unfollowUser(currentUser?.id, userId);
    if (status == 'fail') return ctx.reply(profileFormatter.messages.dbError);

    const { isBlocked } = await profileService.isBlockedBy(currentUser?.id || '', userId);
    return ctx.editMessageReplyMarkup({
      inline_keyboard: [profileFormatter.getProfileButtons(userId, false, isBlocked)],
    });
  }
  async askToBlock(ctx: any, query: string) {
    const [_, userId] = query.split('_');
    const currentUserData = findSender(ctx);
    const currentUser = await profileService.getProfileByTgId(currentUserData.id);
    if (!currentUser) return;

    const userData = await profileService.getProfileDataWithId(userId);

    if (!userData) return ctx.reply(profileFormatter.messages.dbError);
    await deleteMessageWithCallback(ctx);
    return ctx.replyWithHTML(
      ...profileFormatter.blockUserDisplay({ id: userData.id, display_name: userData.display_name || 'Anoynmous' }),
      { parse_mode: 'HTML' },
    );
  }
  async handleBlock(ctx: any, query: string) {
    const [_, userId] = query.split('_');
    const currentUserData = findSender(ctx);
    const currentUser = await profileService.getProfileByTgId(currentUserData.id);
    if (!currentUser) return;

    const { status: blockStatus } = await profileService.blockUser(currentUser?.id, userId);
    if (blockStatus == 'fail') return ctx.reply(profileFormatter.messages.dbError);

    const { status, isFollowing } = await profileService.isFollowing(currentUser?.id || '', userId);
    if (status == 'fail') return ctx.reply(profileFormatter.messages.dbError);

    const userData = await profileService.getProfileDataWithId(userId);
    const { isBlocked } = await profileService.isBlockedBy(currentUser?.id || '', userId);

    deleteMessageWithCallback(ctx);
    await ctx.reply(profileFormatter.messages.blockSuccess);
    return ctx.reply(...profileFormatter.profilePreviwByThirdParty(userData, isFollowing, isBlocked));
  }
  async cancelBlock(ctx: any, query: string) {
    const [_, userId] = query.split('_');
    const currentUserData = findSender(ctx);
    const currentUser = await profileService.getProfileByTgId(currentUserData.id);
    if (!currentUser) return;

    const { status, isFollowing } = await profileService.isFollowing(currentUser?.id || '', userId);
    if (status == 'fail') return ctx.reply(profileFormatter.messages.dbError);

    const userData = await profileService.getProfileDataWithId(userId);

    const { isBlocked } = await profileService.isBlockedBy(currentUser?.id || '', userId);
    deleteMessageWithCallback(ctx);
    return ctx.reply(...profileFormatter.profilePreviwByThirdParty(userData, isFollowing, isBlocked));
  }

  async handlUnblock(ctx: any, query: string) {
    const [_, userId] = query.split('_');
    const currentUserData = findSender(ctx);
    const currentUser = await profileService.getProfileByTgId(currentUserData.id);
    if (!currentUser) return;

    const { status } = await profileService.unblockUser(currentUser?.id, userId);
    if (status == 'fail') return ctx.reply(profileFormatter.messages.dbError);

    const { status: followStatus, isFollowing } = await profileService.isFollowing(currentUser?.id || '', userId);
    if (followStatus == 'fail') return ctx.reply(profileFormatter.messages.dbError);

    const { isBlocked } = await profileService.isBlockedBy(currentUser?.id || '', userId);
    const userData = await profileService.getProfileDataWithId(userId);
    deleteMessageWithCallback(ctx);
    await ctx.reply(profileFormatter.messages.unBlockSuccess);
    return ctx.reply(...profileFormatter.profilePreviwByThirdParty(userData, isFollowing, isBlocked));
  }

  async editProfileOption(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(profileFormatter.messages.useButtonError);

    deleteMessageWithCallback(ctx);
    if (areEqaul(callbackQuery.data, 'back', true))
      return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
    ctx.wizard.state.activity = 'profile_edit_editing';
    ctx.wizard.state.editField = callbackQuery.data;
    return ctx.reply(...(await profileFormatter.editPrompt(callbackQuery.data, ctx.wizard.state.userData.gender)));
  }

  async editProfileEditField(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    const message = ctx.message;

    const state = ctx.wizard.state;
    if (callbackQuery) {
      switch (state.editField) {
        case 'city': {
          switch (callbackQuery.data) {
            case 'back': {
              if (ctx.wizard.state.currentRound == 0) {
                ctx.wizard.state.editField = 'country';
                deleteMessageWithCallback(ctx);
                return ctx.reply(...(await profileFormatter.chooseCountryFormatter()));
              }
              ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
              deleteMessageWithCallback(ctx);
              return ctx.reply(
                ...(await profileFormatter.chooseCityFormatter(
                  ctx.wizard.state.countryCode,
                  ctx.wizard.state.currentRound,
                )),
              );
            }
            case 'next': {
              ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
              deleteMessageWithCallback(ctx);
              return ctx.reply(
                ...(await profileFormatter.chooseCityFormatter(
                  ctx.wizard.state.countryCode,
                  ctx.wizard.state.currentRound,
                )),
              );
            }

            default:
              ctx.wizard.state.userData[state.editField] = callbackQuery.data;
              ctx.wizard.state.currentRound = 0;
              ctx.wizard.state.activity = 'preview';

              const newData = await profileService.updateProfile(state.userData.id, {
                bio: state.userData.bio,
                gender: state.userData.gender,
                display_name: state.userData.display_name,
                city: state.userData.city,
                country: state.userData.country,
                email: state.userData.email,
                age: parseInt(state.userData.age.toString()),
              });
              deleteMessageWithCallback(ctx);
              this.saveToState(ctx, newData);
              return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
          }
        }
        case 'country': {
          const [countryCode, country] = callbackQuery.data.split(':');
          ctx.wizard.state.countryCode = countryCode;
          ctx.wizard.state.userData[state.editField] = country;
          ctx.wizard.state.editField = 'city';
          ctx.wizard.state.currentRound = 0;
          await deleteMessageWithCallback(ctx);
          return ctx.reply(...(await profileFormatter.chooseCityFormatter(countryCode, 0)));
        }

        case 'back': {
          ctx.wizard.state.activity = 'profile_edit_option_view';
          return ctx.reply(...profileFormatter.editOptions());
        }

        default:
          ctx.wizard.state.userData[state.editField] = callbackQuery.data;
          const newData = await profileService.updateProfile(state.userData.id, {
            bio: state.userData.bio,
            gender: state.userData.gender,
            display_name: state.userData.display_name,
            city: state.userData.city,
            country: state.userData.country,
            email: state.userData.email,
            age: parseInt(state.userData.age.toString()),
          });
          deleteMessageWithCallback(ctx);
          this.saveToState(ctx, newData);
          ctx.wizard.state.activity = 'preview';
          return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
      }
    }

    if (message?.text && areEqaul(message?.text, 'back', true)) {
      ctx.wizard.state.activity = 'profile_edit_option_view';
      return ctx.reply(...profileFormatter.editOptions());
    }

    if (state.editField == 'display_name') {
      const { status, isDisplayNameTaken, message: errorMsg } = await profileService.isDisplayNameTaken(message.text);

      if (status == 'fail') return ctx.reply(errorMsg);
      if (isDisplayNameTaken) return ctx.reply(profileFormatter.messages.displayNameTakenMsg);
    }

    const validationMessage = profileValidator(state.editField, message.text);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    if (state.editField == 'age') state.userData[state.editField] = calculateAge(ctx.message.text);
    else state.userData[state.editField] = message.text;

    const newData = await profileService.updateProfile(state.userData.id, {
      bio: state.userData.bio,
      gender: state.userData.gender,
      display_name: state.userData.display_name,
      city: state.userData.city,
      country: state.userData.country,
      email: state.userData.email,
      age: parseInt(state.userData.age.toString()),
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

  async sendMessage(ctx: any, receiver_id: string, message: string) {
    const sender = findSender(ctx);

    const userData = await profileService.getProfileDataWithTgId(sender.id);

    if (userData?.display_name == null) {
      ctx.wizard.state.activity = 'update_display_name';
      return ctx.reply(...(await profileFormatter.editPrompt('display_name', ctx.wizard.state.userData.gender)));
    }
  }
  async replyToMessage(ctx: any, receiver_id: string, message: string) {
    const sender = findSender(ctx);

    const userData = await profileService.getProfileDataWithTgId(sender.id);

    if (userData?.display_name == null) {
      ctx.wizard.state.activity = 'update_display_name';
      return ctx.reply(...(await profileFormatter.editPrompt('display_name', ctx.wizard.state.userData.gender)));
    }
  }

  async updateDisplayName(ctx: any) {
    const message = ctx.message;
    if (!message) return await ctx.reply('Enter string for name');
    const { status, isDisplayNameTaken, message: errorMsg } = await profileService.isDisplayNameTaken(message.text);

    if (status == 'fail') return ctx.reply(errorMsg);
    if (isDisplayNameTaken) return ctx.reply(profileFormatter.messages.displayNameTakenMsg);
  }

  async handleOpenPost(ctx: any, post_id: string) {
    const message = ctx.callbackQuery.message;

    const message_id = message.message_id;
    const chat_id = message.chat.id;

    const { data, status } = await profileService.updatePostStatusByUser(post_id, 'open');
    if (status == 'fail') return ctx.reply('Unable to  Open the post ');
    const response: any = profileFormatter.postPreview(data);
    const [messageText, buttons] = response;

    return await ctx.telegram.editMessageText(
      chat_id, // Chat ID
      message_id,
      undefined, // Message ID
      messageText, // New text to set
      {
        reply_markup: buttons?.reply_markup,
        parse_mode: 'HTML',
      },
    );
  }
  async handleClosePost(ctx: any, post_id: string) {
    const message = ctx.callbackQuery.message;

    const message_id = message.message_id;
    const chat_id = message.chat.id;

    const { data, status } = await profileService.updatePostStatusByUser(post_id, 'closed');
    if (status == 'fail') return ctx.reply('Unable to  Close  the post ');
    const response: any = profileFormatter.postPreview(data);
    const [messageText, buttons] = response;

    return await ctx.telegram.editMessageText(
      chat_id, // Chat ID
      message_id,
      undefined, // Message ID
      messageText, // New text to set
      {
        reply_markup: buttons?.reply_markup,
        parse_mode: 'HTML',
      },
    );
  }
  async handleCancelPost(ctx: any, post_id: string) {
    const deleted = await PostService.deletePostById(post_id);
    if (deleted) {
      await deleteMessageWithCallback(ctx);
      return ctx.reply('Post Cancelled');
    } else {
      return ctx.reply('Unable to  cancelled the post ');
    }
  }
}

export default ProfileController;
