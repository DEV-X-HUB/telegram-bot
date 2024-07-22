import * as Winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import config from '../../config/config';
import { LoggerType } from '../../types/params';

export default class WinstonErrorLogger {
  private logger: Winston.Logger;

  constructor(loggerType: LoggerType) {
    // define logger ratation file based on logger type

    const dirname = loggerType == 'API' ? 'api' : 'bot';

    this.logger = Winston.createLogger({
      format: Winston.format.combine(
        Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        Winston.format.json(),
      ),

      transports: [
        new DailyRotateFile.default({
          datePattern: 'YYYY-MM-DD',
          maxSize: '20mb',
          maxFiles: '14d',
          dirname: `logs/${dirname}/errors`,
          filename: `${loggerType}_%DATE%-error.log`,
          level: 'error',
        }),
      ],
    });

    if (config.env !== 'production') {
      const consoleTransport = new Winston.transports.Console({
        format: Winston.format.combine(
          Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          Winston.format.simple(),
          Winston.format.colorize(),
        ),
      });
      this.logger.add(consoleTransport);
    }
  }

  log(message: string, metadata?: Record<string, unknown>) {
    this.logger.error(message, { ...metadata });
  }
}
