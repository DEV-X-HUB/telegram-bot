import { v4 as uuid } from 'uuid';
import { findSender, getMessage } from '../utils/helpers/chat';
import WinstonActivityLogger from '../utils/logger/activity-logger';

const botActivityInterceptor = () => {
  return async (ctx: any, next: any) => {
    try {
      const activityLogger = new WinstonActivityLogger('BOT');
      const sender = findSender(ctx);
      const messageTrace = getMessage(ctx);

      const loggerResponse = {
        id: uuid(),
        botMessageType: messageTrace.messsageType,
        botMessageValue: messageTrace.value,
        telegramId: sender.id,
        timestamp: new Date().toISOString(),
      };
      console.log(ctx);

      activityLogger.log('', {
        ...loggerResponse,
      });

      next();
    } catch (error) {
      throw error;
    }
  };
};

export default botActivityInterceptor;
