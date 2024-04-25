import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback, findSender } from '../../utils/constants/chat';

import ProfileFormatter from './chat-formatter';
import ChatService from './chat.service';
import MainMenuController from '../mainmenu/mainmenu.controller';
import ProfileService from '../profile/profile.service';

const chatService = new ChatService();
const profileService = new ProfileService();
const profileFormatter = new ProfileFormatter();

class ChatController {
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

  async sendMessage(ctx: any) {
    const sender = findSender(ctx);
    const userData = await profileService.getProfileDataWithTgId(sender.id);

    if (userData?.display_name == null) {
      ctx.wizard.state.activity = 'update_display_name';
      return await ctx.reply(...profileFormatter.editPrompt('display_name', ctx.wizard.state.userData.gender));
    }
  }
  async replyToMessage(ctx: any) {
    const sender = findSender(ctx);
    const userData = await profileService.getProfileDataWithTgId(sender.id);

    if (userData?.display_name == null) {
      ctx.wizard.state.activity = 'update_display_name';
      return await ctx.reply(...profileFormatter.editPrompt('display_name', ctx.wizard.state.userData.gender));
    }
  }
  async updateDisplayName(ctx: any) {
    const message = ctx.message;
    if (!message) return await ctx.reply('Enter string for name');
    const { status, isDisplayNameTaken, message: errorMsg } = await profileService.isDisplayNameTaken(message.text);

    if (status == 'fail') return ctx.reply(errorMsg);
    if (isDisplayNameTaken) return ctx.reply(profileFormatter.messages.displayNameTakenMsg);
  }
}

export default ChatController;
