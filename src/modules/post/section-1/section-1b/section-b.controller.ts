import {
  deleteKeyboardMarkup,
  deleteMessage,
  deleteMessageWithCallback,
  findSender,
  replyPostPreview,
  sendMediaGroup,
} from '../../../../utils/helpers/chat';
import { areEqaul, extractElements, isInInlineOption } from '../../../../utils/helpers/string';

import SectionBFormatter from './section-b.formatter';
import { postValidator } from '../../../../utils/validator/post-validaor';
import MainMenuController from '../../../mainmenu/mainmenu.controller';
import { CreatePostService1BDto } from '../../../../types/dto/create-question-post.dto';
import ProfileService from '../../../profile/profile.service';
import { displayDialog } from '../../../../ui/dialog';
import { parseDateString } from '../../../../utils/helpers/date';
import PostService from '../../post.service';
import config from '../../../../config/config';
import RegistrationService from '../../../registration/restgration.service';
import { getCountryCodeByName } from '../../../../utils/helpers/country-list';
import { ImageCounter } from '../../../../types/params';

const registrationService = new RegistrationService();
const sectionBFormatter = new SectionBFormatter();
const profileService = new ProfileService();

let imagesUploaded: any[] = [];
class QuestionPostSectionBController {
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
    if (this.isWaitingImages(sender.id)) await displayDialog(ctx, sectionBFormatter.messages.imageWaitingMsg);
  }

  async start(ctx: any) {
    await ctx.reply(...sectionBFormatter.InsertTiteDisplay());
    return ctx.wizard.next();
  }
  async enterTitle(ctx: any) {
    const text = ctx.message.text;

    if (areEqaul(text, 'back', true)) return ctx.scene.enter('Post-Section-1');
    const validationMessage = postValidator('title', text);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.title = text;
    await deleteKeyboardMarkup(ctx, sectionBFormatter.messages.categoriesPrompt);
    ctx.reply(...sectionBFormatter.mainCategoryOption());

    return ctx.wizard.next();
  }
  async chooseMainCategory(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(sectionBFormatter.messages.useButtonError);
    if (areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      await ctx.reply(...sectionBFormatter.InsertTiteDisplay());
      return ctx.wizard.back();
    }
    ctx.wizard.state.main_category = callbackQuery.data;

    if (areEqaul(callbackQuery.data, 'main_10', true)) {
      ctx.wizard.state.sub_category = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...sectionBFormatter.bIDIOptionDisplay());
      return ctx.wizard.selectStep(4); // jumping to step with step index(bi di selector(id first))
    }
    deleteMessageWithCallback(ctx);
    ctx.reply(...sectionBFormatter.subCategoryOption(callbackQuery.data));
    return ctx.wizard.next();
  }
  async chooseSubCategory(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(sectionBFormatter.messages.useButtonError);
    if (areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      await ctx.reply(...sectionBFormatter.mainCategoryOption());
      return ctx.wizard.back();
    }
    ctx.wizard.state.sub_category = callbackQuery.data;
    deleteMessageWithCallback(ctx);
    ctx.reply(...sectionBFormatter.bIDIOptionDisplay());
    return ctx.wizard.next();
  }
  async IDFirstOption(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(sectionBFormatter.messages.useButtonError);

    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      const mainCategory = ctx.wizard.state.main_category;

      if (areEqaul(mainCategory, 'main_10', true)) {
        deleteMessageWithCallback(ctx);
        ctx.reply(...sectionBFormatter.mainCategoryOption());
        return ctx.wizard.selectStep(2);
      } else {
        deleteMessageWithCallback(ctx);
        ctx.reply(...sectionBFormatter.subCategoryOption(mainCategory));
        return ctx.wizard.back();
      }
    }

    if (isInInlineOption(callbackQuery.data, sectionBFormatter.bIDiOption)) {
      ctx.wizard.state.id_first_option = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...sectionBFormatter.lastDidtitDisplay());
      return ctx.wizard.next();
    }
    ctx.reply('unkown option');
  }
  async enterLastDigit(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      await deleteKeyboardMarkup(ctx, sectionBFormatter.messages.biDiPrompt);
      ctx.reply(...sectionBFormatter.bIDIOptionDisplay());
      return ctx.wizard.back();
    }

    const validationMessage = postValidator('last_digit', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.last_digit = message;
    const mainCategory = ctx.wizard.state.main_category;
    await deleteKeyboardMarkup(ctx, sectionBFormatter.messages.conditonPrompt);
    if (areEqaul(mainCategory, 'main_4', true)) {
      await ctx.reply(...sectionBFormatter.OpSeCondtionOptionDisplay());
      // jump to se op condtion
      return ctx.wizard.selectStep(7);
    }

    await ctx.reply(...sectionBFormatter.urgencyOptionDisplay());
    return ctx.wizard.next();
  }

  async urgencyCondtion(ctx: any) {
    const sender = findSender(ctx);
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(sectionBFormatter.messages.useButtonError);
    if (areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      await ctx.reply(...sectionBFormatter.lastDidtitDisplay());
      return ctx.wizard.back();
    }
    ctx.wizard.state.condition = callbackQuery.data;
    deleteMessageWithCallback(ctx);

    const userCountry = await registrationService.getUserCountry(sender.id);
    const countryCode = getCountryCodeByName(userCountry as string);

    ctx.wizard.state.currentRound = 0;
    ctx.wizard.state.countryCode = countryCode;

    ctx.reply(...(await sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, 0)));
    return ctx.wizard.selectStep(11); // jumping to step with step index(jump to city selector)
  }
  async seOpCondition(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(sectionBFormatter.messages.useButtonError);

    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...sectionBFormatter.lastDidtitDisplay());
      return ctx.wizard.selectStep(5);
    }

    if (isInInlineOption(callbackQuery.data, sectionBFormatter.OpSeOption)) {
      ctx.wizard.state.condition = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...sectionBFormatter.dateOfIssue());
      return ctx.wizard.next();
    }
    ctx.reply('unkown option');
  }
  async enterDateofIssue(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      await deleteKeyboardMarkup(ctx, sectionBFormatter.messages.dateOfIssuePrompt);
      ctx.reply(...sectionBFormatter.OpSeCondtionOptionDisplay());
      return ctx.wizard.back();
    }

    const validationMessage = postValidator('issue_date', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.issue_date = message;
    await ctx.reply(...sectionBFormatter.dateOfExpire());
    return ctx.wizard.next();
  }
  async enterDateofExpire(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...sectionBFormatter.dateOfIssue());
      return ctx.wizard.back();
    }

    // assign the location to the state
    const validationMessage = postValidator('expire_date', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.expire_date = message;
    await ctx.reply(...sectionBFormatter.originalLocation());
    return ctx.wizard.next();
  }
  async enterOriginlaLocation(ctx: any) {
    const sender = findSender(ctx);
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...sectionBFormatter.dateOfExpire());
      return ctx.wizard.back();
    }

    // assign the location to the state
    ctx.wizard.state.location = message;
    await deleteKeyboardMarkup(ctx, sectionBFormatter.messages.chooseCityPrompt);
    const userCountry = await registrationService.getUserCountry(sender.id);
    const countryCode = getCountryCodeByName(userCountry as string);

    ctx.wizard.state.currentRound = 0;
    ctx.wizard.state.countryCode = countryCode;

    ctx.reply(...sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, 0));
    return ctx.wizard.next();
  }

  async chooseCity(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(sectionBFormatter.messages.useButtonError);

    deleteMessageWithCallback(ctx);
    switch (callbackQuery.data) {
      case 'back': {
        if (ctx.wizard.state.currentRound == 0) {
          const mainCategory = ctx.wizard.state.main_category;
          if (areEqaul(mainCategory, 'main_4', true)) {
            await ctx.reply(...sectionBFormatter.originalLocation());
            return ctx.wizard.back();

            // jump
          }
          ctx.reply(...sectionBFormatter.urgencyOptionDisplay());
          return ctx.wizard.selectStep(6);
        }
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
        return ctx.reply(
          ...(await sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound)),
        );
      }
      case 'next': {
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
        return ctx.reply(
          ...(await sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound)),
        );
      }

      default:
        ctx.wizard.state.currentRound = 0;
        ctx.wizard.state.city = callbackQuery.data;
        await ctx.reply(...sectionBFormatter.descriptionDisplay());
        return ctx.wizard.next();
    }
  }

  async enterDescription(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      await deleteKeyboardMarkup(ctx, sectionBFormatter.messages.chooseCityPrompt);
      ctx.wizard.state.currentRound = 0;
      ctx.reply(...sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
      return ctx.wizard.back();
    }

    const validationMessage = postValidator('description', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.description = message;
    ctx.reply(...sectionBFormatter.photoDisplay());
    return ctx.wizard.next();
  }
  async attachPhoto(ctx: any) {
    const sender = findSender(ctx);
    const message = ctx?.message?.text;
    this.setImageWaiting(ctx);

    if (ctx?.message?.document) return ctx.reply(`Please only upload compressed images`);

    if (message && areEqaul(message, 'back', true)) {
      await ctx.reply(...sectionBFormatter.descriptionDisplay());
      this.clearImageWaiting(sender.id);
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...sectionBFormatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length == sectionBFormatter.imagesNumber) {
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

      ctx.replyWithHTML(...sectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      ctx.reply(...sectionBFormatter.previewCallToAction());
      return ctx.wizard.next();
    }
  }
  async preview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    const user = findSender(ctx);
    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...sectionBFormatter.photoDisplay(), sectionBFormatter.goBackButton());
        return ctx.wizard.back();
      }
      await ctx.reply('....');
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'preview_edit': {
          ctx.wizard.state.editField = null;
          await deleteMessageWithCallback(ctx);
          ctx.replyWithHTML(...sectionBFormatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }

        case 'post_data': {
          const postDto: CreatePostService1BDto = {
            title: ctx.wizard.state.title as string,
            main_category: ctx.wizard.state.main_category as string,
            sub_category: ctx.wizard.state.sub_category as string,
            condition: ctx.wizard.state.condition as string,
            id_first_option: ctx.wizard.state.id_first_option as string,
            issue_date: ctx.wizard.state.issue_date ? parseDateString(ctx.wizard.state.issue_date) : undefined,
            expire_date: ctx.wizard.state.expire_date ? parseDateString(ctx.wizard.state.expire_date) : undefined,
            description: ctx.wizard.state.description as string,
            last_digit: ctx.wizard.state.last_digit as string,
            location: ctx.wizard.state.location as string,
            photo: ctx.wizard.state.photo,
            city: ctx.wizard.state.city,
            notify_option: ctx.wizard.state.notify_option,
            category: 'Section 1B',
            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
          };
          const response = await PostService.createCategoryPost(postDto, user.id);

          if (response?.success) {
            ctx.wizard.state.post_id = response?.data?.id;
            ctx.wizard.state.post_main_id = response?.data?.post_id;
            ctx.wizard.state.status = 'Pending';

            await displayDialog(ctx, sectionBFormatter.messages.postSuccessMsg, true);

            await deleteMessageWithCallback(ctx);

            const elements = extractElements<string>(ctx.wizard.state.photo);
            const [caption, button] = sectionBFormatter.preview(ctx.wizard.state, 'submitted');
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
            // jump to post review
            return ctx.wizard.selectStep(18);
          } else {
            ctx.reply(...sectionBFormatter.postingError());
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
          await displayDialog(ctx, sectionBFormatter.messages.postCancelled);
          await ctx.replyWithHTML(...sectionBFormatter.preview(ctx.wizard.state, 'Cancelled'), {
            parse_mode: 'HTML',
          });

          // jump to post preview
          return ctx.wizard.selectStep(18);
        }
        case 'notify_settings': {
          await deleteMessageWithCallback(ctx);
          await ctx.reply(...sectionBFormatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
          return ctx.wizard.selectStep(19);
        }
        case 'mention_previous_post': {
          // fetch previous posts of the user
          const { posts, success, message } = await PostService.getUserPostsByTgId(user.id);
          if (!success || !posts) return await ctx.reply(message);

          if (posts.length == 0) return await ctx.reply(...sectionBFormatter.noPostsErrorMessage());

          await deleteMessageWithCallback(ctx);
          await ctx.reply(...sectionBFormatter.mentionPostMessage());
          for (const post of posts as any) {
            await ctx.reply(...sectionBFormatter.displayPreviousPostsList(post));
          }
          return ctx.wizard.selectStep(20);
        }

        case 'remove_mention_previous_post': {
          state.mention_post_data = '';
          state.mention_post_id = '';

          await deleteMessageWithCallback(ctx);
          await ctx.replyWithHTML(...sectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        }
        case 'back': {
          await deleteMessageWithCallback(ctx);
          ctx.wizard.back();
          return await ctx.replyWithHTML(...sectionBFormatter.preview(state), { parse_mode: 'HTML' });
        }
        default: {
          await ctx.reply(sectionBFormatter.messages.invalidDateErrorPrompt);
        }
      }
    }
  }
  async editData(ctx: any) {
    const fileds = [
      'title',
      'main_category',
      'sub_category',
      'condition',
      'id_first_option',
      'city',
      'last_digit',
      'location',
      'description',
      'issue_date',
      'expire_date',
      'photo',
      'cancel',
    ];
    const state = ctx.wizard.state;
    const callbackQuery = ctx?.callbackQuery;
    const editField = ctx.wizard.state?.editField;

    if (!callbackQuery) {
      // changing field value
      const messageText = ctx.message.text;
      if (!editField) return await ctx.reply('invalid input ');

      if (areEqaul(messageText, 'back', true)) {
        ctx.wizard.state.editField = null;
        return ctx.replyWithHTML(...sectionBFormatter.editPreview(state));
      }
      // validate data
      const validationMessage = postValidator(editField, messageText);
      if (validationMessage != 'valid') return await ctx.reply(validationMessage);

      ctx.wizard.state[editField] = messageText;
      await deleteKeyboardMarkup(ctx);
      return ctx.replyWithHTML(...sectionBFormatter.editPreview(state), { parse_mode: 'HTML' });
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
      return ctx.replyWithHTML(...sectionBFormatter.editPreview(state));
    }
    if (callbackMessage == 'editing_done' || callbackMessage == 'cancel_edit') {
      await deleteMessageWithCallback(ctx);
      await ctx.replyWithHTML(...sectionBFormatter.preview(state));
      return ctx.wizard.back();
    }
    if (callbackMessage == 'editing_done') {
      await deleteMessageWithCallback(ctx);
      await ctx.replyWithHTML(...sectionBFormatter.preview(state));
      return ctx.wizard.back();
    }

    if (fileds.some((filed) => filed == callbackMessage)) {
      // selecting field to change
      let extra = '';
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );
      switch (callbackMessage) {
        case 'condition':
          extra = ctx.wizard.state.condition;
          break;
        case 'sub_category':
          extra = ctx.wizard.state.condition;
          break;
      }

      if (callbackMessage == 'city') {
        ctx.wizard.state.currentRound = 0;
        await ctx.reply(
          ...sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound),
        );
        // jump to edit city
        return ctx.wizard.selectStep(17);
      }

      await ctx.replyWithHTML(...((await sectionBFormatter.editFieldDispay(callbackMessage, state.condition)) as any), {
        parse_mode: 'HTML',
      });
      if (areEqaul(callbackMessage, 'photo', true)) return ctx.wizard.selectStep(16);

      return;
    }

    if (editField) {
      //  if edit filed is selected
      ctx.wizard.state[editField] = callbackMessage;
      await deleteMessageWithCallback(ctx);
      if (areEqaul(editField, 'main_category', true) && !areEqaul(callbackMessage, 'main_10', true)) {
        ctx.wizard.state.editField = 'sub_category';
        return ctx.reply(...sectionBFormatter.subCategoryOption(callbackMessage));
      }
      return ctx.replyWithHTML(...sectionBFormatter.editPreview(state), { parse_mode: 'HTML' });
    }
  }
  async editPhoto(ctx: any) {
    const sender = findSender(ctx);
    const messageText = ctx.message?.text;
    this.setImageWaiting(ctx);

    if (ctx?.message?.document) return ctx.reply(`Please only upload compressed images`);

    if (messageText && areEqaul(messageText, 'back', true)) {
      ctx.replyWithHTML(...sectionBFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      this.clearImageWaiting(sender.id);
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...sectionBFormatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length == sectionBFormatter.imagesNumber) {
      this.clearImageWaiting(sender.id);

      await sendMediaGroup(ctx, imagesUploaded, 'Here are the images you uploaded');

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;

      // empty the images array
      // imagesUploaded.length = 0;
      ctx.replyWithHTML(...sectionBFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }
  }

  async editCity(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(sectionBFormatter.messages.useButtonError);

    deleteMessageWithCallback(ctx);
    switch (callbackQuery.data) {
      case 'back': {
        if (ctx.wizard.state.currentRound == 0) {
          await ctx.replyWithHTML(...sectionBFormatter.editPreview(ctx.wizard.state));
          return ctx.wizard.selectStep(14);
        }
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
        return ctx.reply(
          ...sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound),
        );
      }
      case 'next': {
        ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
        return ctx.reply(
          ...sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound),
        );
      }

      default:
        ctx.wizard.state.currentRound = 0;
        ctx.wizard.state.city = callbackQuery.data;
        await ctx.replyWithHTML(...sectionBFormatter.editPreview(ctx.wizard.state));
        return ctx.wizard.selectStep(14);
    }
  }
  async postedReview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return;
    switch (callbackQuery.data) {
      case 're_submit_post': {
        const postDto: CreatePostService1BDto = {
          title: ctx.wizard.state.title as string,
          main_category: ctx.wizard.state.main_category as string,
          sub_category: ctx.wizard.state.sub_category as string,
          condition: ctx.wizard.state.condition as string,
          id_first_option: ctx.wizard.state.id_first_option as string,
          issue_date: ctx.wizard.state.issue_date ? parseDateString(ctx.wizard.state.issue_date) : undefined,
          expire_date: ctx.wizard.state.expire_date ? parseDateString(ctx.wizard.state.expire_date) : undefined,
          description: ctx.wizard.state.description as string,
          last_digit: ctx.wizard.state.last_digit as string,
          location: ctx.wizard.state.location as string,
          photo: ctx.wizard.state.photo,
          city: ctx.wizard.state.city,
          notify_option: ctx.wizard.state.notify_option,
          category: 'Section 1B',
          previous_post_id: ctx.wizard.state.mention_post_id || undefined,
        };
        const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);
        if (!response?.success) await ctx.reply(sectionBFormatter.messages.resubmitError);

        ctx.wizard.state.post_id = response?.data?.id;
        ctx.wizard.state.post_main_id = response?.data?.post_id;
        ctx.wizard.state.status = 'Pending';
        await displayDialog(ctx, sectionBFormatter.messages.postResubmit);

        return ctx.editMessageReplyMarkup({
          inline_keyboard: [
            [{ text: 'Cancel', callback_data: `cancel_post` }],
            [{ text: 'Main menu', callback_data: 'main_menu' }],
          ],
        });
      }
      case 'cancel_post': {
        const deleted = await PostService.deletePostById(ctx.wizard.state.post_main_id, 'Section 1B');
        if (!deleted) return await ctx.reply(sectionBFormatter.messages.deletePostErrorMsg);

        await displayDialog(ctx, sectionBFormatter.messages.postCancelled);

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
    if (!callbackQuery) return await ctx.reply(sectionBFormatter.messages.useButtonError);
    switch (callbackQuery.data) {
      case 'notify_none': {
        console.log('NONE');
        ctx.wizard.state.notify_option = 'none';
        await deleteMessageWithCallback(ctx);

        await displayDialog(ctx, sectionBFormatter.messages.notifySettingChanged);
        await ctx.replyWithHTML(...sectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(14);
      }
      case 'notify_friend': {
        ctx.wizard.state.notify_option = 'friend';
        await deleteMessageWithCallback(ctx);

        await displayDialog(ctx, sectionBFormatter.messages.notifySettingChanged);
        await ctx.replyWithHTML(...sectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(14);
      }
      case 'notify_follower': {
        await deleteMessageWithCallback(ctx);
        ctx.wizard.state.notify_option = 'follower';

        await displayDialog(ctx, sectionBFormatter.messages.notifySettingChanged);
        await ctx.replyWithHTML(...sectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(14);
      }
    }
  }
  async mentionPreviousPost(ctx: any) {
    const state = ctx.wizard.state;
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery) {
      if (areEqaul(callbackQuery.data, 'back', true)) {
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...sectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(14);
      }

      if (callbackQuery.data.startsWith('select_post_')) {
        const post_id = callbackQuery.data.split('_')[2];

        state.mention_post_id = post_id;
        state.mention_post_data = ctx.callbackQuery.message.text;

        await ctx.replyWithHTML(...sectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(14);
      }
    }
  }
}

export default QuestionPostSectionBController;
