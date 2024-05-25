import axios from 'axios';
import config from '../config/config';
import MainMenuFormmater from '../modules/mainmenu/mainmenu-formmater';
import { findSender } from '../utils/helpers/chat';
import RegistrationService from '../modules/registration/restgration.service';
import { isRegistering } from '../modules/registration/registration.scene';
import { ResponseWithData } from '../types/api';
const mainMenuFormmater = new MainMenuFormmater();

const baseUrl = `https://api.telegram.org/bot${config.bot_token}`;

//
export async function checkUserInChannel(tg_id: number): Promise<ResponseWithData> {
  try {
    const response = await axios.get(`${baseUrl}/getChatMember`, {
      params: {
        chat_id: config.channel_id,
        user_id: tg_id,
      },
    });

    const isUserJoined =
      response.data.result.status === 'member' ||
      response.data.result.status === 'administrator' ||
      response.data.result.status === 'creator';

    return {
      status: 'success',
      data: isUserJoined,
      message: 'success',
    };
  } catch (error: any) {
    console.error(error.message);
    return {
      status: 'fail',
      data: false,
      message: error.message,
    };
  }
}

export function checkUserInChannelandPromtJoin() {
  return async (ctx: any, next: any) => {
    const sender = findSender(ctx);
    try {
      const { status, data: isUserJoined, message } = await checkUserInChannel(sender.id);
      if (status == 'fail') return ctx.replyWithHTML(...mainMenuFormmater.formatFailedJoinCheck(message || ''));

      if (!isUserJoined) {
        return ctx.reply(...mainMenuFormmater.formatJoinMessage(sender.first_name));
      } else if (isUserJoined) {
        return next();
      }
    } catch (error: any) {
      console.error(error.message);
      return ctx.replyWithHTML(...mainMenuFormmater.formatFailedJoinCheck(error.message || ''));
    }
  };
}

export const registerationSkips = (ctx: any) => {
  const skipQueries = [
    'searchedPosts',
    'browse',
    'post_detail',
    '/start',
    '/restart',
    '/search',
    '🔍 Search Questions',
  ];
  const message = ctx.message?.text;
  const query = ctx.callbackQuery?.data;
  console.log(isRegistering(), 'is registering  ');
  if (isRegistering()) return true;

  if (query) {
    return skipQueries.some((skipQuery) => {
      return query.toString().startsWith(skipQuery);
    });
  }
  if (message) {
    return skipQueries.some((skipQuery) => {
      return message.startsWith(skipQuery);
    });
  }

  return false;
};

export function checkRegistration() {
  return async (ctx: any, next: any) => {
    const isVia_bot = ctx.message?.via_bot;
    const sender = findSender(ctx);
    const isRegisteredSkiped = registerationSkips(ctx);
    console.log(isRegisteredSkiped, 'skipped');
    if (isVia_bot) return true;
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
