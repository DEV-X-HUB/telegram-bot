import config from '../../../../config/config';
import { displayDialog } from '../../../../ui/dialog';
import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback } from '../../../../utils/constants/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../../../utils/constants/string';

import ChickenFarmFormatter from './chicken-farm.formatter';
const chickenFarmFormatter = new ChickenFarmFormatter();

let imagesUploaded: any[] = [];
const imagesNumber = 1;

class ChickenFarmController {
  constructor() {}
  async start(ctx: any) {
    ctx.wizard.state.category = 'Chicken Farm';
    await deleteMessageWithCallback(ctx);
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

    ctx.wizard.state.description = message;
    ctx.wizard.state.status = 'preview';
    await ctx.reply(...chickenFarmFormatter.preview(ctx.wizard.state));
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
          await ctx.reply(chickenFarmFormatter.preview(state));
          return ctx.wizard.back();
        }

        case 'post_data': {
          console.log('here you are');
          // api request to post the data
          // const response = await QuestionService.createQuestionPost(ctx.wizard.state, callbackQuery.from.id);
          // console.log(response);

          // if (response?.success) {
          //   await deleteMessageWithCallback(ctx);
          await deleteMessageWithCallback(ctx);
          await displayDialog(ctx, 'Posted successfully');
          // await ctx.reply(...chickenFarmFormatter.postingSuccessful());
          await ctx.scene.leave();
          return ctx.scene.enter('start');
          // } else {
          //   ctx.reply(...postingFormatter.postingError());
          //   if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
          //     await deleteMessageWithCallback(ctx);
          //     return ctx.scene.enter('start');
          //   }

          // increment the registration attempt
          // return (ctx.wizard.state.postingAttempt = ctx.wizard.state.postingAttempt
          //   ? parseInt(ctx.wizard.state.postingAttempt) + 1
          //   : 1);
        }
      }
      // default: {
      //   await ctx.reply('DEFAULT');
      // }
    }
  }
}

export default ChickenFarmController;
