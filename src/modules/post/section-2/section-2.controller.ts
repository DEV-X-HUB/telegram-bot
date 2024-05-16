import {
  deleteKeyboardMarkup,
  deleteMessage,
  deleteMessageWithCallback,
  findSender,
  sendMediaGroup,
} from '../../../utils/constants/chat';
import { areEqaul, isInInlineOption } from '../../../utils/constants/string';

import Section2Formatter from './section-2.formatter';
import PostService from '../post.service';
import { postValidator } from '../../../utils/validator/post-validaor';
import MainMenuController from '../../mainmenu/mainmenu.controller';
import ProfileService from '../../profile/profile.service';
import { displayDialog } from '../../../ui/dialog';
import { CreatePostService2Dto } from '../../../types/dto/create-question-post.dto';
import PostController from '../post.controller';
import config from '../../../config/config';
const section2Formatter = new Section2Formatter();
const profileService = new ProfileService();

let imagesUploaded: any[] = [];
const imagesNumber = 1;

class PostSection2Controller {
  constructor() {}

  async start(ctx: any) {
    await deleteKeyboardMarkup(ctx, section2Formatter.messages.typePrompt);
    ctx.reply(...section2Formatter.typeOptionsDisplay());

    return ctx.wizard.next();
  }

  async chooseType(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(section2Formatter.messages.useButtonError);

    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.scene.leave();
      return MainMenuController.onStart(ctx);
    }
    if (isInInlineOption(callbackQuery.data, section2Formatter.typeOptions)) {
      ctx.wizard.state.service_type = callbackQuery.data;
      ctx.wizard.state.category = 'Section 2';
      deleteMessageWithCallback(ctx);
      ctx.reply(...section2Formatter.enterTiteDisplay());
      return ctx.wizard.next();
    }
    ctx.reply('unkown option');
  }

  async enterTitle(ctx: any) {
    const text = ctx.message.text;

    if (areEqaul(text, 'back', true)) {
      await deleteKeyboardMarkup(ctx, section2Formatter.messages.typePrompt);
      ctx.reply(...section2Formatter.typeOptionsDisplay());
      return ctx.wizard.back();
    }
    ctx.wizard.state.title = text;
    ctx.reply(...section2Formatter.enterDescriptionDisplay());
    return ctx.wizard.next();
  }

  async enterDescription(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section2Formatter.enterTiteDisplay());
      return ctx.wizard.back();
    }

    const validationMessage = postValidator('description', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.description = message;

    if (ctx.wizard.state.service_type == 'amendment') {
      const sender = findSender(ctx);
      const user = await profileService.getProfileByTgId(sender.id);
      if (user) {
        ctx.wizard.state.user = {
          id: user.id,
          display_name: user.display_name,
        };
      }
      ctx.wizard.state.photo = [];
      ctx.wizard.state.status = 'previewing';
      ctx.wizard.state.notify_option = user?.notify_option || 'none';

      ctx.replyWithHTML(...section2Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      ctx.reply(...section2Formatter.previewCallToAction());

      return ctx.wizard.selectStep(5);
    }

    ctx.reply(...section2Formatter.photoDisplay());
    return ctx.wizard.next();
  }
  async attachPhoto(ctx: any) {
    const sender = findSender(ctx);
    const message = ctx?.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section2Formatter.enterDescriptionDisplay());
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section2Formatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length == imagesNumber) {
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);
      // console.log(file);
      await sendMediaGroup(ctx, imagesUploaded, 'Here are the images you uploaded');

      const user = await profileService.getProfileByTgId(sender.id);
      if (user) {
        ctx.wizard.state.user = {
          id: user.id,
          display_name: user.display_name,
        };
      }
      ctx.wizard.state.photo = imagesUploaded;
      ctx.wizard.state.status = 'previewing';
      ctx.wizard.state.notify_option = user?.notify_option || 'none';
      // empty the images array
      imagesUploaded = [];
      ctx.replyWithHTML(...section2Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      ctx.reply(...section2Formatter.previewCallToAction());
      return ctx.wizard.next();
    }
  }
  async preview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    const user = findSender(ctx);
    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...section2Formatter.photoDisplay(), section2Formatter.goBackButton());
        if (ctx.wizard.state.service_type == 'amendment') return ctx.wizard.selectStep(3);
        return ctx.wizard.back();
      }
      await ctx.reply('....');
    } else {
      const state = ctx.wizard.state;
      ``;
      switch (callbackQuery.data) {
        case 'preview_edit': {
          ctx.wizard.state.editField = null;
          await deleteMessageWithCallback(ctx);
          ctx.reply(...section2Formatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }

        case 'post_data': {
          const postDto: CreatePostService2Dto = {
            title: ctx.wizard.state.title as string,
            description: ctx.wizard.state.description as string,
            service_type: ctx.wizard.state.service_type as string,
            notify_option: ctx.wizard.state.notify_option,
            photo: ctx.wizard.state.photo,
            category: 'Section 2',
            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
          };
          const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);

          if (response?.success) {
            ctx.wizard.state.post_id = response?.data?.id;
            ctx.wizard.state.post_main_id = response?.data?.post_id;
            ctx.reply(...section2Formatter.postingSuccessful());
            await deleteMessageWithCallback(ctx);
            await ctx.replyWithHTML(...section2Formatter.preview(ctx.wizard.state, 'submitted'), {
              parse_mode: 'HTML',
            });
            await displayDialog(ctx, 'Posted succesfully');

            // post it to the channel
            await PostController.postToChannel(ctx, config.channel_id, response?.data?.post_id);

            return ctx.wizard.selectStep(8);
          } else {
            ctx.reply(...section2Formatter.postingError());
            if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
              await deleteMessageWithCallback(ctx);
              ctx.scene.leave();
              return MainMenuController.onStart(ctx);
            }

            // increment the registration attempt
            return (ctx.wizard.state.postingAttempt = ctx.wizard.state.postingAttempt
              ? parseInt(ctx.wizard.state.postingAttempt) + 1
              : 1);
          }
        }
        case 'cancel': {
          ctx.wizard.state.status = 'Cancelled';
          await deleteMessageWithCallback(ctx);
          await ctx.replyWithHTML(...section2Formatter.preview(ctx.wizard.state, 'Cancelled'), {
            parse_mode: 'HTML',
          });
          return ctx.wizard.selectStep(8);
        }
        case 'notify_settings': {
          await deleteMessageWithCallback(ctx);
          await ctx.reply(...section2Formatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
          return ctx.wizard.selectStep(9);
        }
        case 'mention_previous_post': {
          // fetch previous posts of the user
          const { posts, success, message } = await PostService.getUserPostsByTgId(user.id);
          if (!success || !posts) return await ctx.reply(message);

          if (posts.length == 0) return await ctx.reply(...section2Formatter.noPostsErrorMessage());

          await deleteMessageWithCallback(ctx);
          await ctx.reply(...section2Formatter.mentionPostMessage());
          for (const post of posts as any) {
            await ctx.reply(...section2Formatter.displayPreviousPostsList(post));
          }
          return ctx.wizard.selectStep(10);
        }

        case 'remove_mention_previous_post': {
          state.mention_post_data = '';
          state.mention_post_id = '';

          await deleteMessageWithCallback(ctx);
          await ctx.replyWithHTML(...section2Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        }
        case 'back': {
          await deleteMessageWithCallback(ctx);
          ctx.wizard.back();
          return await ctx.replyWithHTML(...section2Formatter.preview(state));
        }
        default: {
          await ctx.reply('DEFAULT');
        }
      }
    }
  }
  async editData(ctx: any) {
    const state = ctx.wizard.state;
    const fileds = ['title', 'service_type', 'description', 'photo', 'cancel'];
    const callbackQuery = ctx?.callbackQuery;
    const editField = ctx.wizard.state?.editField;
    if (!callbackQuery) {
      // changing field value
      const messageText = ctx.message.text;
      if (!editField) return await ctx.reply('invalid input ');

      // validate data
      const validationMessage = postValidator(editField, messageText);
      if (validationMessage != 'valid') return await ctx.reply(validationMessage);

      ctx.wizard.state[editField] = messageText;
      await deleteKeyboardMarkup(ctx);
      return ctx.replyWithHTML(...section2Formatter.editPreview(state), { parse_mode: 'HTML' });
    }

    // if callback exists
    // save the mesage id for later deleting
    ctx.wizard.state.previousMessageData = {
      message_id: ctx.callbackQuery.message.message_id,
      chat_id: ctx.callbackQuery.message.chat.id,
    };
    const callbackMessage = callbackQuery.data;

    if (callbackMessage == 'editing_done' || callbackMessage == 'cancel_edit') {
      await deleteMessageWithCallback(ctx);
      await ctx.replyWithHTML(...section2Formatter.preview(state));
      return ctx.wizard.back();
    }
    if (callbackMessage == 'editing_done') {
      await deleteMessageWithCallback(ctx);
      await ctx.replyWithHTML(...section2Formatter.preview(state));
      return ctx.wizard.back();
    }

    if (fileds.some((filed) => filed == callbackQuery.data)) {
      // selecting field to change
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );
      await ctx.reply(...((await section2Formatter.editFieldDispay(callbackMessage)) as any));
      if (areEqaul(callbackQuery.data, 'photo', true)) return ctx.wizard.next();
      return;
    }

    if (editField) {
      //  if edit filed is selected

      ctx.wizard.state[editField] = callbackMessage;
      await deleteMessageWithCallback(ctx);
      ctx.wizard.state.editField = null;
      return ctx.replyWithHTML(...section2Formatter.editPreview(state), { parse_mode: 'HTML' });
    }
  }
  async editPhoto(ctx: any) {
    const messageText = ctx.message?.text;
    if (messageText && areEqaul(messageText, 'back', true)) {
      await deleteMessage(ctx, {
        message_id: (parseInt(messageText.message_id) - 1).toString(),
        chat_id: messageText.chat.id,
      });
      ctx.reply(...section2Formatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section2Formatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length === imagesNumber) {
      await ctx.telegram.sendMediaGroup(ctx.chat.id, 'Here are the images you uploaded');

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;

      // empty the images array
      // imagesUploaded.length = 0;
      ctx.reply(...section2Formatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }
  }
  async postReview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return;
    switch (callbackQuery.data) {
      case 're_submit_post': {
        const postDto: CreatePostService2Dto = {
          title: ctx.wizard.state.title as string,
          description: ctx.wizard.state.description as string,
          service_type: ctx.wizard.state.service_type as string,
          notify_option: ctx.wizard.state.notify_option,
          photo: ctx.wizard.state.photo,
          category: 'Section 2',
          previous_post_id: ctx.wizard.state.mention_post_id || undefined,
        };
        const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);
        if (!response?.success) await ctx.reply('Unable to resubmite');

        ctx.wizard.state.post_id = response?.data?.id;
        ctx.wizard.state.post_main_id = response?.data?.post_id;
        await ctx.reply('Resubmiited');
        return ctx.editMessageReplyMarkup({
          inline_keyboard: [
            [{ text: 'Cancel', callback_data: `cancel_post` }],
            [{ text: 'Main menu', callback_data: 'main_menu' }],
          ],
        });
      }
      case 'cancel_post': {
        console.log(ctx.wizard.state);
        const deleted = await PostService.deletePostById(ctx.wizard.state.post_main_id);

        if (!deleted) return await ctx.reply('Unable to cancel the post ');

        await ctx.reply('Cancelled');
        return ctx.editMessageReplyMarkup({
          inline_keyboard: [
            [{ text: 'Resubmit', callback_data: `re_submit_post` }],
            [{ text: 'Main menu', callback_data: 'main_menu' }],
          ],
        });
      }
      case 'main_menu': {
        deleteMessageWithCallback(ctx);
        ctx.scene.leave();
        return MainMenuController.onStart(ctx);
      }
    }
  }
  async adjustNotifySetting(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return;
    switch (callbackQuery.data) {
      case 'notify_none': {
        ctx.wizard.state.notify_option = 'none';
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...section2Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(5);
      }
      case 'notify_friend': {
        ctx.wizard.state.notify_option = 'friend';
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...section2Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(5);
      }
      case 'notify_follower': {
        await deleteMessageWithCallback(ctx);
        ctx.wizard.state.notify_option = 'follower';
        await ctx.replyWithHTML(...section2Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(5);
      }
    }
  }
  async mentionPreviousPost(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return;
    if (callbackQuery) {
      if (areEqaul(callbackQuery.data, 'back', true)) {
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...section2Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(5);
      }

      if (callbackQuery.data.startsWith('select_post_')) {
        const post_id = callbackQuery.data.split('_')[2];

        ctx.wizard.state.mention_post_id = post_id;
        ctx.wizard.state.mention_post_data = ctx.callbackQuery.message.text;
        await ctx.replyWithHTML(...section2Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(5);
      }
    }
  }
}

export default PostSection2Controller;
