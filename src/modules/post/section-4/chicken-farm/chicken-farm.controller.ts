import config from '../../../../config/config';
import { CreatePostService4ChickenFarmDto } from '../../../../types/dto/create-question-post.dto';
import { displayDialog } from '../../../../ui/dialog';
import {
  deleteKeyboardMarkup,
  deleteMessage,
  deleteMessageWithCallback,
  findSender,
} from '../../../../utils/helpers/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../../../utils/helpers/string';
import { postValidator } from '../../../../utils/validator/post-validaor';
import MainMenuController from '../../../mainmenu/mainmenu.controller';
import ProfileService from '../../../profile/profile.service';
import PostService from '../../post.service';

import ChickenFarmFormatter from './chicken-farm.formatter';
import Section4ChickenFarmService from './chicken-farm.service';
const postService = new PostService();
const chickenFarmFormatter = new ChickenFarmFormatter();
const profileService = new ProfileService();

class ChickenFarmController {
  constructor() {}
  async start(ctx: any) {
    ctx.wizard.state.category = 'Chicken Farm';

    await ctx.reply(...chickenFarmFormatter.sectorPrompt());
    return ctx.wizard.next();
  }

  async enterSector(ctx: any) {
    const message = ctx.message.text;
    if (message && areEqaul(message, 'back', true)) {
      await deleteKeyboardMarkup(ctx);
      return ctx.scene.leave();
    }

    ctx.wizard.state.sector = message;
    await deleteKeyboardMarkup(ctx, 'What is the estimated capital?');
    await ctx.reply(...chickenFarmFormatter.estimatedCapitalPrompt());
    return ctx.wizard.next();
  }

  async chooseEstimatedCapital(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (callbackQuery) {
      if (areEqaul(callbackQuery.data, 'back', true)) {
        await ctx.reply(...chickenFarmFormatter.sectorPrompt());
        return ctx.wizard.back();
      }

      if (isInInlineOption(callbackQuery.data, chickenFarmFormatter.estimatedCapitalOption)) {
        ctx.wizard.state.estimated_capital = callbackQuery.data;
        await deleteMessageWithCallback(ctx);
        await ctx.reply(...chickenFarmFormatter.enterpriseNamePrompt());
        return ctx.wizard.next();
      }
    } else {
      await ctx.reply(...chickenFarmFormatter.inputError());
    }
  }

  async enterEnterpriseName(ctx: any) {
    const message = ctx.message.text;
    if (message && areEqaul(message, 'back', true)) {
      await ctx.reply(...chickenFarmFormatter.estimatedCapitalPrompt());
      return ctx.wizard.back();
    }

    ctx.wizard.state.enterprise_name = message;
    await ctx.reply(...chickenFarmFormatter.descriptionPrompt());
    return ctx.wizard.next();
  }

