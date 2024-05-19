import Bot from './loaders/bot';

import Express from 'express';
import config from './config/config';

import { updateRegisrationStateAction } from './modules/registration/registration.scene';
import APIRouter from './api/routes';
import { authGuard } from './middleware/admin-auth';

const app = Express();
const ignite = () => {
  const bot = Bot();
  if (bot) {
    app.use(bot.webhookCallback('/secret-path'));

    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));

    // ROUTES
    app.use('/admin', authGuard, APIRouter);

    const server = app.listen(config.port, () => {
      console.log(`bot is running on port ${config.port}`);
    });

    // Graceful shutdown
    process.once('SIGINT', () => {
      updateRegisrationStateAction('end_register');
      bot.stop('SIGINT');
      server.close();
    });
    process.once('SIGTERM', () => {
      updateRegisrationStateAction('end_register');
      bot.stop('SIGTERM');
      server.close();
    });
  } else console.log('bot is not initailized  ');
};
ignite();
