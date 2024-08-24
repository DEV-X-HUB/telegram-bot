"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const config_1 = __importDefault(require("../config/config"));
const db_connecion_1 = __importDefault(require("./db-connecion"));
const registration_scene_1 = __importDefault(require("../modules/registration/registration.scene"));
const check_command_1 = require("../middleware/check-command");
const auth_1 = require("../middleware/auth");
const post_scene_1 = __importDefault(require("../modules/post/post.scene"));
const profile_scene_1 = __importDefault(require("../modules/profile/profile.scene"));
const commands_1 = require("../utils/helpers/commands");
const post_controller_1 = __importDefault(require("../modules/post/post.controller"));
const check_callback_1 = require("../middleware/check-callback");
const chat_scene_1 = __importDefault(require("../modules/chat/chat.scene"));
const browse_post_scene_1 = __importDefault(require("../modules/browse-post/browse-post.scene"));
const mainmenu_service_1 = __importDefault(require("../modules/mainmenu/mainmenu-service"));
const cron = __importStar(require("cron"));
const bot_error_filter_1 = __importDefault(require("../exception-filters/bot-error.filter"));
const bot_activity_interceptor_1 = __importDefault(require("../interceptor/bot-activity.interceptor"));
const mainMenuService = new mainmenu_service_1.default();
let bot = null;
const checkUserInitializer = () => {
    console.log('checking left user');
    mainMenuService.checkUsersInchannel(bot, true);
};
exports.default = () => {
    if (bot != null)
        return bot;
    bot = new telegraf_1.Telegraf(config_1.default.bot_token);
    bot.telegram.setWebhook(`${config_1.default.domain}/secret-path`);
    const stage = new telegraf_1.Scenes.Stage([profile_scene_1.default, ...post_scene_1.default, registration_scene_1.default, chat_scene_1.default, browse_post_scene_1.default]);
    bot.use((0, bot_activity_interceptor_1.default)());
    // bot.use(devlopmentMode());
    // bot.use(checkUserInChannelandPromtJoin());
    bot.on('inline_query', post_controller_1.default.handleSearch);
    stage.use((0, auth_1.checkRegistration)());
    stage.use((0, check_callback_1.checkCallBacks)());
    stage.use((0, check_command_1.checkAndRedirectToScene)());
    bot.use((0, telegraf_1.session)());
    bot.use(stage.middleware());
    bot.catch(bot_error_filter_1.default);
    const commands = [
        { name: 'start', description: 'Start the bot' },
        { name: 'register', description: 'Register to the bot' },
        { name: 'search', description: 'search questions' },
        { name: 'register', description: 'Register to the bot' },
        { name: 'profile', description: 'View your profile' },
        { name: 'restart', description: 'Restart the service' },
        { name: 'browse', description: 'Browse posts' },
    ];
    const job = new cron.CronJob('00 00 00  * * *', checkUserInitializer, null, true /* Start the job right now */, 'default');
    (0, commands_1.setCommands)(commands);
    db_connecion_1.default;
    return bot;
};
//# sourceMappingURL=bot.js.map