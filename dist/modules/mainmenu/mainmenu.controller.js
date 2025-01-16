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
const mainmenu_formmater_1 = __importDefault(require("./mainmenu-formmater"));
const mainMenuFormatter = new mainmenu_formmater_1.default();
class MainMenuController {
    static onStart(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return ctx.reply(...mainMenuFormatter.chooseServiceDisplay(1));
        });
    }
    static chooseOption(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const option = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            switch (option) {
                case 'Go Back': {
                    return ctx.reply(...mainMenuFormatter.chooseServiceDisplay(1));
                }
                case 'Next': {
                    return ctx.reply(...mainMenuFormatter.chooseServiceDisplay(2));
                }
                case 'Service 1': {
                    (_b = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _b === void 0 ? void 0 : _b.leave();
                    return ctx.scene.enter('Post-Section-1');
                }
                case 'Service 2': {
                    ctx.scene.leave();
                    return ctx.scene.enter('Post-Section-2');
                }
                case 'Service 3': {
                    ctx.scene.leave();
                    return ctx.scene.enter('Post-Section-3');
                }
                case 'Profile': {
                    ctx.scene.leave();
                    return ctx.scene.enter('Profile');
                }
                case 'Service 4': {
                    ctx.scene.leave();
                    return ctx.scene.enter('Post-Section-4');
                }
                case 'Browse': {
                    (_c = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _c === void 0 ? void 0 : _c.leave();
                    return ctx.scene.enter('browse');
                }
                case '🔍 Search Questions': {
                    yield ctx.reply('Search questions using button below', {
                        reply_markup: {
                            inline_keyboard: [[{ text: '🔍 Search ', switch_inline_query_current_chat: '' }]],
                        },
                    });
                    return ctx.scene.leave();
                }
                case 'FAQ': {
                    return ctx.replyWithHTML(mainMenuFormatter.formatFAQ());
                }
                case 'About Us': {
                    return ctx.replyWithHTML(mainMenuFormatter.formatAboutUs());
                }
                case 'Terms and Conditions': {
                    return ctx.replyWithHTML(mainMenuFormatter.formatTermsandCondtions());
                }
                case 'Customer Service': {
                    return ctx.replyWithHTML(mainMenuFormatter.formatCustomerSerive());
                }
                case 'Contact Us': {
                    return ctx.replyWithHTML(mainMenuFormatter.formatContactUs());
                }
            }
        });
    }
}
exports.default = MainMenuController;
//# sourceMappingURL=mainmenu.controller.js.map