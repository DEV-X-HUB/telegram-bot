import {
  deleteKeyboardMarkup,
  deleteMessage,
  deleteMessageWithCallback,
  findSender,
} from '../../../../utils/helpers/chat';
import { areEqaul, isInInlineOption } from '../../../../utils/helpers/string';

import QuestionPostSectionConstructionFormmater from './construction.formatter';
import QuestionService from '../../post.service';
import { postValidator } from '../../../../utils/validator/post-validaor';
import { displayDialog } from '../../../../ui/dialog';
import MainMenuController from '../../../mainmenu/mainmenu.controller';
import Section4ConstructionService from './construction.service';
import ConstructionFormatter from './construction.formatter';
import PostService from '../../post.service';
import {
  CreatePostService4ChickenFarmDto,
  CreatePostService4ConstructionDto,
  CreatePostService4ManufactureDto,
} from '../../../../types/dto/create-question-post.dto';
import ProfileService from '../../../profile/profile.service';
const constructionFormatter = new ConstructionFormatter();

const profileService = new ProfileService();

let imagesUploaded: any[] = [];
const imagesNumber = 4;

class QuestionPostSectionConstructionController {
  constructor() {}

  async start(ctx: any) {
    await ctx.reply(...constructionFormatter.chooseSizeDisplay());
    return ctx.wizard.next();
  }
  async chooseConstructionSize(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(constructionFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) return ctx.scene.enter('Post-Question-Section-4');

    if (!isInInlineOption(callbackQuery.data, constructionFormatter.sizeOption))
      return ctx.reply(...constructionFormatter.messages.unknowOptionError);

    ctx.wizard.state.category = 'Construction';
    ctx.wizard.state.size = callbackQuery.data;
    await deleteMessageWithCallback(ctx);

    if (areEqaul(ctx.wizard.state.size, 'big', true)) {
      ctx.reply(...constructionFormatter.landSizeDisplay());
      return ctx.wizard.selectStep(4); // jump to 5'th controller (land size)
    }
    ctx.reply(...constructionFormatter.companyExpienceDisplay());
    return ctx.wizard.next();
  }

  async chooseCompanyExpience(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(constructionFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) {
      await deleteMessageWithCallback(ctx);
      await ctx.reply(...constructionFormatter.chooseSizeDisplay());
      return ctx.wizard.back();
    }

    if (!isInInlineOption(callbackQuery.data, constructionFormatter.companyExperienceOption))
      return ctx.reply(...constructionFormatter.messages.unknowOptionError);

    ctx.wizard.state.company_experience = callbackQuery.data;
    await deleteMessageWithCallback(ctx);
    ctx.reply(...constructionFormatter.documentRequestDisplay());
    return ctx.wizard.next();
  }
  async chooseDocumentRequestType(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(constructionFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) {
      await deleteMessageWithCallback(ctx);
      await ctx.reply(...constructionFormatter.companyExpienceDisplay());
      return ctx.wizard.back();
    }

    if (!isInInlineOption(callbackQuery.data, constructionFormatter.documentRequestOption))
      return ctx.reply(...constructionFormatter.messages.unknowOptionError);

    ctx.wizard.state.document_request_type = callbackQuery.data;
    await deleteMessageWithCallback(ctx);
    ctx.reply(...constructionFormatter.locationDisplay());
    return ctx.wizard.selectStep(6); // jump to 7'th controller (location)
  }
  async chooseLandSize(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(constructionFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) {
      await deleteMessageWithCallback(ctx);
      await ctx.reply(...constructionFormatter.chooseSizeDisplay());
      return ctx.wizard.selectStep(1); // jump  to first controller(size option)
    }

    if (!isInInlineOption(callbackQuery.data, constructionFormatter.landSizeOption))
      return ctx.reply(...constructionFormatter.messages.unknowOptionError);

    ctx.wizard.state.land_size = callbackQuery.data;
    await deleteMessageWithCallback(ctx);
    ctx.reply(...constructionFormatter.landStatusDisplay());
    return ctx.wizard.next();
  }
  async chooseLandStatus(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(constructionFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) {
      await deleteMessageWithCallback(ctx);
      await ctx.reply(...constructionFormatter.landSizeDisplay());
      return ctx.wizard.back();
    }

    if (!isInInlineOption(callbackQuery.data, constructionFormatter.landStatusOption))
      return ctx.reply(...constructionFormatter.messages.unknowOptionError);

    ctx.wizard.state.land_status = callbackQuery.data;
    await deleteMessageWithCallback(ctx);
    ctx.reply(...constructionFormatter.locationDisplay());
    return ctx.wizard.next(); // jump back to second controller
  }

