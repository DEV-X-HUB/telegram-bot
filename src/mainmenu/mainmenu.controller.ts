import { Telegraf, Context, Markup } from 'telegraf';
import { checkUserInChannel } from '../middleware/check-user-in-channel';
import { formatJoinMessage } from './mainmenu-formmater';
import config from '../config/config';
class MainMenuController {
  async onStart(ctx: any) {
    console.log(ctx.message.from);
    const isUserJoined = await checkUserInChannel(ctx.message.from.id);
    const inlineKeyboard = Markup.inlineKeyboard([
      [Markup.button.callback('Button 1', 'btn1'), Markup.button.callback('Button 2', 'btn2')],
      [Markup.button.callback('Button 3', 'btn3'), Markup.button.callback('Button 4', 'btn4')],
    ]);
    const menuOptions = Markup.keyboard([['Option 1', 'Option 2'], ['Option 3', 'Option 4'], ['Option 5']]).resize();

    ctx.reply('Choose an action:', menuOptions);

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
}

export default MainMenuController;
