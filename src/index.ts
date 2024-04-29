import Bot from './loaders/bot';

import Express from 'express';
import config from './config/config';
import {
  getPosts,
  getPostById,
  getPostsOfUser,
  updatePostStatus,
  deleteAllPosts,
  deletePostById,
  createAdmin,
  loginAdmin,
} from './api/post-controller';

const app = Express();
const ignite = () => {
  const bot = Bot();
  if (bot) {
    app.use(bot.webhookCallback('/secret-path'));

    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));

    // ROUTES
    // Post routes
    app.get('/post/all', getPosts);
    app.get('/post/:id', getPostById);
    app.get('/post/user-post/:userId', getPostsOfUser);
    app.put('/post/update', updatePostStatus);
    app.delete('/post/:id', deletePostById);
    app.delete('/post', deleteAllPosts);

    // Admin routes
    app.post('/admin/login', loginAdmin);
    app.post('/admin/signup', createAdmin);

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