  async enterLocation(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      if (areEqaul(ctx.wizard.state.size, 'small', true)) {
        await deleteKeyboardMarkup(ctx, constructionFormatter.messages.documentRequestTypePrompt);
        ctx.reply(...constructionFormatter.documentRequestDisplay());
        return ctx.wizard.selectStep(3); // jump to 4'th controller (document request type)
      }
      await deleteKeyboardMarkup(ctx, constructionFormatter.messages.landStatusPrompt);
      ctx.reply(...constructionFormatter.documentRequestDisplay());
      return ctx.wizard.back(); // jump to 4'th controller (document request type)
    }

    // assign the location to the state
    ctx.wizard.state.location = message;
    await ctx.reply(...constructionFormatter.descriptionDisplay());
    return ctx.wizard.next();
  }

  async enterDescription(ctx: any) {
    const sender = findSender(ctx);
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...constructionFormatter.locationDisplay());
      return ctx.wizard.back();
    }
    const validationMessage = postValidator('description', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);

    const user = await profileService.getProfileByTgId(sender.id);
    if (user) {
      ctx.wizard.state.user = {
        id: user.id,
        display_name: user.display_name,
      };
    }
    if (!user) return await ctx.reply(...constructionFormatter.somethingWentWrongError());

    ctx.wizard.state.user = {
      id: user?.id,
      display_name: user?.display_name,
    };

    ctx.wizard.state.description = message;
    ctx.wizard.state.status = 'preview';
    ctx.wizard.state.notify_option = user?.notify_option || 'none';

    if (areEqaul(ctx.wizard.state.size, 'small', true)) {
      deleteKeyboardMarkup(ctx);
      ctx.replyWithHTML(...constructionFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      ctx.reply(...constructionFormatter.previewCallToAction());
      return ctx.wizard.selectStep(9); // jump to 10'th controller
    }
    ctx.reply(...constructionFormatter.photoDisplay());
    return ctx.wizard.next();
  }
  async attachPhoto(ctx: any) {
    const message = ctx?.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...constructionFormatter.descriptionDisplay());
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...constructionFormatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length == imagesNumber) {
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);
      // console.log(file);

      const mediaGroup = imagesUploaded.map((image: any) => ({
        media: image,
        type: 'photo',
        caption: image == imagesUploaded[0] ? 'Here are the images you uploaded' : '',
      }));

      await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;
      ctx.wizard.state.status = 'previewing';

      // empty the images array
      imagesUploaded = [];
      deleteKeyboardMarkup(ctx);
      ctx.replyWithHTML(...constructionFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      ctx.reply(...constructionFormatter.previewCallToAction());
      return ctx.wizard.next();
    }
  }
  async preview(ctx: any) {
    const user = findSender(ctx);
    const callbackQuery = ctx.callbackQuery;
    console.log(callbackQuery.data);
    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...constructionFormatter.photoDisplay(), constructionFormatter.goBackButton());
        return ctx.wizard.back();
      }
      await ctx.reply('....');
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'preview_edit': {
          ctx.wizard.state.editField = null;
          await deleteMessageWithCallback(ctx);
          ctx.replyWithHTML(...constructionFormatter.editPreview(state));
          // jump to edit data
          return ctx.wizard.selectStep(10);
        }

        case 'post_data': {
          console.log('here you are');

          // api request to post the data
          const postDto: CreatePostService4ConstructionDto = {
            construction_size: ctx.wizard.state.size,
            company_experience: ctx.wizard.state.company_experience,
            document_request_type: ctx.wizard.state.document_request_type,
            land_size: ctx.wizard.state.land_size,
            land_status: ctx.wizard.state.land_status,
            location: ctx.wizard.state.location,
            photo: ctx.wizard.state.photo,
            description: ctx.wizard.state.description,
            category: ctx.wizard.state.category,
            notify_option: ctx.wizard.state.notify_option,
            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
          };
          const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);
          console.log(response);
          // console.log(response);
          // ctx.reply(...constructionFormatter.postingSuccessful());

          if (response?.success) {
            ctx.wizard.state.post_id = response?.data?.id;
            ctx.wizard.state.post_main_id = response?.data?.post_id;
            console.log('Posting successful');
            await ctx.reply(...constructionFormatter.postingSuccessful());
            await deleteMessageWithCallback(ctx);
            await ctx.replyWithHTML(...constructionFormatter.preview(ctx.wizard.state, 'submitted'), {
              parse_mode: 'HTML',
            });
            await displayDialog(ctx, constructionFormatter.messages.postSuccessMsg);

            // jump to posted review
            return ctx.wizard.selectStep(12);
          } else {
            ctx.reply(...constructionFormatter.postingError());
            return MainMenuController.onStart(ctx);
            if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
              await deleteMessageWithCallback(ctx);
              ctx.scene.leave();
              return MainMenuController.onStart(ctx);
            }
          }
          //   ctx.reply(...constructionFormatter.postingSuccessful());
          // ctx.scene.leave();
          // return MainMenuController.onStart(ctx);
          // } else {
          //   ctx.reply(...constructionFormatter.postingError());
          //   if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
          //     await deleteMessageWithCallback(ctx);
          //       ctx.scene.leave();
          // return MainMenuController.onStart(ctx);
          //   }

          // increment the registration attempt
          // return (ctx.wizard.state.postingAttempt = ctx.wizard.state.postingAttempt
          //   ? parseInt(ctx.wizard.state.postingAttempt) + 1
          //   : 1);
        }

        case 'notify_settings': {
          await deleteMessageWithCallback(ctx);
          await ctx.reply(...constructionFormatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
          // jump to notify setting
          return ctx.wizard.selectStep(13);
        }

        case 'mention_previous_post': {
          console.log('mention_previous_post1');
          await ctx.reply('mention_previous_post');
          // fetch previous posts of the user
          const { posts, success, message } = await PostService.getUserPostsByTgId(user.id);
          if (!success || !posts) {
            // remove past post
            await deleteMessageWithCallback(ctx);
            return await ctx.reply(message);
          }
          if (posts.length == 0) {
            await deleteMessageWithCallback(ctx);
            return await ctx.reply(...constructionFormatter.noPostsErrorMessage());
          }

          await deleteMessageWithCallback(ctx);
          await ctx.reply(...constructionFormatter.mentionPostMessage());
          for (const post of posts as any) {
            await ctx.reply(...constructionFormatter.displayPreviousPostsList(post));
          }

          // jump to mention previous post
          return ctx.wizard.selectStep(14);
        }

        case 'remove_mention_previous_post': {
          state.mention_post_data = '';
          state.mention_post_id = '';
          await deleteMessageWithCallback(ctx);
          return ctx.replyWithHTML(...constructionFormatter.preview(state));
        }

        case 'editing_done': {
          await deleteMessageWithCallback(ctx);
          await ctx.replyWithHTML(...constructionFormatter.preview(state));
          // return to preview
          return ctx.wizard.selectStep(9);
        }

        case 'cancel': {
          await deleteMessageWithCallback(ctx);
          ctx.scene.leave();
          return MainMenuController.onStart(ctx);
        }

        default: {
          await ctx.reply('DEFAULT');
        }
      }
    }
  }

  async mentionPreviousPost(ctx: any) {
    const state = ctx.wizard.state;
    console.log(state);
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery) {
      if (areEqaul(callbackQuery.data, 'back', true)) {
        await ctx.replyWithHTML(...constructionFormatter.preview(ctx.wizard.state));
        return ctx.wizard.back();
      }

      if (callbackQuery.data.startsWith('select_post_')) {
        const post_id = callbackQuery.data.split('_')[2];

        state.mention_post_id = post_id;
        state.mention_post_data = ctx.callbackQuery.message.text;
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...constructionFormatter.preview(state));
        // go back to preview
        return ctx.wizard.selectStep(9);
      }
    }
  }

  async editData(ctx: any) {
    const state = ctx.wizard.state;
    const fileds = [
      'document_request_type',
      'company_experience',
      'land_size',
      'land_status',
      'location',
      'description',
      'photo',
    ];
    const callbackQuery = ctx?.callbackQuery;
    const editField = ctx.wizard.state?.editField;
    if (!callbackQuery) {
      const messageText = ctx.message.text;
      if (!editField) return await ctx.reply('invalid input ');

      // changing field value
      ctx.wizard.state[editField] = messageText;
      await deleteKeyboardMarkup(ctx);
      return ctx.replyWithHTML(...constructionFormatter.editPreview(state), { parse_mode: 'HTML' });
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
      await ctx.replyWithHTML(...constructionFormatter.preview(state));
      // jump to preview
      return ctx.wizard.selectStep(9);
    }

    if (fileds.some((filed) => filed == callbackQuery.data)) {
      // selecting field to change
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );
      await ctx.reply(...((await constructionFormatter.editFieldDispay(callbackMessage)) as any));
      if (areEqaul(callbackQuery.data, 'photo', true)) return ctx.wizard.next();
      return;
    }

    if (editField) {
      //  if edit filed is selected change field valued
      ctx.wizard.state[editField] = callbackMessage;
      await deleteMessageWithCallback(ctx);
      ctx.wizard.state.editField = null;
      return ctx.replyWithHTML(...constructionFormatter.editPreview(state), { parse_mode: 'HTML' });
    }
  }
  async editPhoto(ctx: any) {
    const messageText = ctx.message?.text;
    if (messageText && areEqaul(messageText, 'back', true)) {
      await deleteMessage(ctx, {
        message_id: (parseInt(messageText.message_id) - 1).toString(),
        chat_id: messageText.chat.id,
      });
      ctx.replyWithHTML(...constructionFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...constructionFormatter.photoDisplay());

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
      ctx.replyWithHTML(...constructionFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }
  }

  async postedReview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return;
    switch (callbackQuery.data) {
      case 're_submit_post': {
        const postDto: CreatePostService4ConstructionDto = {
          construction_size: ctx.wizard.state.size,
          company_experience: ctx.wizard.state.company_experience,
          document_request_type: ctx.wizard.state.document_request_type,
          land_size: ctx.wizard.state.land_size,
          land_status: ctx.wizard.state.land_status,
          location: ctx.wizard.state.location,
          photo: ctx.wizard.state.photo,
          description: ctx.wizard.state.description,
          category: 'Section4Construction',
          notify_option: ctx.wizard.state.notify_option,
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
        await ctx.replyWithHTML(...constructionFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        // jump to preview
        return ctx.wizard.selectStep(9);
      }
      case 'notify_friend': {
        ctx.wizard.state.notify_option = 'friend';
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...constructionFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        // jump to preview
        return ctx.wizard.selectStep(9);
      }
      case 'notify_follower': {
        await deleteMessageWithCallback(ctx);
        ctx.wizard.state.notify_option = 'follower';
        await ctx.replyWithHTML(...constructionFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        // jump to preview
        return ctx.wizard.selectStep(9);
      }
    }
  }
}

export default QuestionPostSectionConstructionController;
