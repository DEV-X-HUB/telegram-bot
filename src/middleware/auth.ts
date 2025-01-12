import axios from 'axios';
import config from '../config/config';
import MainMenuFormmater from '../modules/mainmenu/mainmenu-formmater';
import { findSender } from '../utils/helpers/chat';
import RegistrationService from '../modules/registration/restgration.service';
import { isRegistering } from '../modules/registration/registration.scene';
import { ResponseWithData } from '../types/api';
import MainMenuController from '../modules/mainmenu/mainmenu.controller';
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
    console.error(error);
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
    'Go Back',
    'Next',
    'FAQ',
    'Terms and Conditions',
    'Customer Service',
    'About Us',
    'Contact Us',
  ];

  const message = ctx.message?.text;
  const query = ctx.callbackQuery?.data;

  const user = findSender(ctx);
  if (isRegistering(user.id)) return true;
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

export function checkRegistration(skipProfile: boolean = false) {
  const mainMenus = [
    'Service 1',
    'Service 2',
    'Service 3',
    'Service 4',
    'Profile',
    '🔍 Search Questions',
    'Go Back',
    'Next',
    'FAQ',
    'Terms and Conditions',
    'Customer Service',
    'About Us',
    'Contact Us',
  ];
  const freeMenus = [
    '🔍 Search Questions',
    'Browse',
    'Go Back',
    'Next',
    'FAQ',
    'Terms and Conditions',
    'Customer Service',
    'About Us',
    'Contact Us',
  ];

  return async (ctx: any, next: any) => {
    const message = ctx.message?.text;
    const isVia_bot = ctx.message?.via_bot;
    const sender = findSender(ctx);
    const isRegisteredSkiped = registerationSkips(ctx);

    if (message && freeMenus.includes(message)) return MainMenuController.chooseOption(ctx);
    if (isVia_bot) return true;
    if (isRegisteredSkiped) return next();
    const isUserRegistered = await new RegistrationService().isUserRegisteredWithTGId(sender.id);
    if (!isUserRegistered) {
      ctx.reply('Please register to use the service');
      return ctx.scene.enter('register');
    }
    if (message && mainMenus.includes(message)) {
      if (skipProfile && message == 'Profile') return next();
      return MainMenuController.chooseOption(ctx);
    }

    return next();
  };
}

// Define the parameters as an object
