"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRegistration = exports.registerationSkips = exports.checkUserInChannelandPromtJoin = exports.devlopmentMode = exports.checkUserInChannel = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config/config"));
const mainmenu_formmater_1 = __importDefault(require("../modules/mainmenu/mainmenu-formmater"));
const chat_1 = require("../utils/helpers/chat");
const registration_scene_1 = require("../modules/registration/registration.scene");
const mainmenu_controller_1 = __importDefault(require("../modules/mainmenu/mainmenu.controller"));
const restgration_service_1 = __importDefault(require("../modules/registration/restgration.service"));
const registration_formatter_1 = __importDefault(require("../modules/registration/registration-formatter"));
const mainMenuFormmater = new mainmenu_formmater_1.default();
const registrationService = new restgration_service_1.default();
const registrationFormatter = new registration_formatter_1.default();
const baseUrl = `https://api.telegram.org/bot${config_1.default.bot_token}`;
//
function checkUserInChannel(tg_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${baseUrl}/getChatMember`, {
                params: {
                    chat_id: config_1.default.channel_id,
                    user_id: tg_id,
                },
            });
            const isUserJoined = response.data.result.status === 'member' ||
                response.data.result.status === 'administrator' ||
                response.data.result.status === 'creator';
            return {
                status: 'success',
                data: isUserJoined,
                message: 'success',
            };
        }
        catch (error) {
            console.error(error.message);
            console.error(error.message);
            return {
                status: 'fail',
                data: false,
                message: error.message,
            };
        }
    });
}
exports.checkUserInChannel = checkUserInChannel;
const devlopmentMode = () => {
    const testUsers = [6715664411, 1497684446, 5821852558, 727495712, 6668727233, 7065907617];
    return (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const sender = (0, chat_1.findSender)(ctx);
            if (config_1.default.env == 'production')
                next();
            if (!testUsers.includes(sender.id)) {
                console.log(sender);
                return ctx.replyWithHTML(...mainMenuFormmater.formatFailedDevMessage());
            }
            next();
        }
        catch (error) {
            throw error;
        }
    });
};
exports.devlopmentMode = devlopmentMode;
function checkUserInChannelandPromtJoin() {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const sender = (0, chat_1.findSender)(ctx);
            const { status, data: isUserJoined, message } = yield checkUserInChannel(sender.id);
            if (status == 'fail')
                return ctx.replyWithHTML(...mainMenuFormmater.formatFailedJoinCheck(message || ''));
            if (!isUserJoined) {
                return ctx.replyWithHTML(...mainMenuFormmater.formatJoinMessage(sender.first_name));
            }
            else if (isUserJoined) {
                return next();
            }
        }
        catch (error) {
            console.error(error.message);
            return ctx.replyWithHTML(...mainMenuFormmater.formatFailedJoinCheck(error.message || ''));
        }
    });
}
exports.checkUserInChannelandPromtJoin = checkUserInChannelandPromtJoin;
const registerationSkips = (ctx) => {
    var _a, _b;
    try {
        const skipQueries = [
            'searchedPosts',
            '/browse',
            'post_detail',
            '/start',
            '/restart',
            '/search',
            '🔍 Search Questions',
            'Go Back',
            'Next',
            'FAQ',
            'Terms and Conditions',
            'Customer Service',
            'About Us',
            'Contact Us',
        ];
        const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
        const query = (_b = ctx.callbackQuery) === null || _b === void 0 ? void 0 : _b.data;
        const user = (0, chat_1.findSender)(ctx);
        if ((0, registration_scene_1.isRegistering)(user.id))
            return true;
        if (query) {
            return skipQueries.some((skipQuery) => {
                return query.toString().startsWith(skipQuery);
            });
        }
        if (message) {
            return skipQueries.some((skipQuery) => {
                return message.startsWith(skipQuery);
            });
        }
        return false;
    }
    catch (error) {
        throw error;
    }
};
exports.registerationSkips = registerationSkips;
function checkRegistration(skipProfile = false) {
    const postMenus = ['Service 1', 'Service 2', 'Service 3', 'Service 4'];
    const profileMenu = ['Profile'];
    const mainMenus = postMenus.concat(profileMenu);
    const freeMainMenus = [
        '🔍 Search Questions',
        'Browse',
        'Go Back',
        'Next',
        'FAQ',
        'Terms and Conditions',
        'Customer Service',
        'About Us',
        'Contact Us',
    ];
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            const isVia_bot = (_b = ctx.message) === null || _b === void 0 ? void 0 : _b.via_bot;
            const sender = (0, chat_1.findSender)(ctx);
            const isRegisteredSkiped = (0, exports.registerationSkips)(ctx);
            if (message && freeMainMenus.includes(message))
                return mainmenu_controller_1.default.chooseOption(ctx);
            if (isVia_bot)
                return true;
            if (isRegisteredSkiped)
                return next();
            const isUserRegistered = yield registrationService.isUserRegisteredWithTGId(sender.id);
            if (!isUserRegistered) {
                ctx.reply(registrationFormatter.messages.registerPrompt);
                return ctx.scene.enter('register');
            }
            const isUserActive = yield registrationService.isUserActive(sender.id);
            // if (!isUserActive) {
            //   // prevent inactive user form posting
            //   if (message && postMenus.includes(message)) {
            //     return ctx.replyWithHTML(registrationFormatter.messages.activationPrompt);
            //   }
            // }
            if (message && mainMenus.includes(message)) {
                if (skipProfile && message == 'Profile')
                    return next();
                return mainmenu_controller_1.default.chooseOption(ctx);
            }
            return next();
        }
        catch (error) {
            throw error;
        }
    });
}
exports.checkRegistration = checkRegistration;
// Define the parameters as an object
//# sourceMappingURL=auth.js.map