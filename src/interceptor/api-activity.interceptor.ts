// Global Error Handler - geh

import { NextFunction, Request, Response } from 'express';
import WinstonErrorLogger from '../utils/logger/error.logger';
import parseStackTrace from '../utils/helpers/stack-tracer';

import { v4 as uuid } from 'uuid';

// Global Error Handler
const APIActivityInterceptor = (request: Request, response: Response, next: NextFunction) => {
  const activityLogger = new WinstonErrorLogger('API');
  let stackInfo: any;

  //   console.log(response);

  const activityLog = {
    id: uuid(),
    path: request.url,
    method: request.method,
    ip: request.ip,
    timestamp: new Date().toISOString(),
    res: {},
  };

  const originalSend = response.send;
  const originalJson = response.json;

  // Override response.send
  response.send = function (body) {
    activityLog.res = body;
    response.send = originalSend; // Restore original send method
    return response.send(body);
  };

  // Override response.json
  response.json = function (body) {
    activityLog.res = body;
    response.json = originalJson; // Restore original json method
    return response.json(body);
  };

  response.on('finish', () => {
    activityLogger.log('', {
      ...stackInfo,
      ...activityLog,
    });
  });

  next();
  //   if (err instanceof Error) {
  //     stackInfo = parseStackTrace(err?.stack as string);
  //   }

  //   errorLogger.log('', {
  //     ...stackInfo,
  //     ...loggerResponse,
  //   });
  //   response.status(err.getStatus()).json({
  //     statusCode,
  //     message,
  //     status,
  //   });
};

// Export GEH
export default APIActivityInterceptor;
