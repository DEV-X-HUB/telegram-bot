import Bot from './loaders/bot';

import Express from 'express';
import config from './config/config';

import { updateRegisrationStateAction } from './modules/registration/registration.scene';
import APIRouter from './api/routes';

const app = Express();
const ignite = () => {
  const bot = Bot();
  if (bot) {
    app.use(bot.webhookCallback('/secret-path'));

    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));

    // ROUTES
    app.use('/admin', APIRouter);

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
