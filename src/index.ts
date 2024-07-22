import Bot from './loaders/bot';

import Express from 'express';
import config from './config/config';

import APIRouter from './api/routes';
import cors from 'cors';
import APIErrorFilter from './exception-filters/api-error.filter';
import APIActivityInterceptor from './interceptor/api-activity.interceptor';
const app = Express();
app.use(cors());
const ignite = () => {
  const bot = Bot();
  if (bot) {
    app.use(bot.webhookCallback('/secret-path'));

    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));

    // ROUTES
    app.use(APIActivityInterceptor);
    app.use('/admin', APIRouter);
    app.use(APIErrorFilter);

    const server = app.listen(config.port, () => {
      console.log(`bot is running on port ${config.port}`);
    });

    // Graceful shutdown
    process.once('SIGINT', () => {
      bot.stop('SIGINT');
      server.close();
    });
    process.once('SIGTERM', () => {
      bot.stop('SIGTERM');
      server.close();
    });
  } else console.log('bot is not initailized  ');
};
ignite();