  async enterDescription(ctx: any) {
    const sender = findSender(ctx);
    const message = ctx.message.text;
    if (message && areEqaul(message, 'back', true)) {
      await ctx.reply(...chickenFarmFormatter.enterpriseNamePrompt());
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
    if (!user) return await ctx.reply(...chickenFarmFormatter.somethingWentWrongError());

    ctx.wizard.state.user = {
      id: user?.id,
      display_name: user?.display_name,
    };

    ctx.wizard.state.description = message;
    ctx.wizard.state.status = 'preview';
    ctx.wizard.state.notify_option = user?.notify_option || 'none';

    await ctx.replyWithHTML(...chickenFarmFormatter.preview(ctx.wizard.state));
    return ctx.wizard.next();
  }

  async preview(ctx: any) {
    const user = findSender(ctx);
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...chickenFarmFormatter.descriptionPrompt(), chickenFarmFormatter.goBackButton());
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
          ctx.replyWithHTML(...chickenFarmFormatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.selectStep(7);
        }

        case 'editing_done': {
          await deleteMessageWithCallback(ctx);
          await ctx.replyWithHTML(chickenFarmFormatter.preview(state));
          return ctx.wizard.selectStep(5);
        }

        case 'post_data': {
          const postDto: CreatePostService4ChickenFarmDto = {
            category: ctx.wizard.state.category as string,
            sector: ctx.wizard.state.sector as string,
            estimated_capital: ctx.wizard.state.estimated_capital as string,
            enterprise_name: ctx.wizard.state.enterprise_name as string,
            description: ctx.wizard.state.description as string,
            notify_option: ctx.wizard.state.notify_option,
            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
          };
          const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);

          if (response?.success) {
            ctx.wizard.state.post_id = response?.data?.id;
            ctx.wizard.state.post_main_id = response?.data?.post_id;
            // await deleteMessageWithCallback(ctx);

            await ctx.reply(...chickenFarmFormatter.postingSuccessful());
            await deleteMessageWithCallback(ctx);
            await ctx.replyWithHTML(...chickenFarmFormatter.preview(ctx.wizard.state, 'submitted'), {
              parse_mode: 'HTML',
            });
            await displayDialog(ctx, 'Posted succesfully');

            return ctx.wizard.selectStep(8);

            // return MainMenuController.onStart(ctx);
          } else {
            ctx.reply(...chickenFarmFormatter.postingError());
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
        // default: {
        //   await ctx.reply('DEFAULT');
        // }

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
            return await ctx.reply(...chickenFarmFormatter.noPostsErrorMessage());
          }

          await deleteMessageWithCallback(ctx);
          await ctx.reply(...chickenFarmFormatter.mentionPostMessage());
          for (const post of posts as any) {
            await ctx.reply(...chickenFarmFormatter.displayPreviousPostsList(post));
          }

          return ctx.wizard.next();
        }

        case 'remove_mention_previous_post': {
          state.mention_post_data = '';
          state.mention_post_id = '';
          await deleteMessageWithCallback(ctx);
          return ctx.replyWithHTML(...chickenFarmFormatter.preview(state));
        }

