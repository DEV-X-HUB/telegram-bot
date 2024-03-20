import axios from 'axios';
import config from '../config/config';
import MainMenuFormmater from '../mainmenu/mainmenu-formmater';
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
    const isUserJoined = await checkUserInChannel(ctx.message.from.id);
    console.log(isUserJoined, 'has joined the channel');
    if (isUserJoined) {
    } else {
      return ctx.reply(...mainMenuFormmater.formatJoinMessage(ctx.message.from.first_name));
    }
    return next();
  };
}

// Define the parameters as an object
