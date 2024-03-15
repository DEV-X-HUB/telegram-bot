import axios from 'axios';
import config from '../config/config';

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

// Define the parameters as an object