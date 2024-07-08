import axios from 'axios';
import config from '../config/config';
import MainMenuFormmater from '../modules/mainmenu/mainmenu-formmater';
import { findSender } from '../utils/helpers/chat';
import { isRegistering } from '../modules/registration/registration.scene';
import { ResponseWithData } from '../types/api';
import MainMenuController from '../modules/mainmenu/mainmenu.controller';
import RegistrationService from '../modules/registration/restgration.service';
import RegistrationFormatter from '../modules/registration/registration-formatter';

const mainMenuFormmater = new MainMenuFormmater();
const registrationService = new RegistrationService();
const registrationFormatter = new RegistrationFormatter();

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
    console.error(error.message);
    return {
      status: 'fail',
      data: false,
      message: error.message,
    };
  }
}

export const devlopmentMode = () => {
  const testUsers = [6715664411, 1497684446, 5821852558, 727495712, 6668727233, 7065907617];
  return async (ctx: any, next: any) => {
    const sender = findSender(ctx);
    if (config.env == 'production') next();
    if (!testUsers.includes(sender.id)) {
      console.log(sender);
      return ctx.replyWithHTML(...mainMenuFormmater.formatFailedDevMessage());
    }
    next();
  };
};

export function checkUserInChannelandPromtJoin() {
  return async (ctx: any, next: any) => {
    try {
      const sender = findSender(ctx);

      const { status, data: isUserJoined, message } = await checkUserInChannel(sender.id);
      if (status == 'fail') return ctx.replyWithHTML(...mainMenuFormmater.formatFailedJoinCheck(message || ''));

      if (!isUserJoined) {
        return ctx.replyWithHTML(...mainMenuFormmater.formatJoinMessage(sender.first_name));
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
    '/browse',
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
  const postMenus = ['Service 1', 'Service 2', 'Service 3', 'Service 4'];
  const profileMenu = ['Profile'];
  const mainMenus = postMenus.concat(profileMenu);
  const freeMainMenus = [
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

    if (message && freeMainMenus.includes(message)) return MainMenuController.chooseOption(ctx);
    if (isVia_bot) return true;
    if (isRegisteredSkiped) return next();
    const isUserRegistered = await registrationService.isUserRegisteredWithTGId(sender.id);
    if (!isUserRegistered) {
      ctx.reply(registrationFormatter.messages.registerPrompt);
      return ctx.scene.enter('register');
    }
    const isUserActive = await registrationService.isUserActive(sender.id);

    // if (!isUserActive) {
    //   // prevent inactive user form posting
    //   if (message && postMenus.includes(message)) {
    //     return ctx.replyWithHTML(registrationFormatter.messages.activationPrompt);
    //   }
    // }

    if (message && mainMenus.includes(message)) {
      if (skipProfile && message == 'Profile') return next();
      return MainMenuController.chooseOption(ctx);
    }

    return next();
  };
}

// Define the parameters as an object
