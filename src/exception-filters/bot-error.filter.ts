// Global Error Handler - geh

import WinstonErrorLogger from '../utils/logger/error.logger';
import parseStackTrace from '../utils/helpers/stack-tracer';

import { v4 as uuid } from 'uuid';
import { findSender, getMessage } from '../utils/helpers/chat';

// Global Error Handler
const botErrorFilter = (exception: any, ctx: any) => {
  const errorLogger = new WinstonErrorLogger('BOT');
  let stackInfo: any;
  const message = exception.message || 'Internal Server Error';
  const sender = findSender(ctx);
  const messageTrace = getMessage(ctx);
  const loggerResponse = {
    id: uuid(),
    botMessageType: messageTrace.messsageType,
    botMessageValue: messageTrace.value,
    telegramId: sender.id,
    timestamp: new Date().toISOString(),
    stack: exception instanceof Error ? exception.stack : '',
  };

  if (exception instanceof Error) {
    stackInfo = parseStackTrace(exception?.stack as string);
  }

  errorLogger.log(typeof message !== 'string' ? (message as any).message : message, {
    ...stackInfo,
    ...loggerResponse,
  });

  return ctx.replyWithHTML('<b>Something has went wrong</b>\n<i>please restart the bot and try again later </i> ');
};

// Export GEH
export default botErrorFilter;
