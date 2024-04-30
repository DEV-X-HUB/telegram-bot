import { CreatePostService1CDto } from '../../../../types/dto/create-question-post.dto';
import { displayDialog } from '../../../../ui/dialog';
import {
  deleteKeyboardMarkup,
  deleteMessage,
  deleteMessageWithCallback,
  findSender,
  sendMediaGroup,
} from '../../../../utils/constants/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../../../utils/constants/string';
import { postValidator } from '../../../../utils/validator/question-post-validaor';
import MainMenuController from '../../../mainmenu/mainmenu.controller';
import ProfileService from '../../../profile/profile.service';
import PostService from '../../post.service';

import QuestionPostSection1CFormatter from './section1c.formatter';

const section1cFormatter = new QuestionPostSection1CFormatter();
const profileService = new ProfileService();

let imagesUploaded: any[] = [];
const imagesNumber = 4;

class QuestionPostSection1CController {
  constructor() {}

  async start(ctx: any) {
    ctx.wizard.state.category = 'Section1c';

    await deleteKeyboardMarkup(ctx, 'Please Choose Paper Stamp');
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
        return ctx.scene.enter('Post-Question-Section-1');
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
    const message = ctx?.message?.text;
    const callbackQuery = ctx?.callbackQuery;

    if (!callbackQuery) {
      if (message && areEqaul(message, 'back', true)) {
        ctx.reply(...section1cFormatter.choosePaperStampDisplay());
        return ctx.wizard.back();
      }
    }
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.choosePaperStampDisplay());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1cFormatter.arBrOption)) {
      ctx.wizard.state.arbr_value = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      // await deleteMessage(ctx, {
      //   message_id: (parseInt(callbackQuery.message.message_id) - 1).toString(),
      //   chat_id: callbackQuery.message.chat.id,
      // });
      ctx.reply(...section1cFormatter.woredaListDisplay());
      return ctx.wizard.next();
    }
    return ctx.reply('Unknown option. Please choose a valid option.');
  }
  async choooseWoreda(ctx: any) {
    const message = ctx.message?.text;
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      if (message && areEqaul(message, 'back', true)) {
        ctx.reply(...section1cFormatter.arBrOptionDisplay());
        return ctx.wizard.back();
      }
    }
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.arBrOptionDisplay());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1cFormatter.woredaList)) {
      ctx.wizard.state.woreda = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.serviceType1Display());
      return ctx.wizard.next();
    }
    return ctx.reply('Unknown option. Please choose a valid option.');
  }

  async chooseServiceType1(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.woredaListDisplay());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1cFormatter.serviceType1)) {
      ctx.wizard.state.service_type_1 = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.serviceType2Display());
      return ctx.wizard.next();
    }
  }

  async chooseServiceType2(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
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
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section1cFormatter.descriptionDisplay());
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section1cFormatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length == imagesNumber) {
      //   const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);

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
            last_digit: ctx.wizard.state.last_digit as string,
            service_type_1: ctx.wizard.state.service_type_1 as string,
            service_type_2: ctx.wizard.state.service_type_2 as string,
            service_type_3: ctx.wizard.state.service_type_3 as string,
            paper_stamp: ctx.wizard.state.paper_stamp as string,
            confirmation_year: ctx.wizard.state.confirmation_year as string,
            photo: ctx.wizard.state.photo,
            woreda: ctx.wizard.state.woreda,
            notify_option: ctx.wizard.state.notify_option,
            category: 'Section 1C',
            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
          };
          const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);

          if (response?.success) {
            ctx.wizard.state.post_id = response?.data?.id;
            ctx.wizard.state.post_main_id = response?.data?.post_id;
            ctx.wizard.state.status = 'Pending';
            ctx.reply(...section1cFormatter.postingSuccessful());
            await deleteMessageWithCallback(ctx);
            await ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state, 'submitted'), {
              parse_mode: 'HTML',
            });
            await displayDialog(ctx, 'Posted succesfully');
            return ctx.wizard.selectStep(15);
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
          return ctx.wizard.selectStep(15);
        }
        case 'notify_settings': {
          await deleteMessageWithCallback(ctx);
          await ctx.reply(...section1cFormatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
          return ctx.wizard.selectStep(16);
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
          return ctx.wizard.selectStep(17);
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
      'woreda',
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
      if (!editField) return await ctx.reply('invalid input ');

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

      await ctx.replyWithHTML(...((await section1cFormatter.editFieldDispay(callbackMessage)) as any), {
        parse_mode: 'HTML',
      });
      if (areEqaul(callbackQuery.data, 'photo', true)) return ctx.wizard.next();
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
    const messageText = ctx.message?.text;
    if (messageText && areEqaul(messageText, 'back', true)) {
      await deleteMessage(ctx, {
        message_id: (parseInt(messageText.message_id) - 1).toString(),
        chat_id: messageText.chat.id,
      });
      ctx.replyWithHTML(...section1cFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section1cFormatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length === imagesNumber) {
      await ctx.telegram.sendMediaGroup(ctx.chat.id, 'Here are the images you uploaded');

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;

      // empty the images array
      // imagesUploaded.length = 0;
      ctx.replyWithHTML(...section1cFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
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
          last_digit: ctx.wizard.state.last_digit as string,
          service_type_1: ctx.wizard.state.service_type_1 as string,
          service_type_2: ctx.wizard.state.service_type_2 as string,
          service_type_3: ctx.wizard.state.service_type_3 as string,
          confirmation_year: ctx.wizard.state.confirmation_year as string,
          paper_stamp: ctx.wizard.state.paper_stamp as string,
          photo: ctx.wizard.state.photo,
          woreda: ctx.wizard.state.woreda,
          notify_option: ctx.wizard.state.notify_option,
          category: 'Section 1C',
          previous_post_id: ctx.wizard.state.mention_post_id || undefined,
        };
        const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);
        if (!response?.success) await ctx.reply('Unable to resubmite');

        ctx.wizard.state.post_id = response?.data?.id;
        ctx.wizard.state.post_main_id = response?.data?.post_id;
        ctx.wizard.state.status = 'Pending';
        await ctx.reply('Resubmiited');
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
        await ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(12);
      }
      case 'notify_friend': {
        ctx.wizard.state.notify_option = 'friend';
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(12);
      }
      case 'notify_follower': {
        await deleteMessageWithCallback(ctx);
        ctx.wizard.state.notify_option = 'follower';
        await ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(12);
      }
    }
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
