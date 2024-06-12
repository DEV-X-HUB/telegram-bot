import { findSender } from '../../utils/helpers/chat';
import MainmenuFormatter from './mainmenu-formmater';

const mainMenuFormatter = new MainmenuFormatter();
class MainMenuController {
  static async onStart(ctx: any) {
    return ctx.reply(...mainMenuFormatter.chooseServiceDisplay(1));
  }
  static async chooseOption(ctx: any) {
    const sender = findSender(ctx);
    const option = ctx?.message?.text;

    console.log(option, 'option in main menu');

    switch (option) {
      case 'Go Back': {
        return ctx.reply(...mainMenuFormatter.chooseServiceDisplay(1));
      }
      case 'Next': {
        return ctx.reply(...mainMenuFormatter.chooseServiceDisplay(2));
      }

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

        return ctx.scene.enter('Post-Section-3');
      }
      case 'Profile': {
        ctx.scene.leave();
        return ctx.scene.enter('Profile');
      }
      case 'Service 4': {
        ctx.scene.leave();
        return ctx.scene.enter('Post-Section-4');
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

      case 'FAQ': {
        return ctx.replyWithHTML(mainMenuFormatter.formatFAQ());
      }
      case 'About Us': {
        return ctx.replyWithHTML(mainMenuFormatter.formatAboutUs());
      }
      case 'Terms and Conditions': {
        return ctx.replyWithHTML(mainMenuFormatter.formatTermsandCondtions());
      }
      case 'Customer Service': {
        return ctx.replyWithHTML(mainMenuFormatter.formatCustomerSerive());
      }
      case 'Contact Us': {
        return ctx.replyWithHTML(mainMenuFormatter.formatContactUs());
      }
    }
  }
}

export default MainMenuController;
