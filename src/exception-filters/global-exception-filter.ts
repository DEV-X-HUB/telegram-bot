// Global Error Handler - geh

import { NextFunction, Request, Response } from 'express';
import AppError from '../types/error/app-error';
import logger from '../utils/logger';
import config from '../config/config';

// Send Dev Error
const sendDevError = (err: any, res: Response) => {
  logger.dev.error(err.message);
  console.log(err.message);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    errorStack: err.stack,
  });
};

// Send Prod Error
const sendProdError = (err: any, res: Response) => {
  //   if (err.isOperational) {
  //     logger.prod.error(err.message);
  //     res.status(err.statusCode).json({
  //       status: err.status,
  //       message: err.message,
  //     });
  //   } else {
  //     logger.prod.error(err.message);
  //     res.status(500).json({
  //       status: "ERROR",
  //       message: "Opps!! Unknown Error. Please try again",
  //     });
  //   }
};

// Global Error Handler
const globalExceptionFilter = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 'ERROR';
  err.statusCode = err.statusCode || 500;

  // Duplicate data error

  // Send error for Dev Environment
  if (config.env === 'development') {
    sendDevError(err, res);
  }

  // Send error for Prod Environment
  if (config.env === 'production' || config.env === 'qa') {
    sendProdError(err, res);
  }
};

// Export GEH
export default globalExceptionFilter;
