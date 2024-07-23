// Global Error Handler - geh

import { NextFunction, Request, Response } from 'express';
import WinstonErrorLogger from '../utils/logger/error.logger';
import parseStackTrace from '../utils/helpers/stack-tracer';

import { v4 as uuid } from 'uuid';

// Global Error Handler
const APIErrorFilter = (exception: any, request: Request, response: Response, next: NextFunction) => {
  const errorLogger = new WinstonErrorLogger('API');
  let stackInfo: any;
  const status = exception.status || 'ERROR';
  const statusCode = exception.statusCode || 500;
  const message = exception.message || 'Internal Server Error';

  const loggerResponse = {
    id: uuid(),
    status: exception.statusCode,
    path: request.url,
    method: request.method,
    ip: request.ip,
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
  response.status(statusCode).json({
    statusCode,
    message,
    status,
  });
};

// Export GEH
export default APIErrorFilter;