        case 'notify_settings': {
          await deleteMessageWithCallback(ctx);
          await ctx.reply(...chickenFarmFormatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
          return ctx.wizard.selectStep(9);
        }

        case 'back': {
          await deleteMessageWithCallback(ctx);
          ctx.wizard.back();
          return await ctx.replyWithHTML(...chickenFarmFormatter.preview(state));
        }
      }
    }
  }

  async mentionPreviousPost(ctx: any) {
    const state = ctx.wizard.state;
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery) {
      if (areEqaul(callbackQuery.data, 'back', true)) {
        await ctx.replyWithHTML(...chickenFarmFormatter.preview(ctx.wizard.state));
        return ctx.wizard.back();
      }

      if (callbackQuery.data.startsWith('select_post_')) {
        const post_id = callbackQuery.data.split('_')[2];

        state.mention_post_id = post_id;
        state.mention_post_data = ctx.callbackQuery.message.text;
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...chickenFarmFormatter.preview(state));
        return ctx.wizard.back();
      }
    }
  }

  async editData(ctx: any) {
    const state = ctx.wizard.state;
    const fileds = ['sector', 'estimated_capital', 'enterprise_name', 'description', 'cancel', 'done'];
    const callbackQuery = ctx?.callbackQuery;
    const editField = ctx.wizard.state?.editField;
    if (!callbackQuery) {
      // changing field value
      const messageText = ctx.message.text;
      if (!editField) return await ctx.reply('invalid input ');

      // const validationMessage = questionPostValidator(ctx.wizard.state.editField, ctx.message.text);
      // if (validationMessage != 'valid') return await ctx.reply(validationMessage);

      ctx.wizard.state[editField] = messageText;
      await deleteKeyboardMarkup(ctx);
      // await deleteMessage(ctx, {
      //   message_id: (parseInt(ctx.message.message_id) - 1).toString(),
      //   chat_id: ctx.message.chat.id,
      // });
      return ctx.replyWithHTML(...chickenFarmFormatter.editPreview(state), { parse_mode: 'HTML' });
    }

    // if callback exists
    // save the mesage id for later deleting
    ctx.wizard.state.previousMessageData = {
      message_id: ctx.callbackQuery.message.message_id,
      chat_id: ctx.callbackQuery.message.chat.id,
    };
    const callbackMessage = callbackQuery.data;

    if (callbackMessage == 'post_data') {
      // console.log('Posted Successfully');
      // await displayDialog(ctx, 'Posted successfully');
      // ctx.scene.leave();
      // return MainMenuController.onStart(ctx);
      // return ctx.reply(...chickenFarmFormatter.postingSuccessful());
      // registration
      // api call for registration
      const response = await Section4ChickenFarmService.createChickenFarmPost(ctx.wizard.state, callbackQuery.from.id);

      if (response.success) {
        ctx.wizard.state.status = 'pending';

        await ctx.reply(...chickenFarmFormatter.postingSuccessful());
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...chickenFarmFormatter.preview(ctx.wizard.state, 'submitted'), {
          parse_mode: 'HTML',
        });
        await displayDialog(ctx, 'Posted succesfully');

        // jump to posted review
        return ctx.wizard.selectStep(8);
      }

      const registrationAttempt = parseInt(ctx.wizard.state.registrationAttempt);

      // ctx.reply(...postingFormatter.postingError());
      if (registrationAttempt >= 2) {
        await deleteMessageWithCallback(ctx);
        ctx.scene.leave();
        return MainMenuController.onStart(ctx);
      }
      return (ctx.wizard.state.registrationAttempt = registrationAttempt ? registrationAttempt + 1 : 1);
    } else if (callbackMessage == 'editing_done') {
      await deleteMessageWithCallback(ctx);

      await ctx.replyWithHTML(...chickenFarmFormatter.preview(state));

      return ctx.wizard.selectStep(5);
    }

    // else if (callbackMessage =='mention_previous_post'){
    //   // fetch previous posts
    //   const posts = await Section4ChickenFarmService.getPostsOfUser(callbackQuery.from.id)
    // }
    else if (callbackMessage == 'mention_previous_post') {
      console.log('mention_previous_post2');
      await ctx.reply('mention_previous_post');
      // fetch previous posts of the user
      const posts = await Section4ChickenFarmService.getPostsOfUser(callbackQuery.from.id);
      console.log(posts.posts);

      // if (!posts) {
      //   return await ctx.reply(chickenFarmFormatter.noPostsErrorMessage);
      // }

      // await ctx.reply(...chickenFarmFormatter.mentionPostMessage());
      // return await ctx.reply(...chickenFarmFormatter.displayPreviousPostsList(posts.posts));
    }

    // if user chooses a field to edit
    if (fileds.some((filed) => filed == callbackQuery.data)) {
      // selecting field to change
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );
      await ctx.replyWithHTML(...((await chickenFarmFormatter.editFieldDisplay(callbackMessage)) as any));
      return;
    }
  }

  async postedReview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return;
    switch (callbackQuery.data) {
      case 're_submit_post': {
        const postDto: CreatePostService4ChickenFarmDto = {
          category: ctx.wizard.state.category as string,
          sector: ctx.wizard.state.sector as string,
          estimated_capital: ctx.wizard.state.estimated_capital as string,
          enterprise_name: ctx.wizard.state.enterprise_name as string,
          description: ctx.wizard.state.description as string,
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
        console.log(`deleted  ${deleted}`);

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
        await ctx.replyWithHTML(...chickenFarmFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(5);
      }
      case 'notify_friend': {
        ctx.wizard.state.notify_option = 'friend';
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...chickenFarmFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(5);
      }
      case 'notify_follower': {
        await deleteMessageWithCallback(ctx);
        ctx.wizard.state.notify_option = 'follower';
        await ctx.replyWithHTML(...chickenFarmFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        return ctx.wizard.selectStep(5);
      }
    }
  }
}

export default ChickenFarmController;
