import RegistrationFormatter from '../modules/registration/registration-formatter';
import RegistrationService from '../modules/registration/restgration.service';
import { Context } from 'telegraf';
import { checkQueries } from './check-callback';
import MainMenuController from '../modules/mainmenu/mainmenu.controller';
import { capitalize } from '../utils/helpers/string';
import { findSender } from '../utils/helpers/chat';
// Middleware (Validator) to check if the user entered a command in the wizard scene
export function checkCommandInWizardScene(ctx: any, errorMsg?: string): boolean {
  // if the user enters a command(starting with "/") t

  if (ctx.message && ctx?.message?.text && ctx?.message?.text?.startsWith('/')) {
    ctx.reply('Invalid input.');
    errorMsg && ctx.reply(errorMsg);
    return true;
  }

  return false;
}

// Middleware to check if user entered command and redirect to its scene
export function checkAndRedirectToScene() {
  return async (ctx: any, next: any) => {
    const text = ctx?.message?.text;
    console.log(text);
    if (!text) return next();

    if (!text) return next();
    if (text && text.startsWith('/')) {
      const [command, query] = ctx.message.text.split(' ');
      const commandText = command.slice(1);
      if (query) return checkQueries(ctx, query, next);

      if (commandText == 'start' || commandText == 'menu') {
        ctx?.scene?.leave();
        return MainMenuController.onStart(ctx);
      }

      if (commandText == 'search') {
        ctx?.scene?.leave();
        return await ctx.reply('Search questions using button below', {
          reply_markup: {
            inline_keyboard: [[{ text: '🔍 Search ', switch_inline_query_current_chat: '' }]],
          },
        });
      }

      if (commandText == 'register') {
        const isUserRegistered = await new RegistrationService().isUserRegisteredWithTGId(ctx.message.from.id);
        if (isUserRegistered) {
          ctx.reply(...new RegistrationFormatter().userExistMessage());
          return MainMenuController.onStart(ctx);
        }
      }

      if (commandText == 'browse') {
        ctx?.scene?.leave();
        return ctx.scene.enter(commandText);
      }

      if (ctx.scene.scenes.has(commandText)) {
        ctx?.scene?.leave();
        return ctx.scene.enter(commandText);
      } else {
        if (ctx.scene.scenes.has(capitalize(commandText))) {
          ctx?.scene?.leave();
          return ctx.scene.enter(capitalize(commandText));
        }
        if (commandText == 'restart') return next();
        return ctx.reply('Unknown option. Please choose a valid option.');
      }
    }

    return next();
  };
}

export const getCommand = (ctx: any): boolean | string => {
  const text = ctx?.message?.text;
  if (text && text.startsWith('/')) {
    const [command, query] = ctx.message.text.split(' ');
    const commandText = command.slice(1);
    return commandText as string;
  }
  return false;
};

export function restartScene(sceneId: string, register?: string) {
  return async (ctx: any, next: any) => {
    const command = getCommand(ctx);

    if ((command && command == 'restart') || (register && command == register)) {
      ctx.message.text = 'none';
      await ctx?.scene?.leave();
      return await ctx.scene.enter(sceneId);
    }
    return next();
  };
}
