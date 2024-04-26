import axios from 'axios';
import config from '../config/config';
import MainMenuFormmater from '../modules/mainmenu/mainmenu-formmater';
import { findSender } from '../utils/constants/chat';
const mainMenuFormmater = new MainMenuFormmater();

// Define the base URL
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

    console.log(response.data.result.status);

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

// Define the parameters as an object
