import config from '../../../../config/config';
import {
  deleteKeyboardMarkup,
  deleteMessage,
  deleteMessageWithCallback,
  findSender,
  replyDetailWithContext,
  replyPostPreview,
  sendMediaGroup,
} from '../../../../utils/helpers/chat';
import { areEqaul, extractElements, isInInlineOption, isInMarkUPOption } from '../../../../utils/helpers/string';

import Section1AFormatter from './section-a.formatter';
import { postValidator } from '../../../../utils/validator/post-validaor';
import MainMenuController from '../../../mainmenu/mainmenu.controller';
import ProfileService from '../../../profile/profile.service';
import { displayDialog } from '../../../../ui/dialog';
import { CreatePostService1ADto } from '../../../../types/dto/create-question-post.dto';
import PostService from '../../post.service';
import RegistrationService from '../../../registration/restgration.service';
import { getCountryCodeByName } from '../../../../utils/helpers/country-list';
import { ImageCounter } from '../../../../types/params';
import { saveImages } from '../../../../utils/helpers/image';
const registrationService = new RegistrationService();
const section1AFormatter = new Section1AFormatter();
const profileService = new ProfileService();

let imagesUploaded: any[] = [];
let imagesUploadedURL: any[] = [];

class QuestionPostSectionAController {
  imageCounter: ImageCounter[] = [];
  imageTimer: any;
  constructor() {}

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
    if (this.isWaitingImages(sender.id)) await ctx.reply(section1AFormatter.messages.imageWaitingMsg);
  }

  async start(ctx: any) {
    await deleteKeyboardMarkup(ctx, section1AFormatter.messages.arBrPromt);
    await ctx.reply(...section1AFormatter.arBrOptionDisplay());
    return ctx.wizard.next();
  }

  async arBrOption(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    const sender = findSender(ctx);
    if (!callbackQuery) return ctx.reply(section1AFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) {
      await deleteMessageWithCallback(ctx);
      return ctx.scene.enter('Post-Section-1');
    }

    if (isInInlineOption(callbackQuery.data, section1AFormatter.arBrOption)) {
      ctx.wizard.state.arbr_value = callbackQuery.data;
      ctx.wizard.state.category = 'Section 1A';
      const userCountry = await registrationService.getUserCountry(sender.id);
      const countryCode = getCountryCodeByName(userCountry as string);

      ctx.wizard.state.currentRound = 0;
      ctx.wizard.state.countryCode = countryCode;

      await deleteMessageWithCallback(ctx);
      ctx.reply(...section1AFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
      return ctx.wizard.next();
    }
    return ctx.reply('Unknown option. Please choose a valid option.');
  }
  async chooseCity(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(section1AFormatter.messages.useButtonError);

    deleteMessageWithCallback(ctx);
    switch (callbackQuery.data) {
      case 'back': {
        if (ctx.wizard.state.currentRound == 0) {
          ctx.reply(...section1AFormatter.arBrOptionDisplay());
          return ctx.wizard.back();
        }
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
        return ctx.reply(
          ...section1AFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound),
        );
      }
      case 'next': {
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
        return ctx.reply(
          ...section1AFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound),
        );
      }

      default:
        ctx.wizard.state.currentRound = 0;
        ctx.wizard.state.city = callbackQuery.data;
        await ctx.reply(...section1AFormatter.bIDIOptionDisplay());
        return ctx.wizard.next();
    }
  }
  async IDFirstOption(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(section1AFormatter.messages.useButtonError);

    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.wizard.state.currentRound = 0;
      ctx.reply(...section1AFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1AFormatter.bIDiOption)) {
      ctx.wizard.state.id_first_option = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1AFormatter.lastDidtitDisplay());
      return ctx.wizard.next();
    }
  }
  async enterLastDigit(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section1AFormatter.bIDIOptionDisplay());
      return ctx.wizard.back();
    }

    const validationMessage = postValidator('last_digit', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.last_digit = message;
    ctx.reply(...section1AFormatter.locationDisplay());
    return ctx.wizard.next();
  }
  async enterLocation(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section1AFormatter.lastDidtitDisplay());
      return ctx.wizard.back();
    }
    const validationMessage = postValidator('location', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);

    // assign the location to the state
    ctx.wizard.state.location = message;
    await ctx.reply(...section1AFormatter.descriptionDisplay());
    return ctx.wizard.next();
  }
  async enterDescription(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section1AFormatter.locationDisplay());
      return ctx.wizard.back();
    }

    const validationMessage = postValidator('description', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.description = message;
    ctx.reply(...section1AFormatter.photoDisplay());
    return ctx.wizard.next();
  }
  async attachPhoto(ctx: any) {
    const sender = findSender(ctx);
    const message = ctx?.message?.text;

    if (ctx?.message?.document) return ctx.reply(`Please only upload compressed images`);
    this.setImageWaiting(ctx);

    if (message && areEqaul(message, 'back', true)) {
      await deleteMessage(ctx, {
        message_id: (parseInt(ctx.message.message_id) - 1).toString(),
        chat_id: ctx.message.chat.id,
      });
      this.clearImageWaiting(sender.id);
      ctx.reply(...section1AFormatter.descriptionDisplay());
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section1AFormatter.photoDisplay());

    // Add the image to the array
    const photo_id = ctx.message.photo[0].file_id;
    const photo_url = await ctx.telegram.getFileLink(photo_id);
    imagesUploaded.push(photo_id);
    imagesUploadedURL.push(photo_url.href);

    // Check if all images received
    if (imagesUploaded.length == section1AFormatter.imagesNumber) {
      this.clearImageWaiting(sender.id);
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);

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

      ctx.wizard.state.status = 'preview';
      ctx.wizard.state.notify_option = user?.notify_option || 'none';
      // empty the images array
      imagesUploaded = [];
      ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state));
      ctx.replyWithHTML(...section1AFormatter.previewCallToAction());

      return ctx.wizard.next();
    }
  }
  async preview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    const user = findSender(ctx);
    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...section1AFormatter.photoDisplay(), section1AFormatter.goBackButton());
        return ctx.wizard.back();
      }
      await ctx.reply('....');
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'preview_edit': {
          ctx.wizard.state.editField = null;
          await deleteMessageWithCallback(ctx);
          ctx.replyWithHTML(...section1AFormatter.editPreview(state));
          return ctx.wizard.next();
        }

        case 'post_data': {
          const { filePaths, status, msg } = await saveImages({
            fileIds: ctx.wizard.state.photo,
            fileLinks: ctx.wizard.state.photo_url,
            folderName: 'service-1a',
          });
          if (status == 'fail') return await ctx.reply('Unable to download the image please try again');
          const postDto: CreatePostService1ADto = {
            id_first_option: ctx.wizard.state.id_first_option as string,
            arbr_value: ctx.wizard.state.arbr_value as string,
            description: ctx.wizard.state.description as string,
            last_digit: Number(ctx.wizard.state.last_digit) as number,
            location: ctx.wizard.state.location as string,
            photo: ctx.wizard.state.photo,
            // photo_url: ctx.wizard.state.photo_url,
            photo_url: filePaths,
            city: ctx.wizard.state.city,
            notify_option: ctx.wizard.state.notify_option,

            category: 'Section 1A',
            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
          };
          const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);

          if (response?.success) {
            ctx.wizard.state.post_id = response?.data?.id;
            ctx.wizard.state.post_main_id = response?.data?.post_id;
            await displayDialog(ctx, section1AFormatter.messages.postSuccessMsg, true);
            await deleteMessageWithCallback(ctx);

            const elements = extractElements<string>(ctx.wizard.state.photo);
            const [caption, button] = section1AFormatter.preview(ctx.wizard.state, 'submitted');
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
            // jump to post preview
            return ctx.wizard.selectStep(12);
          } else {
            ctx.reply(...section1AFormatter.postingError());
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
          await ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state, 'Cancelled'));
          return ctx.wizard.selectStep(12);
        }
        case 'notify_settings': {
          await deleteMessageWithCallback(ctx);
          await ctx.reply(...section1AFormatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
          return ctx.wizard.selectStep(13);
        }
        case 'mention_previous_post': {
          // fetch previous posts of the user
          const { posts, success, message } = await PostService.getUserPostsByTgId(user.id);
          if (!success || !posts) return await ctx.reply(message);

          if (posts.length == 0) return await ctx.reply(...section1AFormatter.noPostsErrorMessage());

          await deleteMessageWithCallback(ctx);
          await ctx.reply(...section1AFormatter.mentionPostMessage());
          for (const post of posts as any) {
            await ctx.replyWithHTML(...section1AFormatter.displayPreviousPostsList(post));
          }
          return ctx.wizard.selectStep(14);
        }

        case 'remove_mention_previous_post': {
          state.mention_post_data = '';
          state.mention_post_id = '';

          await deleteMessageWithCallback(ctx);
          await ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state));
        }
        case 'back': {
          await deleteMessageWithCallback(ctx);
          ctx.wizard.back();
          return await ctx.replyWithHTML(...section1AFormatter.preview(state), { parse_mode: 'HTML' });
        }
        default: {
          await ctx.reply('DEFAULT');
        }
      }
    }
  }
  async editData(ctx: any) {
    const state = ctx.wizard.state;
    const fileds = [
      'arbr_value',
      'id_first_option',
      'city',
      'last_digit',
      'location',
      'description',
      'photo',
      'cancel',
    ];
    const callbackQuery = ctx?.callbackQuery;
    const editField = ctx.wizard.state?.editField;
    if (!callbackQuery) {
      // changing field value
      const messageText = ctx.message.text;
      if (!editField) return await ctx.reply('invalid input ');

      if (areEqaul(messageText, 'back', true)) {
        ctx.wizard.state.editField = null;
        return ctx.replyWithHTML(...section1AFormatter.editPreview(state));
      }
      // validate data
      const validationMessage = postValidator(editField, messageText);
      if (validationMessage != 'valid') return await ctx.reply(validationMessage);

      ctx.wizard.state[editField] = messageText;
      await deleteKeyboardMarkup(ctx);
      return ctx.replyWithHTML(...section1AFormatter.editPreview(state));
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
      return ctx.replyWithHTML(...section1AFormatter.editPreview(state));
    }
    if (callbackMessage == 'editing_done' || callbackMessage == 'cancel_edit') {
      await deleteMessageWithCallback(ctx);
      await ctx.replyWithHTML(...section1AFormatter.preview(state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }
    if (callbackMessage == 'editing_done') {
      await deleteMessageWithCallback(ctx);
      await ctx.replyWithHTML(...section1AFormatter.preview(state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }

    if (fileds.some((filed) => filed == callbackQuery.data)) {
      // selecting field to change
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );

      if (callbackQuery.data == 'city') {
        ctx.wizard.state.currentRound = 0;
        await ctx.reply(
          ...section1AFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound),
        );
        return ctx.wizard.selectStep(11);
      }
      await ctx.replyWithHTML(...((await section1AFormatter.editFieldDispay(callbackMessage)) as any));
      if (areEqaul(callbackQuery.data, 'photo', true)) return ctx.wizard.selectStep(10);
      return;
    }

    if (editField) {
      //  if edit filed is selected

      ctx.wizard.state[editField] = callbackMessage;
      await deleteMessageWithCallback(ctx);
      ctx.wizard.state.editField = null;
      return ctx.replyWithHTML(...section1AFormatter.editPreview(state));
    }
  }
  async editPhoto(ctx: any) {
    const sender = findSender(ctx);

    this.setImageWaiting(ctx);
    if (ctx.message.document) return ctx.reply(`Please only upload compressed images`);

    const messageText = ctx.message?.text;
    if (messageText && areEqaul(messageText, 'back', true)) {
      ctx.replyWithHTML(...section1AFormatter.editPreview(ctx.wizard.state));
      this.clearImageWaiting(sender.id);
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section1AFormatter.photoDisplay());

    // Add the image to the array

    // Add the image to the array
    const photo_id = ctx.message.photo[0].file_id;
    const photo_url = await ctx.telegram.getFileLink(photo_id);
    imagesUploaded.push(photo_id);
    imagesUploadedURL.push(photo_url.href);

    // Check if all images received
    if (imagesUploaded.length === section1AFormatter.imagesNumber) {
      this.clearImageWaiting(sender.id);
      await sendMediaGroup(ctx, imagesUploaded, 'Here are the images you uploaded');

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;
      ctx.wizard.state.photo_url = imagesUploadedURL;

      // empty the images array
      // imagesUploaded.length = 0;
      ctx.replyWithHTML(...section1AFormatter.editPreview(ctx.wizard.state));
      return ctx.wizard.back();
    }
  }
  async editCity(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(section1AFormatter.messages.useButtonError);

    deleteMessageWithCallback(ctx);
    switch (callbackQuery.data) {
      case 'back': {
        if (ctx.wizard.state.currentRound == 0) {
          await ctx.replyWithHTML(...section1AFormatter.editPreview(ctx.wizard.state));
          return ctx.wizard.selectStep(9);
        }
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
        return ctx.reply(
          ...section1AFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound),
        );
      }
      case 'next': {
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
        return ctx.reply(
          ...section1AFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound),
        );
      }

      default:
        ctx.wizard.state.currentRound = 0;
        ctx.wizard.state.city = callbackQuery.data;
        await ctx.replyWithHTML(...section1AFormatter.editPreview(ctx.wizard.state));
        return ctx.wizard.selectStep(9);
    }
  }
  async postReview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return;
    switch (callbackQuery.data) {
      case 're_submit_post': {
        const { filePaths, status, msg } = await saveImages({
          fileIds: ctx.wizard.state.photo,
          fileLinks: ctx.wizard.state.photo_url,
          folderName: 'service-1a',
        });

        if (status == 'fail') return await ctx.reply('Unable to download the image please try again');

        const postDto: CreatePostService1ADto = {
          id_first_option: ctx.wizard.state.id_first_option as string,
          arbr_value: ctx.wizard.state.arbr_value as string,
          description: ctx.wizard.state.description as string,
          last_digit: Number(ctx.wizard.state.last_digit) as number,
          location: ctx.wizard.state.location as string,
          notify_option: ctx.wizard.state.notify_option,
          photo: ctx.wizard.state.photo,
          // photo_url: ctx.wizard.state.photo_url,
          photo_url: filePaths,
          city: ctx.wizard.state.city,
          category: 'Section 1A',
          previous_post_id: ctx.wizard.state.mention_post_id || undefined,
        };
        const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);
        if (!response?.success) await ctx.reply(section1AFormatter.messages.resubmitError);

        ctx.wizard.state.post_id = response?.data?.id;
        ctx.wizard.state.post_main_id = response?.data?.post_id;
        await displayDialog(ctx, section1AFormatter.messages.postResubmit);

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
        await displayDialog(ctx, section1AFormatter.messages.postCancelled);

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
      section1AFormatter.messages.notifySettingChanged.concat(` to  ${notify_option.toUpperCase()}`),
    );
    await deleteMessageWithCallback(ctx);
    await ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state));
    return ctx.wizard.selectStep(8);
  }
  async mentionPreviousPost(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return;
    if (callbackQuery) {
      if (areEqaul(callbackQuery.data, 'back', true)) {
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state));
        return ctx.wizard.selectStep(8);
      }

      if (callbackQuery.data.startsWith('select_post_')) {
        const post_id = callbackQuery.data.split('_')[2];

        ctx.wizard.state.mention_post_id = post_id;
        ctx.wizard.state.mention_post_data = ctx.callbackQuery.message.text;
        await ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state));
        return ctx.wizard.selectStep(8);
      }
    }
  }
}

export default QuestionPostSectionAController;
