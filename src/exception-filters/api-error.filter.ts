// Global Error Handler - geh

import { NextFunction, Request, Response } from 'express';
import WinstonErrorLogger from '../utils/logger/error.logger';
import parseStackTrace from '../utils/helpers/stack-tracer';

import { v4 as uuid } from 'uuid';

// Global Error Handler
const APIErrorFilter = (err: any, request: Request, response: Response, next: NextFunction) => {
  const errorLogger = new WinstonErrorLogger('API');
  let stackInfo: any;
  const status = err.status || 'ERROR';
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const loggerResponse = {
    id: uuid(),
    status: err.statusCode,
    path: request.url,
    method: request.method,
    ip: request.ip,
    timestamp: new Date().toISOString(),
    stack: err instanceof Error ? err.stack : '',
  };

  if (err instanceof Error) {
    stackInfo = parseStackTrace(err?.stack as string);
  }

  errorLogger.log(typeof message !== 'string' ? (message as any).message : message, {
    ...stackInfo,
    ...loggerResponse,
  });
  response.status(err.getStatus()).json({
    statusCode,
    message,
    status,
  });
};

// Export GEH
export default APIErrorFilter;
