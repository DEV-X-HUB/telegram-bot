import axios from 'axios';
import config from '../config/config';
import MainMenuFormmater from '../modules/mainmenu/mainmenu-formmater';
const mainMenuFormmater = new MainMenuFormmater();

// Define the base URL
const baseUrl = `https://api.telegram.org/bot${config.bot_token}`;

export const checkUserInChannel = async (user_id: string | number): Promise<boolean> => {
  const params = {
    chat_id: config.channel_id,
    user_id: user_id,
  };

  try {
    const {
      data: { ok, result },
    } = await axios.get(`${baseUrl}/getChatMember`, { params });
    return result.status == 'member';
  } catch (error) {
    console.log(error);
    return false;
  }
};

export function checkUserInChannelandPromtJoin() {
  return async (ctx: any, next: any) => {
    let sender;
    if (ctx?.callbackQuery) sender = ctx?.callbackQuery?.from;
    if (ctx?.inline_query) sender = ctx?.inline_query?.from;
    if (ctx?.message) sender = ctx?.message?.from;
    if (ctx?.update.inline_query) sender = ctx?.update.inline_query?.from;

    const isUserJoined = await checkUserInChannel(sender.id);
    console.log(isUserJoined, 'has joined the channel');
    if (isUserJoined) {
    } else {
      return ctx.reply(...mainMenuFormmater.formatJoinMessage(sender.first_name));
    }
    return next();
  };
}

// Define the parameters as an object
