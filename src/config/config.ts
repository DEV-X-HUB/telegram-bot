import dotenv from 'dotenv';
dotenv.config();

export default {
  channel_username: process.env.CHANNEL_USERNAME,
  channel_id: process.env.CHANNEL_ID,
  domain: process.env.DOMAIN || '',
  bot_token: process.env.BOT_TOKEN || 8080,
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  db_url: process.env.DB_URL as string,
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
  },
};
