import config from '../../../config/config';
import { CreatePostService3Dto } from '../../../types/dto/create-question-post.dto';
import { ImageCounter } from '../../../types/params';
import { displayDialog } from '../../../ui/dialog';
import {
  deleteKeyboardMarkup,
  deleteMessage,
  deleteMessageWithCallback,
  findSender,
  replyPostPreview,
  sendMediaGroup,
} from '../../../utils/helpers/chat';
import { areEqaul, extractElements, isInInlineOption, isInMarkUPOption } from '../../../utils/helpers/string';
import { postValidator } from '../../../utils/validator/post-validaor';
import MainMenuController from '../../mainmenu/mainmenu.controller';
import ProfileService from '../../profile/profile.service';
import PostService from '../post.service';

import Section3Formatter from './section-3.formatter';
const section3Formatter = new Section3Formatter();

let imagesUploaded: any[] = [];
let imagesUploadedURL: any[] = [];

const profileService = new ProfileService();

class Section3Controller {
  constructor() {}
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
    if (this.isWaitingImages(sender.id)) await ctx.reply(section3Formatter.messages.imageWaitingMsg);
  }
  async start(ctx: any) {
    ctx.wizard.state.category = 'Section3';
    await deleteKeyboardMarkup(ctx, 'choose an option');
    await ctx.reply(...section3Formatter.birthOrMaritalOptionDisplay());
    return ctx.wizard.next();
  }

  async chooseBirthOrMarital(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    // if the user is using the inline keyboard
    if (callbackQuery) {
      if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
        deleteMessageWithCallback(ctx);

        // leave this scene a
        ctx.scene.leave();
        return MainMenuController.onStart(ctx);
      }

      if (isInInlineOption(callbackQuery.data, section3Formatter.birthOrMaritalOption)) {
        ctx.wizard.state.birth_or_marital = callbackQuery.data;
        deleteMessageWithCallback(ctx);
        ctx.reply(...section3Formatter.titlePrompt());
        return ctx.wizard.next();
      }
    } else {
      await ctx.reply(...section3Formatter.displayError());
      // stay on the same step
      // return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
  }

  async enterTitle(ctx: any) {
    const message = ctx?.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section3Formatter.birthOrMaritalOptionDisplay());
      return ctx.wizard.back();
    }
    const validationMessage = postValidator('title', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);

    ctx.wizard.state.title = message;
    await ctx.reply(...section3Formatter.descriptionPrompt());
    return ctx.wizard.next();
  }

  async enterDescription(ctx: any) {
    const message = ctx.message.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section3Formatter.birthOrMaritalOptionDisplay());
      return ctx.wizard.back();
    }

    const validationMessage = postValidator('description', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);

    ctx.wizard.state.description = message;

    await ctx.reply(...section3Formatter.photoPrompt(ctx.wizard.state.birth_or_marital == 'birth'));
    return ctx.wizard.next();
  }

  async attachPhoto(ctx: any) {
    const sender = findSender(ctx);
    const message = ctx?.message?.text;

    if (ctx?.message?.document) return ctx.reply(`Please only upload compressed images`);
    this.setImageWaiting(ctx);

    if (message && areEqaul(message, 'back', true)) {
      await deleteKeyboardMarkup(ctx, section3Formatter.messages.descriptionPrompt);
      ctx.reply(...section3Formatter.descriptionPrompt());
      this.clearImageWaiting(sender.id);
      return ctx.wizard.back();
    }

    const user = await profileService.getProfileByTgId(sender.id);
    if (user) {
      ctx.wizard.state.user = {
        id: user.id,
        display_name: user.display_name,
      };
    }
    if (!user) return await ctx.reply(...section3Formatter.somethingWentWrong());

    ctx.wizard.state.user = {
      id: user?.id,
      display_name: user?.display_name,
    };
    ctx.wizard.state.notify_option = user?.notify_option || 'none';

    if (message && areEqaul(message, 'skip', true)) {
      this.clearImageWaiting(sender.id);
      ctx.wizard.state.photo = [];
      ctx.wizard.state.status = 'preview';

      await deleteKeyboardMarkup(ctx, section3Formatter.preview(ctx.wizard.state)[0] as string);
      ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.next();
    }

    // check if image is attached
    if (!ctx.message.photo)
      return ctx.reply(...section3Formatter.photoPrompt(ctx.wizard.state.birth_or_marital == 'birth'));

    // Add the image to the array

    const photo_id = ctx.message.photo[0].file_id;
    const photo_url = await ctx.telegram.getFileLink(photo_id);
    imagesUploaded.push(photo_id);
    imagesUploadedURL.push(photo_url.href);

    // Check if all images received
    if (imagesUploaded.length == section3Formatter.imagesNumber) {
      this.clearImageWaiting(sender.id);
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);
      // console.log(file);
      await deleteKeyboardMarkup(ctx, section3Formatter.preview(ctx.wizard.state)[0] as string);
      await sendMediaGroup(ctx, imagesUploaded, 'Here are the images you uploaded');
      // Find the user

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;
      ctx.wizard.state.photo_url = imagesUploadedURL;
      ctx.wizard.state.status = 'preview';

      // empty the images array
      imagesUploaded = [];
      ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });

      return ctx.wizard.next();
    }
  }

  async preview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    const user = findSender(ctx);

    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(
          ...section3Formatter.photoPrompt(ctx.wizard.state.birth_or_marital == 'birth'),
          section3Formatter.goBackButton(),
        );
        return ctx.wizard.back();
      }
      await ctx.reply('....');
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'preview_edit': {
          console.log('preview edit');
          ctx.wizard.state.editField = null;
          await deleteMessageWithCallback(ctx);
          ctx.replyWithHTML(...section3Formatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }

        case 'editing_done': {
          await deleteMessageWithCallback(ctx);
          await ctx.replyWithHTML(section3Formatter.preview(state));
          return ctx.wizard.back();
        }

        case 'post_data': {
          const postDto: CreatePostService3Dto = {
            birth_or_marital: state.birth_or_marital,
            title: ctx.wizard.state.title,
            description: ctx.wizard.state.description,
            photo: ctx.wizard.state.photo,
            photo_url: ctx.wizard.state.photo_url,
            notify_option: ctx.wizard.state.notify_option,
            category: 'Section 3',
            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
          };
          const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);

          if (response?.success) {
            ctx.wizard.state.post_id = response?.data?.id;
            ctx.wizard.state.post_main_id = response?.data?.post_id;

            await deleteMessageWithCallback(ctx);
            await displayDialog(ctx, section3Formatter.messages.postSuccessMsg, true);
            if (ctx.wizard.state.photo.length > 0) {
              const elements = extractElements<string>(ctx.wizard.state.photo);
              const [caption, button] = section3Formatter.preview(ctx.wizard.state, 'submitted');
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
              await ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state, 'submitted'), {
                parse_mode: 'HTML',
              });
            }

            // jump to posted review
            return ctx.wizard.selectStep(8);
          } else {
            ctx.reply(...section3Formatter.postingError());
            if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
              await deleteMessageWithCallback(ctx);
              ctx.scene.leave();
              return MainMenuController.onStart(ctx);
            }

            if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
              await deleteMessageWithCallback(ctx);
              return ctx.scene.enter('start');
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
          await ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state, 'Cancelled'), {
            parse_mode: 'HTML',
          });
          return ctx.wizard.selectStep(8);
        }
        case 'notify_settings': {
          await deleteMessageWithCallback(ctx);
          await ctx.reply(...section3Formatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
          // jump to notify setting
          return ctx.wizard.selectStep(9);
        }
        case 'mention_previous_post': {
          // fetch previous posts of the user
          const { posts, success, message } = await PostService.getUserPostsByTgId(user.id);
          if (!success || !posts) return await ctx.reply(message);

          if (posts.length == 0) return await ctx.reply(...section3Formatter.noPostsErrorMessage());

          await deleteMessageWithCallback(ctx);
          await ctx.reply(...section3Formatter.mentionPostMessage());
          for (const post of posts as any) {
            await ctx.replyWithHTML(...section3Formatter.displayPreviousPostsList(post));
          }

          // jump to mention previous post
          return ctx.wizard.selectStep(10);
        }

        case 'remove_mention_previous_post': {
          state.mention_post_data = '';
          state.mention_post_id = '';

          await deleteMessageWithCallback(ctx);
          await ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
          // return to preview
          return ctx.wizard.selectStep(5);
        }

        default: {
          await ctx.reply('Unknown action');
        }
        // default: {
        //   await ctx.reply('DEFAULT');
        // }
      }
    }
  }
  async editData(ctx: any) {
    const state = ctx.wizard.state;
    const fileds = ['birth_or_marital', 'title', 'description', 'photo', 'cancel'];
    const callbackQuery = ctx?.callbackQuery;
    const editField = ctx.wizard.state?.editField;
    if (!callbackQuery) {
      // changing field value
      const messageText = ctx.message.text;
      if (!editField) return await ctx.reply('invalid input ');

      if (areEqaul(messageText, 'back', true)) {
        ctx.wizard.state.editField = null;

        return ctx.replyWithHTML(...section3Formatter.editPreview(state));
      }

      const validationMessage = postValidator(editField, messageText);
      if (validationMessage != 'valid') return await ctx.reply(validationMessage);

      ctx.wizard.state[editField] = messageText;

      await deleteKeyboardMarkup(ctx, section3Formatter.preview(ctx.wizard.state)[0] as string);
      return ctx.replyWithHTML(...section3Formatter.editPreview(state), { parse_mode: 'HTML' });
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
      return ctx.replyWithHTML(...section3Formatter.editPreview(state));
    }

    if (callbackMessage == 'editing_done' || callbackMessage == 'cancel_edit') {
      await deleteMessageWithCallback(ctx);
      await ctx.replyWithHTML(...section3Formatter.preview(state));
      return ctx.wizard.back();
    }
    if (callbackMessage == 'editing_done') {
      await deleteMessageWithCallback(ctx);
      await ctx.replyWithHTML(...section3Formatter.preview(state));
      return ctx.wizard.back();
    }

    if (fileds.some((filed) => filed == callbackQuery.data)) {
      // selecting field to change
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );
      await ctx.reply(
        ...((await section3Formatter.editFieldDisplay(
          callbackMessage,
          ctx.wizard.state.birth_or_marital == 'birth',
        )) as any),
      );
      if (areEqaul(callbackQuery.data, 'photo', true)) return ctx.wizard.next();
      return;
    }

    if (editField) {
      //  if edit filed is selected

      ctx.wizard.state[editField] = callbackMessage;
      await deleteMessageWithCallback(ctx);
      ctx.wizard.state.editField = null;
      return ctx.replyWithHTML(...section3Formatter.editPreview(state), { parse_mode: 'HTML' });
    }
  }

  async editPhoto(ctx: any) {
    const sender = findSender(ctx);
    const messageText = ctx.message?.text;

    this.setImageWaiting(ctx);
    if (ctx.message.document) return ctx.reply(`Please only upload compressed images`);

    if (messageText && (areEqaul(messageText, 'skip', true) || areEqaul(messageText, 'back', true))) {
      await deleteKeyboardMarkup(ctx, section3Formatter.preview(ctx.wizard.state)[0] as string);
      ctx.reply(...section3Formatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });

      this.clearImageWaiting(sender.id);
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo)
      return ctx.reply(...section3Formatter.photoPrompt(ctx.wizard.state.birth_or_marital == 'birth'));

    // Add the image to the array

    const photo_id = ctx.message.photo[0].file_id;
    const photo_url = await ctx.telegram.getFileLink(photo_id);
    imagesUploaded.push(photo_id);
    imagesUploadedURL.push(photo_url.href);

    // Check if all images received
    if (imagesUploaded.length === section3Formatter.imagesNumber) {
      this.clearImageWaiting(sender.id);
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);

      await deleteKeyboardMarkup(ctx, section3Formatter.preview(ctx.wizard.state)[0] as string);
      await sendMediaGroup(ctx, imagesUploaded, 'Here are the images you uploaded');
      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;
      ctx.wizard.state.photo_url = imagesUploadedURL;

      // empty the images array
      // imagesUploaded.length = 0;
      ctx.replyWithHTML(...section3Formatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }
  }

  async postReview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return;
    switch (callbackQuery.data) {
      case 're_submit_post': {
        const postDto: CreatePostService3Dto = {
          birth_or_marital: ctx.wizard.state.birth_or_marital,
          title: ctx.wizard.state.title,
          photo: ctx.wizard.state.photo,
          photo_url: ctx.wizard.state.photo_url,
          description: ctx.wizard.state.description,
          category: 'Section 3',
          notify_option: ctx.wizard.state.notify_option,
          previous_post_id: ctx.wizard.state.mention_post_id || undefined,
        };
        const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);
        if (!response?.success) return await ctx.reply('Unable to resubmite');

        ctx.wizard.state.post_id = response?.data?.id;
        ctx.wizard.state.post_main_id = response?.data?.post_id;
        await displayDialog(ctx, section3Formatter.messages.postResubmit);

        return ctx.editMessageReplyMarkup({
          inline_keyboard: [
            [{ text: 'Cancel', callback_data: `cancel_post` }],
            [{ text: 'Main menu', callback_data: 'main_menu' }],
          ],
        });
      }
      case 'cancel_post': {
        const deleted = await PostService.deletePostById(ctx.wizard.state.post_main_id, 'Section 1A');

        if (!deleted) return await ctx.reply('Unable to cancel the post ');

        await displayDialog(ctx, section3Formatter.messages.postCancelled);

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
      section3Formatter.messages.notifySettingChanged.concat(` to  ${notify_option.toUpperCase()}`),
    );
    await deleteMessageWithCallback(ctx);
    await ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state));
    return ctx.wizard.selectStep(5);
  }
  async mentionPreviousPost(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return;
    if (callbackQuery) {
      if (areEqaul(callbackQuery.data, 'back', true)) {
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.back();
      }

      if (callbackQuery.data.startsWith('select_post_')) {
        const post_id = callbackQuery.data.split('_')[2];

        ctx.wizard.state.mention_post_id = post_id;
        ctx.wizard.state.mention_post_data = ctx.callbackQuery.message.text;
        await ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        // go back to preview
        return ctx.wizard.selectStep(5);
      }
    }
  }
}

export default Section3Controller;
