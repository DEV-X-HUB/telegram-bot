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
exports.displayDialog = void 0;
const bot_1 = __importDefault(require("../loaders/bot"));
// Display notification(popup) when user click on inline keyboard
function displayDialog(ctx_1, displayMessage_1) {
    return __awaiter(this, arguments, void 0, function* (ctx, displayMessage, show_alert = false) {
        const bot = (0, bot_1.default)();
        if (bot != null) {
            try {
                return yield ctx.answerCbQuery(displayMessage, { show_alert: show_alert });
            }
            catch (error) {
                console.log(error);
            }
        }
    });
}
exports.displayDialog = displayDialog;
//# sourceMappingURL=dialog.js.map