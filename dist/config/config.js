"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    channel_username: process.env.CHANNEL_USERNAME || -1002088332003,
    number_of_result: process.env.NUMBER_OF_RESULTS,
    bot_url: process.env.BOT_URL,
    bor_name: process.env.BOT_NAME,
    comapny_name: process.env.COMPANY_NAME,
    company_url: process.env.COMPANY_URL,
    desc_word_length: process.env.DESC_WORD_LENGTH,
    desc_preview_word_length: process.env.DESC_PREVIEW_WORD_LENGTH,
    terms_condtion_link: process.env.TERMS_CONDITION_LINK,
    channel_id: process.env.CHANNEL_ID,
    domain: process.env.DOMAIN || '',
    bot_token: process.env.BOT_TOKEN || 8080,
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    db_url: process.env.DB_URL,
    jwt: {
        secret: process.env.JWT_SECRET,
        expires_in: process.env.JWT_EXPIRES_IN,
    },
    upload_image_number: process.env.IMAGE_UPLOADED_NUMBER,
    image_upload_minute: process.env.IMAGE_UPLOADED_MINUTE || 1,
    monthThreshold: 7,
    email_host: process.env.EMAIL_HOST,
    email_port: process.env.EMAIL_PORT,
    email: process.env.EMAIL,
    email_password: process.env.EMAIL_PASSWORD,
    super_admin_email: process.env.SUPER_ADMIN_EMAIL,
    super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
    super_admin_firstname: process.env.SUPER_ADMIN_FIRST_NAME,
    super_admin_lastname: process.env.SUPER_ADMIN_LAST_NAME,
};
//# sourceMappingURL=config.js.map