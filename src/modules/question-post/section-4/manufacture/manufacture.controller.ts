import config from '../../../../config/config';
import { displayDialog } from '../../../../ui/dialog';
import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback } from '../../../../utils/constants/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../../../utils/constants/string';

import ManufactureFormatter from './manufacture.formatter';
const manufactureFormatter = new ManufactureFormatter();

let imagesUploaded: any[] = [];
const imagesNumber = 4;

class ManufactureController {
  constructor() {}
  async start(ctx: any) {
    ctx.wizard.state.category = 'Chicken Farm';
    await deleteMessageWithCallback(ctx);
    await ctx.reply(...manufactureFormatter.sectorPrompt());
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
    await ctx.reply(...manufactureFormatter.numberOfWorkerPrompt());
    return ctx.wizard.next();
  }

  async chooseNumberOfWorker(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (callbackQuery) {
      if (areEqaul(callbackQuery.data, 'back', true)) {
        await ctx.reply(...manufactureFormatter.sectorPrompt());
        return ctx.wizard.back();
      }

      if (isInInlineOption(callbackQuery.data, manufactureFormatter.numberOfWorkerOption)) {
        ctx.wizard.state.number_of_worker = callbackQuery.data;
        await deleteMessageWithCallback(ctx);
        await ctx.reply(...manufactureFormatter.estimatedCapitalPrompt());
        return ctx.wizard.next();
      }
    } else {
      await ctx.reply(...manufactureFormatter.inputError());
    }
  }

  async chooseEstimatedCapital(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (callbackQuery) {
      if (areEqaul(callbackQuery.data, 'back', true)) {
        await ctx.reply(...manufactureFormatter.numberOfWorkerPrompt());
        return ctx.wizard.back();
      }

      if (isInInlineOption(callbackQuery.data, manufactureFormatter.estimatedCapitalOption)) {
        ctx.wizard.state.estimated_capital = callbackQuery.data;
        await deleteMessageWithCallback(ctx);
        await ctx.reply(...manufactureFormatter.enterpriseNamePrompt());
        return ctx.wizard.next();
      }
    } else {
      await ctx.reply(...manufactureFormatter.inputError());
    }
  }

  async enterEnterpriseName(ctx: any) {
    const message = ctx.message.text;
    if (message && areEqaul(message, 'back', true)) {
      await ctx.reply(...manufactureFormatter.estimatedCapitalPrompt());
      return ctx.wizard.back();
    }

    ctx.wizard.state.enterprise_name = message;
    await ctx.reply(...manufactureFormatter.descriptionPrompt());
    return ctx.wizard.next();
  }

  async enterDescription(ctx: any) {
    const message = ctx.message.text;
    if (message && areEqaul(message, 'back', true)) {
      await ctx.reply(...manufactureFormatter.enterpriseNamePrompt());
      return ctx.wizard.back();
    }

    ctx.wizard.state.description = message;

    await ctx.reply(...manufactureFormatter.photoPrompt());
    return ctx.wizard.next();
  }
}

export default ManufactureController;
