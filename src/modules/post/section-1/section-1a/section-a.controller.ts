import config from '../../../../config/config';
import {
  deleteKeyboardMarkup,
  deleteMessage,
  deleteMessageWithCallback,
  findSender,
  sendMediaGroup,
} from '../../../../utils/helpers/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../../../utils/helpers/string';

import Section1AFormatter from './section-a.formatter';
import { postValidator } from '../../../../utils/validator/post-validaor';
import MainMenuController from '../../../mainmenu/mainmenu.controller';
import ProfileService from '../../../profile/profile.service';
import { displayDialog } from '../../../../ui/dialog';
import { CreatePostService1ADto } from '../../../../types/dto/create-question-post.dto';
import PostService from '../../post.service';

const section1AFormatter = new Section1AFormatter();
const profileService = new ProfileService();

let imagesUploaded: any[] = [];
const imagesNumber = 4;

class QuestionPostSectionAController {
  constructor() {}

  async start(ctx: any) {
    await deleteKeyboardMarkup(ctx, section1AFormatter.messages.arBrPromt);
    await ctx.reply(...section1AFormatter.arBrOptionDisplay());
    return ctx.wizard.next();
  }

  async arBrOption(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(section1AFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) {
      await deleteMessageWithCallback(ctx);
      return ctx.scene.enter('Post-Section-1');
    }

    if (isInInlineOption(callbackQuery.data, section1AFormatter.arBrOption)) {
      ctx.wizard.state.arbr_value = callbackQuery.data;
      ctx.wizard.state.category = 'Section 1A';
      await deleteMessageWithCallback(ctx);
      ctx.reply(...section1AFormatter.woredaListDisplay());
      return ctx.wizard.next();
    }
    return ctx.reply('Unknown option. Please choose a valid option.');
  }
  async choooseWoreda(ctx: any) {
    const message = ctx.message?.text;
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      if (message && areEqaul(message, 'back', true)) {
        ctx.reply(...section1AFormatter.arBrOptionDisplay());
        return ctx.wizard.back();
      }
    }
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1AFormatter.arBrOptionDisplay());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1AFormatter.woredaList)) {
      ctx.wizard.state.woreda = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1AFormatter.bIDIOptionDisplay());
      return ctx.wizard.next();
    }
    return ctx.reply('Unknown option. Please choose a valid option.');
  }
  async IDFirstOption(ctx: any) {
    const message = ctx.message?.text;
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      if (message && areEqaul(message, 'back', true)) {
        ctx.reply(...section1AFormatter.woredaListDisplay());
        return ctx.wizard.back();
      }
      return ctx.reply('Unknown option. Please use buttons to choose .');
    }
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1AFormatter.woredaListDisplay());
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
    console.log(validationMessage);
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
    if (ctx.message.document) return ctx.reply(`Please only upload compressed images`);
    let timer = setTimeout(
      () => {
        ctx.reply(`Waiting for ${imagesNumber} photos `);
      },
      parseInt(config.image_upload_minute.toString()) * 60 * 1000,
    );

    const sender = findSender(ctx);
    const message = ctx?.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section1AFormatter.descriptionDisplay());
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section1AFormatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length == imagesNumber) {
      clearTimeout(timer);
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
      ctx.wizard.state.status = 'previewing';
      ctx.wizard.state.notify_option = user?.notify_option || 'none';
      // empty the images array
      imagesUploaded = [];
      ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state));
      ctx.reply(...section1AFormatter.previewCallToAction());
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
          const postDto: CreatePostService1ADto = {
            id_first_option: ctx.wizard.state.id_first_option as string,
            arbr_value: ctx.wizard.state.arbr_value as string,
            description: ctx.wizard.state.description as string,
            last_digit: ctx.wizard.state.last_digit as string,
            location: ctx.wizard.state.location as string,
            photo: ctx.wizard.state.photo,
            woreda: ctx.wizard.state.woreda,
            notify_option: ctx.wizard.state.notify_option,

            category: 'Section 1A',
            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
          };
          const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);

          if (response?.success) {
            console.log(response.data);
            ctx.wizard.state.post_id = response?.data?.id;
            ctx.wizard.state.post_main_id = response?.data?.post_id;
            await displayDialog(ctx, section1AFormatter.messages.postSuccessMsg);
            ctx.reply(...section1AFormatter.postingSuccessful());
            await deleteMessageWithCallback(ctx);
            await ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state, 'submitted'));
            return ctx.wizard.selectStep(11);
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
          return ctx.wizard.selectStep(18);
        }
        case 'notify_settings': {
          await deleteMessageWithCallback(ctx);
          await ctx.reply(...section1AFormatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
          return ctx.wizard.selectStep(12);
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
          return ctx.wizard.selectStep(13);
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
      'woreda',
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
      await ctx.replyWithHTML(...((await section1AFormatter.editFieldDispay(callbackMessage)) as any));
      if (areEqaul(callbackQuery.data, 'photo', true)) return ctx.wizard.next();
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
    if (ctx.message.document) return ctx.reply(`Please only upload compressed images`);
    let timer = setTimeout(
      () => {
        ctx.reply(`Waiting for ${imagesNumber} photos `);
      },
      parseInt(config.image_upload_minute.toString()) * 60 * 1000,
    );

    const messageText = ctx.message?.text;
    if (messageText && areEqaul(messageText, 'back', true)) {
      await deleteMessage(ctx, {
        message_id: (parseInt(messageText.message_id) - 1).toString(),
        chat_id: messageText.chat.id,
      });
      ctx.replyWithHTML(...section1AFormatter.editPreview(ctx.wizard.state));
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section1AFormatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length === imagesNumber) {
      clearTimeout(timer);
      await ctx.telegram.sendMediaGroup(ctx.chat.id, 'Here are the images you uploaded');

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;

      // empty the images array
      // imagesUploaded.length = 0;
      ctx.replyWithHTML(...section1AFormatter.editPreview(ctx.wizard.state));
      return ctx.wizard.back();
    }
  }
  async postReview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return;
    switch (callbackQuery.data) {
      case 're_submit_post': {
        const postDto: CreatePostService1ADto = {
          id_first_option: ctx.wizard.state.id_first_option as string,
          arbr_value: ctx.wizard.state.arbr_value as string,
          description: ctx.wizard.state.description as string,
          last_digit: ctx.wizard.state.last_digit as string,
          location: ctx.wizard.state.location as string,
          notify_option: ctx.wizard.state.notify_option,
          photo: ctx.wizard.state.photo,
          woreda: ctx.wizard.state.woreda,
          category: 'Section 1A',
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
        const deleted = await PostService.deletePostById(ctx.wizard.state.post_main_id, 'Section 1A');

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
        await ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state));
        return ctx.wizard.selectStep(8);
      }
      case 'notify_friend': {
        ctx.wizard.state.notify_option = 'friend';
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state));
        return ctx.wizard.selectStep(8);
      }
      case 'notify_follower': {
        await deleteMessageWithCallback(ctx);
        ctx.wizard.state.notify_option = 'follower';
        await ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state));
        return ctx.wizard.selectStep(8);
      }
    }
  }
  async mentionPreviousPost(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return;
    console.log(ctx.wizard.state, 'sdfdsafasdf');
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
