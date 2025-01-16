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
const chat_1 = require("../../../utils/helpers/chat");
const string_1 = require("../../../utils/helpers/string");
const mainmenu_controller_1 = __importDefault(require("../../mainmenu/mainmenu.controller"));
const section_4_formatter_1 = __importDefault(require("./section-4.formatter"));
const section4Formatter = new section_4_formatter_1.default();
class QuestionPostSection4Controller {
    constructor() { }
    start(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, chat_1.deleteKeyboardMarkup)(ctx, section4Formatter.messages.categoriesPrompt);
            yield ctx.reply(...section4Formatter.chooseOptionDislay());
            return ctx.wizard.next();
        });
    }
    chooseOption(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(section4Formatter.messages.useButtonError);
            if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                ctx.scene.leave();
                return mainmenu_controller_1.default.onStart(ctx);
            }
            switch (callbackQuery.data) {
                case 'manufacture': {
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    ctx.scene.leave();
                    return ctx.scene.enter('Post-Section4-Manufacture');
                }
                case 'construction': {
                    ctx.scene.leave();
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    return ctx.scene.enter('Post-SectionB-Construction');
                }
                case 'chicken-farm': {
                    ctx.scene.leave();
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    return ctx.scene.enter('Post-Section4-Chicken-Farm');
                }
                default:
                    return ctx.reply('Unknown option. Please choose a valid option.');
            }
        });
    }
}
exports.default = QuestionPostSection4Controller;
//# sourceMappingURL=section-4.controller.js.map