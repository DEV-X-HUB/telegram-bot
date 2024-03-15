import { Telegraf, Context } from 'telegraf';
import { checkUserInChannel } from '../middleware/check-user-in-channel';
import { formatJoinMessage } from './mainmenu-formmater';
import { urlButton } from '../components/button';
import config from '../config/config';
class MainMenuController {
  async onStart(ctx: any) {
    console.log(ctx.message.from);
    const isUserJoined = await checkUserInChannel(ctx.message.from.id);
    if (isUserJoined) {
      ctx.reply("Welcome! Let's start the registration process.");
      ctx.scene.enter('register');
    } else {
      ctx.reply(
        formatJoinMessage(ctx.message.from.first_name),
        urlButton('Join', `https://t.me/${config.channel_username}`),
      );
    }
  }
}

export default MainMenuController;
