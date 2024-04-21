import config from '../../../../config/config';
import {
  deleteKeyboardMarkup,
  deleteMessage,
  deleteMessageWithCallback,
  findSender,
  sendMediaGroup,
} from '../../../../utils/constants/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../../../utils/constants/string';

import Section1AFormatter from './section-a.formatter';
import QuestionService from '../../post.service';
import { questionPostValidator } from '../../../../utils/validator/question-post-validaor';
import MainMenuController from '../../../mainmenu/mainmenu.controller';
import ProfileService from '../../../profile/profile.service';
import { displayDialog } from '../../../../ui/dialog';
const section1AFormatter = new Section1AFormatter();

let imagesUploaded: any[] = [];
const imagesNumber = 4;

class QuestionPostSectionAController {
  constructor() {}

  async start(ctx: any) {
    deleteKeyboardMarkup(ctx, section1AFormatter.messages.arBrPromt);
    await ctx.reply(...section1AFormatter.arBrOptionDisplay());
    return ctx.wizard.next();
  }

  async arBrOption(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(section1AFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      return ctx.scene.enter('Post-Question-Section-1');
    }

    if (isInInlineOption(callbackQuery.data, section1AFormatter.arBrOption)) {
      ctx.wizard.state.ar_br = callbackQuery.data;
      ctx.wizard.state.category = 'Section 1A';
      deleteMessageWithCallback(ctx);
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
      ctx.wizard.state.bi_di = callbackQuery.data;
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

    // const validationMessage = questionPostValidator('last_digit', message);
    // if (validationMessage != 'valid') return await ctx.reply(validationMessage);
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

    const validationMessage = questionPostValidator('description', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.description = message;
    ctx.reply(...section1AFormatter.photoDisplay());
    return ctx.wizard.next();
  }
  async attachPhoto(ctx: any) {
    const sender = findSender(ctx);
    const message = ctx?.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section1AFormatter.bIDIOptionDisplay());
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section1AFormatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length == imagesNumber) {
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);
      // console.log(file);
      await sendMediaGroup(ctx, imagesUploaded, 'Here are the images you uploaded');

      const user = await new ProfileService().getProfileByTgId(sender.id);
      if (user) {
        ctx.wizard.state.user = {
          user_id: user.id,
          display_name: user.display_name,
        };
      }
      ctx.wizard.state.photo = imagesUploaded;
      ctx.wizard.state.status = 'previewing';

      // empty the images array
      imagesUploaded = [];
      ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      ctx.reply(...section1AFormatter.previewCallToAction());
      return ctx.wizard.next();
    }
  }
  async editPreview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

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
          ctx.reply(...section1AFormatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }

        case 'post_data': {
          const response = await QuestionService.createQuestionPost(ctx.wizard.state, callbackQuery.from.id);

          if (response?.success) {
            ctx.wizard.state.post_id = response?.data?.id;
            ctx.reply(...section1AFormatter.postingSuccessful());
            await deleteMessageWithCallback(ctx);
            await ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state, 'submitted'), {
              parse_mode: 'HTML',
            });
            await displayDialog(ctx, 'Posted succesfully');
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
        default: {
          await ctx.reply('DEFAULT');
        }
      }
    }
  }
  async editData(ctx: any) {
    const state = ctx.wizard.state;
    const fileds = ['ar_br', 'bi_di', 'woreda', 'last_digit', 'location', 'description', 'photo', 'cancel'];
    const callbackQuery = ctx?.callbackQuery;
    const editField = ctx.wizard.state?.editField;
    if (!callbackQuery) {
      // changing field value
      const messageText = ctx.message.text;
      if (!editField) return await ctx.reply('invalid input ');

      ctx.wizard.state[editField] = messageText;
      await deleteKeyboardMarkup(ctx);
      return ctx.reply(...section1AFormatter.editPreview(state), { parse_mode: 'HTML' });
    }

    // if callback exists
    // save the mesage id for later deleting
    ctx.wizard.state.previousMessageData = {
      message_id: ctx.callbackQuery.message.message_id,
      chat_id: ctx.callbackQuery.message.chat.id,
    };
    const callbackMessage = callbackQuery.data;

    if (callbackMessage == 'editing_done') {
      await deleteMessageWithCallback(ctx);
      await ctx.reply(...section1AFormatter.preview(state));
      return ctx.wizard.back();
    }

    if (fileds.some((filed) => filed == callbackQuery.data)) {
      // selecting field to change
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );
      await ctx.reply(...((await section1AFormatter.editFieldDispay(callbackMessage)) as any));
      if (areEqaul(callbackQuery.data, 'photo', true)) return ctx.wizard.next();
      return;
    }

    if (editField) {
      //  if edit filed is selected

      ctx.wizard.state[editField] = callbackMessage;
      await deleteMessageWithCallback(ctx);
      ctx.wizard.state.editField = null;
      return ctx.reply(...section1AFormatter.editPreview(state), { parse_mode: 'HTML' });
    }
  }
  async editPhoto(ctx: any) {
    const messageText = ctx.message?.text;
    if (messageText && areEqaul(messageText, 'back', true)) {
      await deleteMessage(ctx, {
        message_id: (parseInt(messageText.message_id) - 1).toString(),
        chat_id: messageText.chat.id,
      });
      ctx.reply(...section1AFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section1AFormatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length === imagesNumber) {
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);

      const mediaGroup = imagesUploaded.map((image: any) => ({
        media: image,
        type: 'photo',
        caption: image == imagesUploaded[0] ? 'Here are the images you uploaded' : '',
      }));

      await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;

      // empty the images array
      // imagesUploaded.length = 0;
      ctx.reply(...section1AFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }
  }
  async postedReview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return;
    switch (callbackQuery.data) {
      case "'re_submit_post": {
      }
      case 'cancel_post': {
        const deleted = await QuestionService.deletePostById(ctx.wizard.state.post_id);

        return ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state, 'submitted'), {
          parse_mode: 'HTML',
        });
      }
    }
    ctx.scene.leave();
    return MainMenuController.onStart(ctx);
  }
}

export default QuestionPostSectionAController;
