import axios from 'axios';
import config from '../config/config';
import MainMenuFormmater from '../modules/mainmenu/mainmenu-formmater';
import { findSender } from '../utils/constants/chat';
import RegistrationService from '../modules/registration/restgration.service';
import { isRegistering } from '../modules/registration/registration.scene';
const mainMenuFormmater = new MainMenuFormmater();

const baseUrl = `https://api.telegram.org/bot${config.bot_token}`;

//
async function checkUserInChannel(userId: number): Promise<any> {
  try {
    const response = await axios.get(`${baseUrl}/getChatMember`, {
      params: {
        chat_id: config.channel_id,
        user_id: userId,
      },
    });

    const isUserJoined =
      response.data.result.status === 'member' ||
      response.data.result.status === 'administrator' ||
      response.data.result.status === 'creator';

    const responseData = {
      status: 'success',
      joined: isUserJoined,
    };

    console.log(isUserJoined);

    return responseData;
  } catch (error) {
    // throw new Error('Failed to check user in channel');
    return {
      status: 'fail',
    };
  }
}

export function checkUserInChannelandPromtJoin() {
  return async (ctx: any, next: any) => {
    const sender = findSender(ctx);

    try {
      const isUserJoined = await checkUserInChannel(sender.id);

      if (isUserJoined?.joined == false) {
        return ctx.reply(...mainMenuFormmater.formatJoinMessage(sender.first_name));
      } else if (isUserJoined?.joined == true) {
        return next();
      }
    } catch (error) {
      return ctx.reply('Unable to check user in channel. Please try again later');
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
