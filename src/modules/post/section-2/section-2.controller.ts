import {
  deleteKeyboardMarkup,
  deleteMessage,
  deleteMessageWithCallback,
  findSender,
  replyPostPreview,
  sendMediaGroup,
} from '../../../utils/helpers/chat';
import { areEqaul, extractElements, isInInlineOption } from '../../../utils/helpers/string';

import Section2Formatter from './section-2.formatter';
import PostService from '../post.service';
import { postValidator } from '../../../utils/validator/post-validaor';
import MainMenuController from '../../mainmenu/mainmenu.controller';
import ProfileService from '../../profile/profile.service';
import { displayDialog } from '../../../ui/dialog';
import { CreatePostService2Dto } from '../../../types/dto/create-question-post.dto';
import PostController from '../post.controller';
import config from '../../../config/config';
import { ImageCounter } from '../../../types/params';
const section2Formatter = new Section2Formatter();
const profileService = new ProfileService();

let imagesUploaded: any[] = [];
let imagesUploadedURL: any[] = [];
const imagesNumber = 1;

class PostSection2Controller {
  imageCounter: ImageCounter[] = [];
  imageTimer: any;
  setImageWaiting(ctx: any) {
    const sender = findSender(ctx);
    if (this.isWaitingImages(sender.id)) return;
    this.imageTimer = setTimeout(
      () => {
        this.sendImageWaitingPrompt(ctx);
      },
      parseInt(config.image_upload_minute.toString()) * 60 * 1000,
    );

    this.imageCounter.push({ id: sender.id, waiting: true });
  }
  clearImageWaiting(id: number) {
    this.imageCounter = this.imageCounter.filter(({ id: counterId }) => counterId != id);
  }

  isWaitingImages(id: number): boolean {
    const exists = this.imageCounter.find(({ id: counterId }) => counterId == id);
    return exists != undefined;
  }
  async sendImageWaitingPrompt(ctx: any) {
    const sender = findSender(ctx);
    if (this.isWaitingImages(sender.id)) {
      await ctx.reply(section2Formatter.messages.imageWaitingMsg);
    }
  }

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
    const validationMessage = postValidator('title', text);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
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

