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
exports.restartScene = exports.getCommand = exports.checkAndRedirectToScene = exports.checkCommandInWizardScene = void 0;
const registration_formatter_1 = __importDefault(require("../modules/registration/registration-formatter"));
const restgration_service_1 = __importDefault(require("../modules/registration/restgration.service"));
const check_callback_1 = require("./check-callback");
const mainmenu_controller_1 = __importDefault(require("../modules/mainmenu/mainmenu.controller"));
const string_1 = require("../utils/helpers/string");
// Middleware (Validator) to check if the user entered a command in the wizard scene
function checkCommandInWizardScene(ctx, errorMsg) {
    var _a, _b, _c;
    // if the user enters a command(starting with "/") t
    try {
        if (ctx.message && ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _a === void 0 ? void 0 : _a.text) && ((_c = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _b === void 0 ? void 0 : _b.text) === null || _c === void 0 ? void 0 : _c.startsWith('/'))) {
            ctx.reply('Invalid input.');
            errorMsg && ctx.reply(errorMsg);
            return true;
        }
        return false;
    }
    catch (error) {
        throw error;
    }
}
exports.checkCommandInWizardScene = checkCommandInWizardScene;
// Middleware to check if user entered command and redirect to its scene
function checkAndRedirectToScene() {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            const text = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            console.log(text);
            if (!text)
                return next();
            if (!text)
                return next();
            if (text && text.startsWith('/')) {
                const [command, query] = ctx.message.text.split(' ');
                const commandText = command.slice(1);
                if (query)
                    return (0, check_callback_1.checkQueries)(ctx, query, next);
                if (commandText == 'start' || commandText == 'menu') {
                    (_b = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _b === void 0 ? void 0 : _b.leave();
                    return mainmenu_controller_1.default.onStart(ctx);
                }
                if (commandText == 'search') {
                    (_c = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _c === void 0 ? void 0 : _c.leave();
                    return yield ctx.reply('Search questions using button below', {
                        reply_markup: {
                            inline_keyboard: [[{ text: '🔍 Search ', switch_inline_query_current_chat: '' }]],
                        },
                    });
                }
                if (commandText == 'register') {
                    const isUserRegistered = yield new restgration_service_1.default().isUserRegisteredWithTGId(ctx.message.from.id);
                    if (isUserRegistered) {
                        ctx.reply(...new registration_formatter_1.default().userExistMessage());
                        return mainmenu_controller_1.default.onStart(ctx);
                    }
                }
                if (commandText == 'browse') {
                    (_d = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _d === void 0 ? void 0 : _d.leave();
                    return ctx.scene.enter(commandText);
                }
                if (ctx.scene.scenes.has(commandText)) {
                    (_e = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _e === void 0 ? void 0 : _e.leave();
                    return ctx.scene.enter(commandText);
                }
                else {
                    if (ctx.scene.scenes.has((0, string_1.capitalize)(commandText))) {
                        (_f = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _f === void 0 ? void 0 : _f.leave();
                        return ctx.scene.enter((0, string_1.capitalize)(commandText));
                    }
                    if (commandText == 'restart')
                        return next();
                    return ctx.reply('Unknown option. Please choose a valid option.');
                }
            }
            return next();
        }
        catch (error) {
            throw error;
        }
    });
}
exports.checkAndRedirectToScene = checkAndRedirectToScene;
const getCommand = (ctx) => {
    var _a;
    try {
        const text = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _a === void 0 ? void 0 : _a.text;
        if (text && text.startsWith('/')) {
            const [command, query] = ctx.message.text.split(' ');
            const commandText = command.slice(1);
            return commandText;
        }
        return false;
    }
    catch (error) {
        throw error;
    }
};
exports.getCommand = getCommand;
function restartScene(sceneId, register) {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const command = (0, exports.getCommand)(ctx);
            if ((command && command == 'restart') || (register && command == register)) {
                ctx.message.text = 'none';
                yield ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _a === void 0 ? void 0 : _a.leave());
                return yield ctx.scene.enter(sceneId);
            }
            return next();
        }
        catch (error) {
            throw error;
        }
    });
}
exports.restartScene = restartScene;
//# sourceMappingURL=check-command.js.map