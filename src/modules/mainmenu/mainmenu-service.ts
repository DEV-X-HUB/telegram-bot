import prisma from '../../loaders/db-connecion';
import { checkUserInChannel } from '../../middleware/auth';
import { messageJoinPrompt } from '../../utils/helpers/chat';
import MainmenuFormatter from './mainmenu-formmater';

const mainMenuFormmater = new MainmenuFormatter();
class MainMenuService {
  constructor() {}

  async checkUsersInchannel(bot: any, checkRejoin?: boolean) {
    try {
      const users = await prisma.user.findMany({
        select: {
          first_name: true,
          tg_id: true,
          chat_id: true,
        },
      });

      if (users) {
        for (let { chat_id, first_name, tg_id } of users) {
          const { status, data: isUserJoined, message } = await checkUserInChannel(parseInt(tg_id));
          if (status == 'fail') console.error(...mainMenuFormmater.formatFailedJoinCheck(message || ''));

          if (!isUserJoined) {
            await messageJoinPrompt(
              bot,
              parseInt(chat_id),
              checkRejoin
                ? (mainMenuFormmater.formatReJoinMessage(first_name)[0] as string)
                : (mainMenuFormmater.formatJoinMessage(first_name)[0] as string),
            );
          }
        }
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }
}

export default MainMenuService;
