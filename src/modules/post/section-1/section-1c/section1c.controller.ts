import config from '../../../../config/config';
import { CreatePostService1CDto } from '../../../../types/dto/create-question-post.dto';
import { ImageCounter } from '../../../../types/params';
import { displayDialog } from '../../../../ui/dialog';
import {
  deleteKeyboardMarkup,
  deleteMessage,
  deleteMessageWithCallback,
  findSender,
  replyPostPreview,
  sendMediaGroup,
} from '../../../../utils/helpers/chat';
import { getCountryCodeByName } from '../../../../utils/helpers/country-list';
import { areEqaul, extractElements, isInInlineOption, isInMarkUPOption } from '../../../../utils/helpers/string';
import { postValidator } from '../../../../utils/validator/post-validaor';
import MainMenuController from '../../../mainmenu/mainmenu.controller';
import ProfileService from '../../../profile/profile.service';
import RegistrationService from '../../../registration/restgration.service';
import PostService from '../../post.service';

import QuestionPostSection1CFormatter from './section1c.formatter';

const section1cFormatter = new QuestionPostSection1CFormatter();
const profileService = new ProfileService();
const registrationService = new RegistrationService();

let imagesUploaded: any[] = [];
class QuestionPostSection1CController {
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
    return this.imageCounter.find(({ id: counterId }) => counterId == id) ? true : false;
  }
  async sendImageWaitingPrompt(ctx: any) {
    const sender = findSender(ctx);
    if (this.isWaitingImages(sender.id)) await ctx.reply(section1cFormatter.messages.imageWaitingMsg);
  }

  async start(ctx: any) {
    ctx.wizard.state.category = 'Section1c';

    await deleteKeyboardMarkup(ctx, section1cFormatter.messages.paperStampPromt);
    await ctx.reply(...section1cFormatter.choosePaperStampDisplay());

    return ctx.wizard.next();
  }

  async choosePaperTimeStamp(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    // if the user is using the inline keyboard
    if (callbackQuery) {
      if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
        deleteMessageWithCallback(ctx);
        // leave this scene and go back to the previous scene
        ctx.scene.leave();
        return ctx.scene.enter('Post-Section-1');
      }

      if (isInInlineOption(callbackQuery.data, section1cFormatter.paperStampOption)) {
        ctx.wizard.state.paper_stamp = callbackQuery.data;
        deleteMessageWithCallback(ctx);
        ctx.reply(...section1cFormatter.arBrOptionDisplay());
        return ctx.wizard.next();
      }
    }

    // if the user is using the text message
    else {
      await ctx.reply(...section1cFormatter.paperTimestampError());
      // stay on the same step
      // return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
  }
  async arBrOption(ctx: any) {
    const sender = findSender(ctx);
    const callbackQuery = ctx?.callbackQuery;

    if (!callbackQuery) return ctx.reply(section1cFormatter.messages.useButtonError);

    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.choosePaperStampDisplay());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1cFormatter.arBrOption)) {
      ctx.wizard.state.arbr_value = callbackQuery.data;
      const userCountry = await registrationService.getUserCountry(sender.id);
      const countryCode = getCountryCodeByName(userCountry as string);

      ctx.wizard.state.currentRound = 0;
      ctx.wizard.state.countryCode = countryCode;
      deleteMessageWithCallback(ctx);

      ctx.reply(...section1cFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
      return ctx.wizard.next();
    }
    return ctx.reply('Unknown option. Please choose a valid option.');
  }
  async chooseCity(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(section1cFormatter.messages.useButtonError);

    deleteMessageWithCallback(ctx);
    switch (callbackQuery.data) {
      case 'back': {
        if (ctx.wizard.state.currentRound == 0) {
          ctx.reply(...section1cFormatter.arBrOptionDisplay());
          return ctx.wizard.back();
        }
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
        return ctx.reply(
          ...section1cFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound),
        );
      }
      case 'next': {
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
        return ctx.reply(
          ...section1cFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound),
        );
      }

      default:
        ctx.wizard.state.currentRound = 0;
        ctx.wizard.state.city = callbackQuery.data;
        ctx.reply(...section1cFormatter.serviceType1Display());
        return ctx.wizard.next();
    }
  }
  async chooseServiceType1(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(section1cFormatter.messages.useButtonError);

    deleteMessageWithCallback(ctx);
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      ctx.wizard.state.currentRound = 0;
      ctx.reply(...section1cFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1cFormatter.serviceType1)) {
      ctx.wizard.state.service_type_1 = callbackQuery.data;
      ctx.reply(...section1cFormatter.serviceType2Display());
      return ctx.wizard.next();
    }
  }

  async chooseServiceType2(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(section1cFormatter.messages.useButtonError);

    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.serviceType1Display());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1cFormatter.serviceType2)) {
      ctx.wizard.state.service_type_2 = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.serviceType3Display());
      return ctx.wizard.next();
    }
  }

  async chooseServiceType3(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(section1cFormatter.messages.useButtonError);

    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.serviceType2Display());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1cFormatter.serviceType3)) {
      ctx.wizard.state.service_type_3 = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.yearOfConfirmationDisplay());
      return ctx.wizard.next();
    }
  }

  async yearOfConfirmation(ctx: any) {
    const message = ctx.message.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section1cFormatter.serviceType3Display());
      return ctx.wizard.back();
    }

    const validationMessage = postValidator('confirmation_year', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.confirmation_year = message;
    await ctx.reply(...section1cFormatter.bIDIOptionDisplay());
    return ctx.wizard.next();
  }

  // bi/di
  async IDFirstOption(ctx: any) {
    const message = ctx.message?.text;
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      if (message && areEqaul(message, 'back', true)) {
        ctx.reply(...section1cFormatter.yearOfConfirmationDisplay());
        return ctx.wizard.back();
      }
      return ctx.reply('Unknown option. Please use buttons to choose .');
    }
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.yearOfConfirmationDisplay());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1cFormatter.bIDiOption)) {
      ctx.wizard.state.id_first_option = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.lastDigitDisplay());
      return ctx.wizard.next();
    }
  }
  async enterLastDigit(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section1cFormatter.bIDIOptionDisplay());
      return ctx.wizard.back();
    }
    const validationMessage = postValidator('last_digit', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.last_digit = message;
    ctx.reply(...section1cFormatter.descriptionDisplay());
    return ctx.wizard.next();
  }

  async enterDescription(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section1cFormatter.lastDigitDisplay());
      return ctx.wizard.back();
    }

    // const validationMessage = questionPostValidator('description', message);
    // if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.description = message;
    ctx.reply(...section1cFormatter.photoDisplay());
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
      ctx.reply(...section1cFormatter.descriptionDisplay());
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section1cFormatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length == section1cFormatter.imagesNumber) {
      this.clearImageWaiting(sender.id);

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

      ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      ctx.reply(...section1cFormatter.previewCallToAction());
      return ctx.wizard.next();
    }
  }
  async preview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    const user = findSender(ctx);
    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...section1cFormatter.photoDisplay(), section1cFormatter.goBackButton());
        return ctx.wizard.back();
      }
      await ctx.reply('....');
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'preview_edit': {
          ctx.wizard.state.editField = null;
          await deleteMessageWithCallback(ctx);
          ctx.replyWithHTML(...section1cFormatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }

        case 'post_data': {
          const postDto: CreatePostService1CDto = {
            arbr_value: ctx.wizard.state.arbr_value as string,
            id_first_option: ctx.wizard.state.id_first_option as string,
            description: ctx.wizard.state.description as string,
            last_digit: Number(ctx.wizard.state.last_digit) as number,
            service_type_1: ctx.wizard.state.service_type_1 as string,
            service_type_2: ctx.wizard.state.service_type_2 as string,
            service_type_3: ctx.wizard.state.service_type_3 as string,
            paper_stamp: ctx.wizard.state.paper_stamp as string,
            confirmation_year: ctx.wizard.state.confirmation_year as string,
            photo: ctx.wizard.state.photo,
            city: ctx.wizard.state.city,
            notify_option: ctx.wizard.state.notify_option,
            category: 'Section 1C',
            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
          };
          const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);

          if (response?.success) {
            ctx.wizard.state.post_id = response?.data?.id;
            ctx.wizard.state.post_main_id = response?.data?.post_id;
            ctx.wizard.state.status = 'Pending';
            await displayDialog(ctx, section1cFormatter.messages.postSuccessMsg, true);
            await deleteMessageWithCallback(ctx);
            const elements = extractElements<string>(ctx.wizard.state.photo);
            const [caption, button] = section1cFormatter.preview(ctx.wizard.state, 'submitted');
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
            return ctx.wizard.selectStep(16);
          } else {
            ctx.reply(...section1cFormatter.postingError());
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
          await ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state, 'Cancelled'), {
            parse_mode: 'HTML',
          });
          return ctx.wizard.selectStep(16);
        }
        case 'notify_settings': {
          await deleteMessageWithCallback(ctx);
          await ctx.reply(...section1cFormatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
          return ctx.wizard.selectStep(17);
        }
        case 'mention_previous_post': {
          // fetch previous posts of the user
          const { posts, success, message } = await PostService.getUserPostsByTgId(user.id);
          if (!success || !posts) return await ctx.reply(message);

          if (posts.length == 0) return await ctx.reply(...section1cFormatter.noPostsErrorMessage());

          await deleteMessageWithCallback(ctx);
          await ctx.reply(...section1cFormatter.mentionPostMessage());
          for (const post of posts as any) {
            await ctx.reply(...section1cFormatter.displayPreviousPostsList(post));
          }
          return ctx.wizard.selectStep(18);
        }

        case 'remove_mention_previous_post': {
          state.mention_post_data = '';
          state.mention_post_id = '';

          await deleteMessageWithCallback(ctx);
          await ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        }
        case 'back': {
          await deleteMessageWithCallback(ctx);
          ctx.wizard.back();
          return await ctx.replyWithHTML(...section1cFormatter.preview(state), { parse_mode: 'HTML' });
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
      'paper_stamp',
      'arbr_value',
      'city',
      'service_type_1',
      'service_type_2',
      'service_type_3',
      'confirmation_year',
      'id_first_option',
      'last_digit',
      'description',
      'photo',
      'cancel',
    ];
    const callbackQuery = ctx?.callbackQuery;
    const editField = ctx.wizard.state?.editField;
    if (!callbackQuery) {
      // changing field value
      const messageText = ctx.message.text;
      if (!editField) return await ctx.reply(section1cFormatter.messages.invalidInput);

      if (areEqaul(messageText, 'back', true)) {
        ctx.wizard.state.editField = null;
        return ctx.replyWithHTML(...section1cFormatter.editPreview(state));
      }
      const validationMessage = postValidator(editField, messageText);
      if (validationMessage != 'valid') return await ctx.reply(validationMessage);

      ctx.wizard.state[editField] = messageText;
      await deleteKeyboardMarkup(ctx);
      return ctx.replyWithHTML(...section1cFormatter.editPreview(state), { parse_mode: 'HTML' });
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
      return ctx.replyWithHTML(...section1cFormatter.editPreview(state));
    }

    if (callbackMessage == 'editing_done' || callbackMessage == 'cancel_edit') {
      await deleteMessageWithCallback(ctx);
      await ctx.replyWithHTML(...section1cFormatter.preview(state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }
    if (callbackMessage == 'editing_done') {
      await deleteMessageWithCallback(ctx);
      await ctx.replyWithHTML(...section1cFormatter.preview(state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }

    if (fileds.some((filed) => filed == callbackQuery.data)) {
      // selecting field to change

      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );

      if (callbackMessage == 'city') {
        ctx.wizard.state.currentRound = 0;
        await ctx.reply(
          ...section1cFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound),
        );
        // jump to edit city
        return ctx.wizard.selectStep(15);
      }

      await ctx.replyWithHTML(...((await section1cFormatter.editFieldDispay(callbackMessage)) as any), {
        parse_mode: 'HTML',
      });
      if (areEqaul(callbackQuery.data, 'photo', true)) return ctx.wizard.selectStep(14);
      return;
    }

    if (editField) {
      //  if edit filed is selected

      ctx.wizard.state[editField] = callbackMessage;
      await deleteMessageWithCallback(ctx);
      return ctx.replyWithHTML(...section1cFormatter.editPreview(state), { parse_mode: 'HTML' });
    }
  }
  async editPhoto(ctx: any) {
    const sender = findSender(ctx);

    this.setImageWaiting(ctx);
    if (ctx.message.document) return ctx.reply(`Please only upload compressed images`);

    const messageText = ctx.message?.text;
    if (messageText && areEqaul(messageText, 'back', true)) {
      ctx.replyWithHTML(...section1cFormatter.editPreview(ctx.wizard.state));
      this.clearImageWaiting(sender.id);
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section1cFormatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length == section1cFormatter.imagesNumber) {
      this.clearImageWaiting(sender.id);
      await sendMediaGroup(ctx, imagesUploaded, 'Here are the images you uploaded');

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;

      // empty the images array
      // imagesUploaded.length = 0;
      ctx.replyWithHTML(...section1cFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }
  }
  async editCity(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(section1cFormatter.messages.useButtonError);

    deleteMessageWithCallback(ctx);
    switch (callbackQuery.data) {
      case 'back': {
        if (ctx.wizard.state.currentRound == 0) {
          await ctx.replyWithHTML(...section1cFormatter.editPreview(ctx.wizard.state));
          return ctx.wizard.selectStep(9);
        }
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
        return ctx.reply(
          ...section1cFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound),
        );
      }
      case 'next': {
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
        return ctx.reply(
          ...section1cFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound),
        );
      }

      default:
        ctx.wizard.state.currentRound = 0;
        ctx.wizard.state.city = callbackQuery.data;
        await ctx.replyWithHTML(...section1cFormatter.editPreview(ctx.wizard.state));
        return ctx.wizard.selectStep(9);
    }
  }
  async postedReview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return;
    switch (callbackQuery.data) {
      case 're_submit_post': {
        const postDto: CreatePostService1CDto = {
          arbr_value: ctx.wizard.state.arbr_value as string,
          id_first_option: ctx.wizard.state.id_first_option as string,
          description: ctx.wizard.state.description as string,
          last_digit: Number(ctx.wizard.state.last_digit) as number,
          service_type_1: ctx.wizard.state.service_type_1 as string,
          service_type_2: ctx.wizard.state.service_type_2 as string,
          service_type_3: ctx.wizard.state.service_type_3 as string,
          confirmation_year: ctx.wizard.state.confirmation_year as string,
          paper_stamp: ctx.wizard.state.paper_stamp as string,
          photo: ctx.wizard.state.photo,
          city: ctx.wizard.state.city,
          notify_option: ctx.wizard.state.notify_option,
          category: 'Section 1C',
          previous_post_id: ctx.wizard.state.mention_post_id || undefined,
        };
        const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);
        if (!response?.success) await ctx.reply(section1cFormatter.messages.resubmitError);
        ctx.wizard.state.post_id = response?.data?.id;
        ctx.wizard.state.post_main_id = response?.data?.post_id;
        ctx.wizard.state.status = 'Pending';
        await displayDialog(ctx, section1cFormatter.messages.postResubmit);

        return ctx.editMessageReplyMarkup({
          inline_keyboard: [
            [{ text: 'Cancel', callback_data: `cancel_post` }],
            [{ text: 'Main menu', callback_data: 'main_menu' }],
          ],
        });
      }
      case 'cancel_post': {
        const deleted = await PostService.deletePostById(ctx.wizard.state.post_main_id, 'Section 1C');
        if (!deleted) return await ctx.reply('Unable to cancel the post ');
        await displayDialog(ctx, section1cFormatter.messages.postCancelled);
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
      section1cFormatter.messages.notifySettingChanged.concat(` to  ${notify_option.toUpperCase()}`),
    );
    await deleteMessageWithCallback(ctx);
    await ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state));
    return ctx.wizard.selectStep(12);
  }
  async mentionPreviousPost(ctx: any) {
    const state = ctx.wizard.state;
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery) {
      if (areEqaul(callbackQuery.data, 'back', true)) {
        await deleteMessageWithCallback(ctx);

        await ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(12);
      }

      if (callbackQuery.data.startsWith('select_post_')) {
        const post_id = callbackQuery.data.split('_')[2];

        state.mention_post_id = post_id;
        state.mention_post_data = ctx.callbackQuery.message.text;
        await ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(12);
      }
    }
  }
}
export default QuestionPostSection1CController;
