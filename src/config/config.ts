import dotenv from 'dotenv';
dotenv.config();

export default {
  channel_username: process.env.CHANNEL_USERNAME || -1002088332003,
  number_of_result: process.env.NUMBER_OF_RESULTS,
  bot_url: process.env.BOT_URL,
  desc_word_length: process.env.DESC_WORD_LENGTH,
  terms_condtion_link: process.env.TERMS_CONDITION_LINK,
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
  upload_image_number: process.env.IMAGE_UPLOADED_NUMBER,

  monthThreshold: 7,

  email_host: process.env.EMAIL_HOST,
  email_port: process.env.EMAIL_PORT,
  email: process.env.EMAIL,
  email_password: process.env.EMAIL_PASSWORD,
};