    if (ctx?.message?.document) return ctx.reply(`Please only upload compressed images`);
    this.setImageWaiting(ctx);

    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section2Formatter.enterDescriptionDisplay());
      this.clearImageWaiting(sender.id);
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section2Formatter.photoDisplay());

    // Add the image to the array
    const photo_id = ctx.message.photo[0].file_id;
    const photo_url = await ctx.telegram.getFileLink(photo_id);
    imagesUploaded.push(photo_id);
    imagesUploadedURL.push(photo_url.href);

    // Check if all images received
    if (imagesUploaded.length == section2Formatter.imagesNumber) {
      this.clearImageWaiting(sender.id);
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
      ctx.wizard.state.photo_url = imagesUploadedURL;
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
    } else {
      const state = ctx.wizard.state;

      switch (callbackQuery.data) {
        case 'preview_edit': {
          ctx.wizard.state.editField = null;
          await deleteMessageWithCallback(ctx);
          ctx.replyWithHTML(...section2Formatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }

        case 'post_data': {
          const postDto: CreatePostService2Dto = {
            title: ctx.wizard.state.title as string,
            description: ctx.wizard.state.description as string,
            service_type: ctx.wizard.state.service_type as string,
            notify_option: ctx.wizard.state.notify_option,
            photo: ctx.wizard.state.photo,
            photo_url: ctx.wizard.state.photo_url,
            category: 'Section 2',
            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
          };
          const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);

          if (response?.success) {
            ctx.wizard.state.post_id = response?.data?.id;
            ctx.wizard.state.post_main_id = response?.data?.post_id;

            await displayDialog(ctx, section2Formatter.messages.postSuccessMsg, true);

            await deleteMessageWithCallback(ctx);
            if (ctx.wizard.state.photo.length > 0) {
              const elements = extractElements<string>(ctx.wizard.state.photo);
              const [caption, button] = section2Formatter.preview(ctx.wizard.state, 'submitted');
              if (elements) {
                // if array of elelement has many photos
                await sendMediaGroup(ctx, elements.firstNMinusOne, 'Images Uploaded with post');

                await replyPostPreview({
                  ctx,
                  photoURl: elements.lastElement,
                  caption: caption as string,
                });
              } else {
                // if array of  has one  photo
                await replyPostPreview({
                  ctx,
                  photoURl: ctx.wizard.state.photo[0],
                  caption: caption as string,
                });
              }
            } else {
              await ctx.replyWithHTML(...section2Formatter.preview(ctx.wizard.state, 'submitted'), {
                parse_mode: 'HTML',
              });
            }

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
          await displayDialog(ctx, section2Formatter.messages.postCancelled);
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

    if (areEqaul(callbackMessage, 'back', true)) {
      ctx.wizard.state.editField = null;
      return ctx.replyWithHTML(...section2Formatter.editPreview(state));
    }

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
    const sender = findSender(ctx);

    this.setImageWaiting(ctx);
    if (ctx.message.document) return ctx.reply(`Please only upload compressed images`);

    const messageText = ctx.message?.text;
    if (messageText && areEqaul(messageText, 'back', true)) {
      ctx.reply(...section2Formatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      this.clearImageWaiting(sender.id);
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section2Formatter.photoDisplay());

    // Add the image to the array
    const photo_id = ctx.message.photo[0].file_id;
    const photo_url = await ctx.telegram.getFileLink(photo_id);
    imagesUploaded.push(photo_id);
    imagesUploadedURL.push(photo_url.href);

    // Check if all images received
    if (imagesUploaded.length === imagesNumber) {
      this.clearImageWaiting(sender.id);

      await sendMediaGroup(ctx, imagesUploaded, 'Here are the images you uploaded');

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;
      ctx.wizard.state.photo_url = imagesUploadedURL;

      // empty the images array
      // imagesUploaded.length = 0;
      ctx.replyWithHTML(...section2Formatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
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
          photo_url: ctx.wizard.state.photo_url,
          category: 'Section 2',
          previous_post_id: ctx.wizard.state.mention_post_id || undefined,
        };
        const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);
        if (!response?.success) await ctx.reply('Unable to resubmite');

        ctx.wizard.state.post_id = response?.data?.id;
        ctx.wizard.state.post_main_id = response?.data?.post_id;
        await displayDialog(ctx, section2Formatter.messages.postResubmit);
        return ctx.editMessageReplyMarkup({
          inline_keyboard: [
            [{ text: 'Cancel', callback_data: `cancel_post` }],
            [{ text: 'Main menu', callback_data: 'main_menu' }],
          ],
        });
      }
      case 'cancel_post': {
        const deleted = await PostService.deletePostById(ctx.wizard.state.post_main_id);

        if (!deleted) return await ctx.reply('Unable to cancel the post ');

        await displayDialog(ctx, section2Formatter.messages.postCancelled);
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
    let notify_option = '';
    if (!callbackQuery) return;
    switch (callbackQuery.data) {
      case 'notify_none': {
        ctx.wizard.state.notify_option = 'none';
        notify_option = 'none';
        break;
      }
      case 'notify_friend': {
        ctx.wizard.state.notify_option = 'friend';
        notify_option = 'friends';
        break;
      }
      case 'notify_follower': {
        ctx.wizard.state.notify_option = 'follower';
        notify_option = 'followers';
        break;
      }
    }
    await displayDialog(
      ctx,
      section2Formatter.messages.notifySettingChanged.concat(` to  ${notify_option.toUpperCase()}`),
    );
    await deleteMessageWithCallback(ctx);
    await ctx.replyWithHTML(...section2Formatter.preview(ctx.wizard.state));
    return ctx.wizard.selectStep(5);
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
