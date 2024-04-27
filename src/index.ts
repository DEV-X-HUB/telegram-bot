import Bot from './loaders/bot';

import Express from 'express';
import config from './config/config';
import {
  getPosts,
  getPostById,
  getPostsOfUser,
  updateStatusOfPost,
  deleteAllPosts,
  deletePostById,
  // createAdmin,
  // loginAdmin,
} from './api/apiFunctions';

const app = Express();
const ignite = () => {
  const bot = Bot();
  if (bot) {
    app.use(bot.webhookCallback('/secret-path'));

    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));

    // ROUTES
    // Post routes
    app.get('/posts', getPosts);
    app.get('/posts/:id', getPostById);
    app.get('/posts/user/:userId', getPostsOfUser);
    app.put('/posts/:id', updateStatusOfPost);
    app.delete('/posts/:id', deletePostById);
    app.delete('/posts', deleteAllPosts);

    // Admin routes
    // app.post('/admin/login', loginAdmin);
    // app.post('/admin/signup', createAdmin);

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
