import { findSender } from '../../utils/helpers/chat';
import RegistrationService from '../registration/restgration.service';
import MainmenuFormatter from './mainmenu-formmater';
import MainMenuService from './mainmenu-service';
const mainMenuService = new MainMenuService();

const mainMenuFormatter = new MainmenuFormatter();
class MainMenuController {
  static async onStart(ctx: any) {
    ctx.reply(...mainMenuFormatter.chooseServiceDisplay());
  }
  static async chooseOption(ctx: any) {
    const sender = findSender(ctx);
    const option = ctx?.message?.text;

    // if (option && option.startsWith('🔍 Search Questions')) {
    //   const isUserRegistered = await new RegistrationService().isUserRegisteredWithTGId(sender.id);
    //   if (!isUserRegistered) {
    //     ctx.reply('Please register to use the service');
    //     return ctx.scene.enter('register');
    //   }
    // }

    switch (option) {
      case 'Service 1': {
        ctx?.scene?.leave();
        return ctx.scene.enter('Post-Section-1');
      }
      case 'Service 2': {
        ctx.scene.leave();
        return ctx.scene.enter('Post-Section-2');
      }
      case 'Service 3': {
        ctx.scene.leave();

        return ctx.scene.enter('Post-Question-Section-3');
      }
      case 'Profile': {
        ctx.scene.leave();
        return ctx.scene.enter('Profile');
      }
      case 'Service 4': {
        ctx.scene.leave();
        return ctx.scene.enter('Post-Question-Section-4');
      }
      case 'Browse': {
        ctx?.scene?.leave();
        return ctx.scene.enter('browse');
      }
      case '🔍 Search Questions': {
        await ctx.reply('Search questions using button below', {
          reply_markup: {
            inline_keyboard: [[{ text: '🔍 Search ', switch_inline_query_current_chat: '' }]],
          },
        });
        return ctx.scene.leave();
      }
    }
  }
}

export default MainMenuController;
