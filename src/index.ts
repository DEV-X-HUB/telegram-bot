import Bot from './loaders/bot';

import Express from 'express';
import config from './config/config';
const app = Express();
const ignite = () => {
  const bot = Bot();
  if (bot) {
    app.use(bot.webhookCallback('/secret-path'));
    const server = app.listen(config.port, () => {
      console.log(`bot is running on port ${config.port}`);
    });

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
