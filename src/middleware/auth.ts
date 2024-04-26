import axios from 'axios';
import config from '../config/config';
import MainMenuFormmater from '../modules/mainmenu/mainmenu-formmater';
import { findSender } from '../utils/constants/chat';
import RegistrationService from '../modules/registration/restgration.service';
const mainMenuFormmater = new MainMenuFormmater();

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
    return result.status != 'left';
  } catch (error) {
    console.log(error);
    return false;
  }
};

export function checkUserInChannelandPromtJoin() {
  return async (ctx: any, next: any) => {
    const sender = findSender(ctx);
    const isUserJoined = await checkUserInChannel(sender.id);
    if (isUserJoined) {
      return next();
    } else {
      return ctx.reply(...mainMenuFormmater.formatJoinMessage(sender.first_name));
    }
  };
}

export const registerationSkips = (ctx: any) => {
  const skipQueries = ['searchedPosts', 'browse', 'post_detail'];
  const message = ctx.message?.text;
  const query = ctx.callbackQuery?.data;
  if (query) {
    return skipQueries.some((skipQuery) => query.toString().startsWith(skipQuery));
  }
  if (message) {
    return skipQueries.some((skipQuery) => message.toString().startsWith(skipQuery));
  }
  return false;
};

export function checkRegistration() {
  return async (ctx: any, next: any) => {
    const sender = findSender(ctx);
    const isRegisteredSkiped = registerationSkips(ctx);
    if (isRegisteredSkiped) return next();
    const isUserRegistered = await new RegistrationService().isUserRegisteredWithTGId(sender.id);
    if (!isUserRegistered) {
      ctx.reply('Please register to use the service');
      return ctx.scene.enter('register');
    }

    return next();
  };
}

// Define the parameters as an object
