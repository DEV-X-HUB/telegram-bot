// Global Error Handler - geh

import { NextFunction, Request, Response } from 'express';

import { v4 as uuid } from 'uuid';
import WinstonActivityLogger from '../utils/logger/activity-logger';

// Global Error Handler
const APIActivityInterceptor = (request: Request, response: Response, next: NextFunction) => {
  const activityLogger = new WinstonActivityLogger('API');
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
};

// Export GEH
export default APIActivityInterceptor;
