import {
  deleteKeyboardMarkup,
  deleteMessage,
  deleteMessageWithCallback,
  findSender,
  sendMediaGroup,
} from '../../../../utils/constants/chat';
import { areEqaul, isInInlineOption } from '../../../../utils/constants/string';

import PostSectionBFormatter from './section-b.formatter';
import QuestionService from '../../post.service';
import { questionPostValidator } from '../../../../utils/validator/question-post-validaor';
import MainMenuController from '../../../mainmenu/mainmenu.controller';
import { CreatePostService1ADto, CreatePostService1BDto } from '../../../../types/dto/create-question-post.dto';
import ProfileService from '../../../profile/profile.service';
import { displayDialog } from '../../../../ui/dialog';
import { parseDateString } from '../../../../utils/constants/date';
const postSectionBFormatter = new PostSectionBFormatter();

let imagesUploaded: any[] = [];
const imagesNumber = 4;

class QuestionPostSectionBController {
  constructor() {}

  async start(ctx: any) {
    await ctx.reply(...postSectionBFormatter.InsertTiteDisplay());
    return ctx.wizard.next();
  }
  async enterTitle(ctx: any) {
    const text = ctx.message.text;

    if (areEqaul(text, 'back', true)) return ctx.scene.enter('Post-Section-1');
    ctx.wizard.state.title = text;
    await deleteKeyboardMarkup(ctx, postSectionBFormatter.messages.categoriesPrompt);
    ctx.reply(...postSectionBFormatter.mainCategoryOption());

    return ctx.wizard.next();
  }
  async chooseMainCategory(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(postSectionBFormatter.messages.useButtonError);
    if (areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      await ctx.reply(...postSectionBFormatter.InsertTiteDisplay());
      return ctx.wizard.back();
    }
    ctx.wizard.state.main_category = callbackQuery.data;

    if (areEqaul(callbackQuery.data, 'main_10', true)) {
      ctx.wizard.state.sub_catagory = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...postSectionBFormatter.bIDIOptionDisplay());
      return ctx.wizard.selectStep(4); // jumping to step with step index(bi di selector(id first))
    }
    deleteMessageWithCallback(ctx);
    ctx.reply(...postSectionBFormatter.subCategoryOption(callbackQuery.data));
    return ctx.wizard.next();
  }
  async chooseSubCategory(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(postSectionBFormatter.messages.useButtonError);
    if (areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      await ctx.reply(...postSectionBFormatter.mainCategoryOption());
      return ctx.wizard.back();
    }
    ctx.wizard.state.sub_catagory = callbackQuery.data;
    deleteMessageWithCallback(ctx);
    ctx.reply(...postSectionBFormatter.bIDIOptionDisplay());
    return ctx.wizard.next();
  }
  async IDFirstOption(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(postSectionBFormatter.messages.useButtonError);

    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      const mainCategory = ctx.wizard.state.main_category;

      if (areEqaul(mainCategory, 'main_10', true)) {
        console.log('yeah equel  ');
        deleteMessageWithCallback(ctx);
        ctx.reply(...postSectionBFormatter.mainCategoryOption());
        return ctx.wizard.selectStep(2);
      } else {
        deleteMessageWithCallback(ctx);
        ctx.reply(...postSectionBFormatter.subCategoryOption(mainCategory));
        return ctx.wizard.back();
      }
    }

    if (isInInlineOption(callbackQuery.data, postSectionBFormatter.bIDiOption)) {
      ctx.wizard.state.bi_di = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...postSectionBFormatter.lastDidtitDisplay());
      return ctx.wizard.next();
    }
    ctx.reply('unkown option');
  }
  async enterLastDigit(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      await deleteKeyboardMarkup(ctx, postSectionBFormatter.messages.biDiPrompt);
      ctx.reply(...postSectionBFormatter.bIDIOptionDisplay());
      return ctx.wizard.back();
    }

    const validationMessage = questionPostValidator('last_digit', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.last_digit = message;
    const mainCategory = ctx.wizard.state.main_category;
    if (areEqaul(mainCategory, 'main_4', true)) {
      ctx.reply(...postSectionBFormatter.OpSeCondtionOptionDisplay());
      return ctx.wizard.selectStep(7);
    }

    await deleteKeyboardMarkup(ctx, postSectionBFormatter.messages.conditonPrompt);
    ctx.reply(...postSectionBFormatter.urgencyOptionDisplay());
    return ctx.wizard.next();
  }

  async urgencyCondtion(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(postSectionBFormatter.messages.useButtonError);
    if (areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      await ctx.reply(...postSectionBFormatter.lastDidtitDisplay());
      return ctx.wizard.back();
    }
    ctx.wizard.state.condition = callbackQuery.data;
    deleteMessageWithCallback(ctx);
    ctx.reply(...postSectionBFormatter.woredaListDisplay());
    return ctx.wizard.selectStep(11); // jumping to step with step index(jump to woreda selector)
  }
  async seOpCondition(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(postSectionBFormatter.messages.useButtonError);

    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...postSectionBFormatter.lastDidtitDisplay());
      return ctx.wizard.selectStep(5);
    }

    if (isInInlineOption(callbackQuery.data, postSectionBFormatter.OpSeOption)) {
      ctx.wizard.state.condition = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...postSectionBFormatter.dateOfIssue());
      return ctx.wizard.next();
    }
    ctx.reply('unkown option');
  }
  async enterDateofIssue(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      await deleteKeyboardMarkup(ctx, postSectionBFormatter.messages.dateOfIssuePrompt);
      ctx.reply(...postSectionBFormatter.OpSeCondtionOptionDisplay());
      return ctx.wizard.back();
    }

    const validationMessage = questionPostValidator('issue_date', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.date_of_issue = message;
    await ctx.reply(...postSectionBFormatter.dateOfExpire());
    return ctx.wizard.next();
  }
  async enterDateofExpire(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...postSectionBFormatter.dateOfIssue());
      return ctx.wizard.back();
    }

    // assign the location to the state
    const validationMessage = questionPostValidator('issue_date', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.date_of_expire = message;
    await ctx.reply(...postSectionBFormatter.originalLocation());
    return ctx.wizard.next();
  }
  async enterOriginlaLocation(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...postSectionBFormatter.dateOfExpire());
      return ctx.wizard.back();
    }

    // assign the location to the state
    ctx.wizard.state.location = message;
    await deleteKeyboardMarkup(ctx, postSectionBFormatter.messages.chooseWoredaPrompt);
    await ctx.reply(...postSectionBFormatter.woredaListDisplay());
    return ctx.wizard.next();
  }
  async choooseWoreda(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    const mainCategory = ctx.wizard.state.main_category;

    if (!callbackQuery) return ctx.reply(postSectionBFormatter.messages.useButtonError);

    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      if (!areEqaul(mainCategory, 'main_4', true)) {
        deleteMessageWithCallback(ctx);
        ctx.reply(...postSectionBFormatter.originalLocation());
        return ctx.wizard.back();
      }
      ctx.reply(...postSectionBFormatter.urgencyOptionDisplay());
      deleteMessageWithCallback(ctx);
      return ctx.wizard.selectStep(6); // go back to urgency
    }

    if (isInInlineOption(callbackQuery.data, postSectionBFormatter.woredaList)) {
      ctx.wizard.state.woreda = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...postSectionBFormatter.descriptionDisplay());
      return ctx.wizard.next();
    }
    return ctx.reply('Unknown option. Please choose a valid option.');
  }

  async enterDescription(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      await deleteKeyboardMarkup(ctx, postSectionBFormatter.messages.chooseWoredaPrompt);
      ctx.reply(...postSectionBFormatter.woredaListDisplay());
      return ctx.wizard.back();
    }

    const validationMessage = questionPostValidator('description', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.description = message;
    ctx.reply(...postSectionBFormatter.photoDisplay());
    return ctx.wizard.next();
  }
  async attachPhoto(ctx: any) {
    const sender = findSender(ctx);
    const message = ctx?.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...postSectionBFormatter.descriptionDisplay());
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...postSectionBFormatter.photoDisplay());

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
          id: user.id,
          display_name: user.display_name,
        };
      }
      ctx.wizard.state.photo = imagesUploaded;
      ctx.wizard.state.status = 'previewing';
      ctx.wizard.state.notify_option = 'none';
      // empty the images array
      imagesUploaded = [];

      console.log(ctx.wizard.state);
      ctx.replyWithHTML(...postSectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      ctx.reply(...postSectionBFormatter.previewCallToAction());
      return ctx.wizard.next();
    }
  }
  async editPreview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...postSectionBFormatter.photoDisplay(), postSectionBFormatter.goBackButton());
        return ctx.wizard.back();
      }
      await ctx.reply('....');
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'preview_edit': {
          ctx.wizard.state.editField = null;
          await deleteMessageWithCallback(ctx);
          ctx.reply(...postSectionBFormatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }

        case 'post_data': {
          const postDto: CreatePostService1BDto = {
            title: ctx.wizard.state.title as string,
            main_category: ctx.wizard.state.main_category as string,
            sub_category: ctx.wizard.state.sub_catagory as string,
            condition: ctx.wizard.state.condition as string,
            id_first_option: ctx.wizard.state.bi_di as string,
            issue_date: ctx.wizard.state.date_of_issue ? parseDateString(ctx.wizard.state.date_of_issue) : undefined,
            expire_date: ctx.wizard.state.date_of_expire ? parseDateString(ctx.wizard.state.date_of_expire) : undefined,
            description: ctx.wizard.state.description as string,
            last_digit: ctx.wizard.state.last_digit as string,
            location: ctx.wizard.state.location as string,
            photo: ctx.wizard.state.photo,
            woreda: ctx.wizard.state.woreda,
            notify_option: ctx.wizard.state.notify_option,
            category: 'Section 1B',
          };
          const response = await QuestionService.createCategoryPost(postDto, callbackQuery.from.id);

          if (response?.success) {
            ctx.wizard.state.post_id = response?.data?.id;
            ctx.wizard.state.post_main_id = response?.data?.post_id;
            ctx.wizard.state.status = 'Pending';
            ctx.reply(...postSectionBFormatter.postingSuccessful());
            await deleteMessageWithCallback(ctx);
            await ctx.replyWithHTML(...postSectionBFormatter.preview(ctx.wizard.state, 'submitted'), {
              parse_mode: 'HTML',
            });
            await displayDialog(ctx, 'Posted succesfully');
            return ctx.wizard.selectStep(17);
          } else {
            ctx.reply(...postSectionBFormatter.postingError());
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
          await ctx.replyWithHTML(...postSectionBFormatter.preview(ctx.wizard.state, 'Cancelled'), {
            parse_mode: 'HTML',
          });
          return ctx.wizard.selectStep(18);
        }
        case 'notify_settings': {
          await deleteMessageWithCallback(ctx);
          await ctx.reply(...postSectionBFormatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
          return ctx.wizard.selectStep(18);
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
      'title',
      'main_category',
      'sub_category',
      'condition',
      'bi_di',
      'woreda',
      'last_digit',
      'location',
      'description',
      'issue_date',
      'expire_date',
      'photo',
      'cancel',
    ];
    const callbackQuery = ctx?.callbackQuery;
    const editField = ctx.wizard.state?.editField;
    if (!callbackQuery) {
      // changing field value
      const messageText = ctx.message.text;
      if (!editField) return await ctx.reply('invalid input ');

      ctx.wizard.state[editField] = messageText;
      await deleteKeyboardMarkup(ctx);
      return ctx.replyWithHTML(...postSectionBFormatter.editPreview(state), { parse_mode: 'HTML' });
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
      await ctx.replyWithHTML(...postSectionBFormatter.preview(state));
      return ctx.wizard.back();
    }
    if (callbackMessage == 'editing_done') {
      await deleteMessageWithCallback(ctx);
      await ctx.replyWithHTML(...postSectionBFormatter.preview(state));
      return ctx.wizard.back();
    }

    if (fileds.some((filed) => filed == callbackQuery.data)) {
      // selecting field to change
      let extra = '';
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );
      switch (callbackQuery.data) {
        case 'condition':
          extra = ctx.wizard.state.condition;
          break;
        case 'sub_category':
          extra = ctx.wizard.state.condition;
          break;
      }
      await ctx.reply(...((await postSectionBFormatter.editFieldDispay(callbackMessage)) as any));
      if (areEqaul(callbackQuery.data, 'photo', true)) return ctx.wizard.next();
      return;
    }

    if (editField) {
      //  if edit filed is selected

      ctx.wizard.state[editField] = callbackMessage;
      await deleteMessageWithCallback(ctx);
      if (areEqaul(editField, 'main_category', true) && areEqaul(callbackMessage, 'main_10', true)) {
        ctx.wizard.state.editField = 'sub_category';
        return ctx.reply(...postSectionBFormatter.subCategoryOption(callbackMessage));
      }
      return ctx.replyWithHTML(...postSectionBFormatter.editPreview(state), { parse_mode: 'HTML' });
    }
  }
  async editPhoto(ctx: any) {
    const messageText = ctx.message?.text;
    if (messageText && areEqaul(messageText, 'back', true)) {
      await deleteMessage(ctx, {
        message_id: (parseInt(messageText.message_id) - 1).toString(),
        chat_id: messageText.chat.id,
      });
      ctx.reply(...postSectionBFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...postSectionBFormatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length === imagesNumber) {
      await ctx.telegram.sendMediaGroup(ctx.chat.id, 'Here are the images you uploaded');

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;

      // empty the images array
      // imagesUploaded.length = 0;
      ctx.reply(...postSectionBFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
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
          sub_category: ctx.wizard.state.sub_catagory as string,
          condition: ctx.wizard.state.condition as string,
          id_first_option: ctx.wizard.state.bi_di as string,
          issue_date: ctx.wizard.state.date_of_issue ? parseDateString(ctx.wizard.state.date_of_issue) : undefined,
          expire_date: ctx.wizard.state.date_of_expire ? parseDateString(ctx.wizard.state.date_of_expire) : undefined,
          description: ctx.wizard.state.description as string,
          last_digit: ctx.wizard.state.last_digit as string,
          location: ctx.wizard.state.location as string,
          photo: ctx.wizard.state.photo,
          woreda: ctx.wizard.state.woreda,
          notify_option: ctx.wizard.state.notify_option,
          category: 'Section 1B',
        };
        const response = await QuestionService.createCategoryPost(postDto, callbackQuery.from.id);
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
        const deleted = await QuestionService.deletePostById(ctx.wizard.state.post_main_id, 'Section 1B');
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
        await ctx.replyWithHTML(...postSectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(14);
      }
      case 'notify_friend': {
        ctx.wizard.state.notify_option = 'friend';
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...postSectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(14);
      }
      case 'notify_follower': {
        await deleteMessageWithCallback(ctx);
        ctx.wizard.state.notify_option = 'follower';
        await ctx.replyWithHTML(...postSectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(14);
      }
    }
  }
}

export default QuestionPostSectionBController;
