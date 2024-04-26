import { deleteKeyboardMarkup, findSender, sendMessage } from '../../utils/constants/chat';

import ProfileFormatter from './chat-formatter';
import ChatService from './chat.service';
import MainMenuController from '../mainmenu/mainmenu.controller';
import ProfileService from '../profile/profile.service';
import { areEqaul } from '../../utils/constants/string';

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

  async chatList(ctx: any) {
    const query = ctx.callbackQuery.data;
    console.log(query);
  }
  async sendMessage(ctx: any) {
    const sender = findSender(ctx);
    let receiverId = null;
    if (ctx.wizard.state.receiver_id) {
      receiverId = ctx.wizard.state.receiver_id;
    } else {
      const query = ctx.callbackQuery.data;
      const [_, receiver_id] = query.split('_');
      receiverId = receiver_id;
      ctx.wizard.state.receiver_id = receiver_id;
    }

    const receiver = await profileService.getProfileById(receiverId);
    if (!receiver) return ctx.reply(profileFormatter.messages.noReciverErrorMsg);
    ctx.wizard.state.receiver = {
      id: receiver.id,
      display_name: receiver.display_name || 'Anonymous',
      chat_id: receiver.chat_id,
    };

    const userData = await profileService.getProfileDataWithTgId(sender.id);

    if (userData?.display_name == null) {
      ctx.wizard.state.activity = 'update_display_name';
      ctx.wizard.state.reason = 'message_replay';
      return await ctx.reply(...profileFormatter.enterDisplayNameDisplay());
    }
    ctx.wizard.state.activity = 'enter_message_text';
    return ctx.replyWithHTML(...profileFormatter.enterMessageDisplay(receiver.display_name || 'Anonymous'));
  }
  async askToBlock(ctx: any) {
    const sender = findSender(ctx);
    let receiverId = null;
    if (ctx.wizard.state.receiver_id) {
      receiverId = ctx.wizard.state.receiver_id;
    } else {
      const query = ctx.callbackQuery.data;
      const [_, receiver_id] = query.split('_');
      receiverId = receiver_id;
      ctx.wizard.state.receiver_id = receiver_id;
    }

    const receiver = await profileService.getProfileById(receiverId);
    if (!receiver) return ctx.reply(profileFormatter.messages.nouserErrorMsg);
    ctx.wizard.state.receiver = {
      id: receiver.id,
      display_name: receiver.display_name || 'Anonymous',
      chat_id: receiver.chat_id,
    };

    const userData = await profileService.getProfileDataWithTgId(sender.id);

    ctx.wizard.state.activity = 'block_user';
    return ctx.replyWithHTML(...profileFormatter.enterMessageDisplay(receiver.display_name || 'Anonymous'));
  }
  async enterMessage(ctx: any) {
    const sender = findSender(ctx);
    const message = ctx.message;
    if (!message) return await ctx.reply(profileFormatter.messages.ivalidInput);

    if (areEqaul(message.text, 'back', true)) {
      deleteKeyboardMarkup(ctx);
      ctx?.scene?.leave();
    }

    let receiver = ctx.wizard.state.receiver;

    if (!receiver) return await ctx.reply(profileFormatter.messages.noReciverErrorMsg);

    const userData = await profileService.getProfileDataWithTgId(sender.id);
    if (!userData) return;
    const { success } = await chatService.createMessage(userData?.id, receiver.id, message.text);

    if (!success) if (!message) return await ctx.reply(profileFormatter.messages.sendMessageError);

    await sendMessage(
      ctx,
      receiver.chat_id,
      profileFormatter.formatMessageSent(message.text, userData.id, userData?.display_name || ''),
      userData.id,
      'messageid',
    );
    await ctx.replyWithHTML(...profileFormatter.messageSentDisplay(receiver));
    ctx?.scene?.leave();
  }

  async replyToMessage(ctx: any) {
    const sender = findSender(ctx);
    if (ctx.wizard.state.receiver_id) {
    } else {
      const query = ctx.callbackQuery.data;
      const [_, receiver_id] = query.split('_');
      ctx.wizard.state.receiver_id = receiver_id;
    }

    const receiver = await profileService.getProfileById(ctx.wizard.state.receiver_id);
    if (!receiver) return ctx.reply(profileFormatter.messages.noReciverErrorMsg);

    ctx.wizard.state.receiver = {
      id: receiver.id,
      display_name: receiver.display_name || 'Anonymous',
      chat_id: receiver.chat_id,
    };

    const userData = await profileService.getProfileDataWithTgId(sender.id);
    if (userData?.display_name == null) {
      ctx.wizard.state.activity = 'update_display_name';
      ctx.wizard.state.reason = 'message_replay';
      return await ctx.reply(...profileFormatter.enterDisplayNameDisplay());
    }
    ctx.wizard.state.activity = 'enter_message_replay';
    return ctx.replyWithHTML(profileFormatter.enterReplyDisplay(receiver.display_name || 'Anonymous'));
  }
  async enterReplyaMessage(ctx: any) {
    const sender = findSender(ctx);
    const message = ctx.message;
    if (!message) return await ctx.reply(profileFormatter.messages.ivalidInput);

    if (areEqaul(message.text, 'back', true)) {
      deleteKeyboardMarkup(ctx);
      ctx?.scene?.leave();
    }

    let receiver = ctx.wizard.state.receiver;

    if (!receiver) return await ctx.reply(profileFormatter.messages.noReciverErrorMsg);

    const userData = await profileService.getProfileDataWithTgId(sender.id);
    if (!userData) return;
    const { success } = await chatService.createMessage(userData?.id, receiver.id, message.text);
    if (!success) if (!message) return await ctx.reply(profileFormatter.messages.sendMessageError);

    await sendMessage(
      ctx,
      receiver.chat_id,
      profileFormatter.formatMessageSent(message.text, userData.id, userData?.display_name || ''),
      userData.id,
      'messageid',
    );

    await ctx.replyWithHTML(...profileFormatter.replaySentDisplay(receiver));
    ctx?.scene?.leave();
  }
  async updateDisplayName(ctx: any) {
    const sender = findSender(ctx);

    const message = ctx.message;
    if (!message) return await ctx.reply(profileFormatter.messages.ivalidInput);

    if (areEqaul(message.text, 'back', true)) {
      deleteKeyboardMarkup(ctx);
      ctx?.scene?.leave();
    }

    const { status, isDisplayNameTaken, message: errorMsg } = await profileService.isDisplayNameTaken(message.text);

    if (status == 'fail') return ctx.reply(errorMsg);
    if (isDisplayNameTaken) return ctx.reply(profileFormatter.messages.displayNameTakenMsg);

    const { status: updateStatus, message: updateMessage } = await profileService.updateDiplayNameByTgId(
      sender.id.toString(),
      message.text,
    );
    if (updateStatus == 'fail') return ctx.reply(updateMessage);

    const receiver = await profileService.getProfileById(ctx.wizard.state.receiver_id);
    if (!receiver) return ctx.reply(profileFormatter.messages.noReciverErrorMsg);

    // deciding wehere to go next
    if (ctx.wizard.state.reason == 'message_replay') {
      ctx.wizard.state.activity = 'enter_message_replay';
      return ctx.reply(...profileFormatter.enterReplyDisplay(receiver.display_name || 'Anonymous'));
    }
    ctx.wizard.state.activity = 'enter_message_text';
    return ctx.reply(...profileFormatter.enterMessageDisplay(receiver.display_name || 'Anonymous'));
  }
  async blockUser(ctx: any) {
    const sender = findSender(ctx);

    const message = ctx.message;
    if (!message) return await ctx.reply(profileFormatter.messages.ivalidInput);

    if (areEqaul(message.text, 'back', true)) {
      deleteKeyboardMarkup(ctx);
      ctx?.scene?.leave();
    }

    const { status, isDisplayNameTaken, message: errorMsg } = await profileService.isDisplayNameTaken(message.text);

    if (status == 'fail') return ctx.reply(errorMsg);
    if (isDisplayNameTaken) return ctx.reply(profileFormatter.messages.displayNameTakenMsg);

    const { status: updateStatus, message: updateMessage } = await profileService.updateDiplayNameByTgId(
      sender.id.toString(),
      message.text,
    );
    if (updateStatus == 'fail') return ctx.reply(updateMessage);

    const receiver = await profileService.getProfileById(ctx.wizard.state.receiver_id);
    if (!receiver) return ctx.reply(profileFormatter.messages.noReciverErrorMsg);

    // deciding wehere to go next
    if (ctx.wizard.state.reason == 'message_replay') {
      ctx.wizard.state.activity = 'enter_message_replay';
      return ctx.reply(...profileFormatter.enterReplyDisplay(receiver.display_name || 'Anonymous'));
    }
    ctx.wizard.state.activity = 'enter_message_text';
    return ctx.reply(...profileFormatter.enterMessageDisplay(receiver.display_name || 'Anonymous'));
  }
}

export default ChatController;
