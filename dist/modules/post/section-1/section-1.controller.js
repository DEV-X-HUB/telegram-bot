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
const string_1 = require("../../../utils/helpers/string");
const mainmenu_controller_1 = __importDefault(require("../../mainmenu/mainmenu.controller"));
const section_1_formatter_1 = __importDefault(require("./section-1.formatter"));
const section1Formatter = new section_1_formatter_1.default();
class QuestionPostController {
    constructor() { }
    start(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.reply(...section1Formatter.chooseOptionDislay());
            return ctx.wizard.next();
        });
    }
    chooseOption(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const option = ctx.message.text;
            if ((0, string_1.areEqaul)(option, 'back', true)) {
                // go back to the previous scene
                ctx.scene.leave();
                return mainmenu_controller_1.default.onStart(ctx);
            }
            if ((0, string_1.isInMarkUPOption)(option, section1Formatter.categories)) {
                switch (option) {
                    case 'Section 1A': {
                        ctx.scene.leave();
                        return ctx.scene.enter('Post-SectionA');
                    }
                    case 'Section 1B': {
                        ctx.scene.leave();
                        return ctx.scene.enter('Post-SectionB');
                    }
                    case 'Section 1C': {
                        ctx.scene.leave();
                        return ctx.scene.enter('Post-SectionC');
                    }
                    default:
                        return ctx.reply('Unknown option. Please choose a valid option.');
                }
            }
        });
    }
}
exports.default = QuestionPostController;
//# sourceMappingURL=section-1.controller.js.map