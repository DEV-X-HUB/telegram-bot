import { Telegraf, Context, Markup } from 'telegraf';
import { checkUserInChannel } from '../middleware/check-user-in-channel';

import MainmenuFormatter from './mainmenu-formmater';

const mainMenuFormatter = new MainmenuFormatter();
class MainMenuController {
  async onStart(ctx: any) {
    // const isUserJoined = await checkUserInChannel(ctx.message.from.id);

    ctx.reply('Choose a service:', ...mainMenuFormatter.chooseServiceDisplay());
    return ctx.wizard.next();

    // if (isUserJoined) {
    //   ctx.reply("Welcome! Let's start the registration process.");
    //   ctx.scene.enter('register');
    // } else {
    //   ctx.reply(
    //     formatJoinMessage(ctx.message.from.first_name),
    //     urlButton('Join', `https://t.me/${config.channel_username}`),
    //   );
    // }
  }

  async chooseOption(ctx: any) {
    const option = ctx.message.text;
    console.log('option ', option);
    if (option === 'back') {
      return ctx.wizard.back();
    }

    // check if scene exists with the option
    console.log('exists ', ctx.scene.scenes.has(option));

    if (ctx.scene.scenes.has(option)) {
      return ctx.scene.enter(option);
    } else {
      return ctx.reply('Unknown option. Please choose a valid option.');
    }
  }
}

export default MainMenuController;
