import config from '../../../../config/config';
import { displayDialog } from '../../../../ui/dialog';
import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback } from '../../../../utils/constants/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../../../utils/constants/string';
import MainMenuController from '../../../mainmenu/mainmenu.controller';

import ChickenFarmFormatter from './chicken-farm.formatter';
import Section4ChickenFarmService from './chicken-farm.service';
const chickenFarmFormatter = new ChickenFarmFormatter();

let imagesUploaded: any[] = [];
const imagesNumber = 1;

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
    const message = ctx.message.text;
    if (message && areEqaul(message, 'back', true)) {
      await ctx.reply(...chickenFarmFormatter.enterpriseNamePrompt());
      return ctx.wizard.back();
    }

    const user = await Section4ChickenFarmService.findUserWithTgId(ctx.from.id);
    if (!user) return await ctx.reply(...chickenFarmFormatter.somethingWentWrongError());

    ctx.wizard.state.user = {
      id: user.user?.id,
      display_name: user.user?.display_name,
    };

    ctx.wizard.state.description = message;
    ctx.wizard.state.status = 'preview';

    await ctx.replyWithHTML(...chickenFarmFormatter.preview(ctx.wizard.state));
    return ctx.wizard.next();
  }

  async preview(ctx: any) {
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
          ctx.reply(...chickenFarmFormatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }

        case 'editing_done': {
          // await deleteMessageWithCallback(ctx);
          await ctx.replyWithHTML(chickenFarmFormatter.preview(state));
          return ctx.wizard.back();
        }

        case 'post_data': {
          console.log('here you are');
          // api request to post the data
          const response = await Section4ChickenFarmService.createChickenFarmPost(
            {
              sector: state.sector,
              estimated_capital: state.estimated_capital,
              enterprise_name: state.enterprise_name,
              description: state.description,
              category: state.category,
              notify_option: state.notify_option,
            },
            callbackQuery.from.id,
          );
          console.log(response);

          if (response?.success) {
            // await deleteMessageWithCallback(ctx);
            await deleteMessageWithCallback(ctx);

            await ctx.reply(...chickenFarmFormatter.postingSuccessful());
            await ctx.scene.leave();

            return MainMenuController.onStart(ctx);
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
          const posts = await Section4ChickenFarmService.getPostsOfUser(callbackQuery.from.id);

          if (!posts.posts || posts.posts.length == 0) {
            // remove past post
            await deleteMessageWithCallback(ctx);

            return await ctx.reply(...chickenFarmFormatter.noPostsErrorMessage());
          }

          await ctx.reply(...chickenFarmFormatter.mentionPostMessage());
          for (const post of posts.posts as any) {
            await ctx.reply(...chickenFarmFormatter.displayPreviousPostsList(post));
          }

          await ctx.reply(...chickenFarmFormatter.displayPreviousPostsList(posts.posts));
          return ctx.wizard.next();
        }

        case 'remove_mention_previous_post': {
          state.mention_post_data = '';
          state.mention_post_id = '';
          await deleteMessageWithCallback(ctx);
          return ctx.replyWithHTMLs(...chickenFarmFormatter.preview(state));
        }
        case 'back': {
          await deleteMessageWithCallback(ctx);
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
        console.log(ctx);

        const post_id = callbackQuery.data.split('_')[2];

        // get the telegram message id of the post
        const messageTgId = callbackQuery.message.message_id;

        console.log(ctx);
        console.log(`the message ${ctx.message}`);

        state.mention_post_id = post_id;

        // obtain the message using the tg message id

        // const messageData = await ctx.telegram.getMessage(ctx.chat.id, messageTgId);
        state.mention_post_data = 'messageData';

        // send message in reply to the post
        // await ctx.telegram.sendMessage(ctx.chat.id, ...chickenFarmFormatter.preview(state), {
        //   reply_to_message_id: messageTgId,
        // });
        // await ctx.telegram.sendMessage(ctx.chat.id, "Reply....", {
        //   reply_to_message_id: messageTgId,
        // });

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
      ctx.scene.leave();
      // return MainMenuController.onStart(ctx);
      // return ctx.reply(...chickenFarmFormatter.postingSuccessful());
      // registration
      // api call for registration
      const response = await Section4ChickenFarmService.createChickenFarmPost(ctx.wizard.state, callbackQuery.from.id);

      if (response.success) {
        ctx.wizard.state.status = 'pending';
        await deleteMessageWithCallback(ctx);
        await ctx.reply(...chickenFarmFormatter.postingSuccessful());
        ctx.scene.leave();
        return MainMenuController.onStart(ctx);
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
      // await deleteMessageWithCallback(ctx);

      await ctx.replyWithHTML(...chickenFarmFormatter.preview(state));

      return ctx.wizard.back();
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
}

export default ChickenFarmController;
