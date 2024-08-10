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
const telegraf_1 = require("telegraf");
const chat_controller_1 = __importDefault(require("./chat.controller"));
const chat_1 = require("../../utils/helpers/chat");
const auth_1 = require("../../middleware/auth");
const chatController = new chat_controller_1.default();
const ChatScene = new telegraf_1.Scenes.WizardScene('chat', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const sender = (0, chat_1.findSender)(ctx);
    let activity = '';
    switch (true) {
        case (0, chat_1.hasCallbackQuery)(ctx, 'sendMessage_'):
            activity = 'send_message';
            break;
        case (0, chat_1.hasCallbackQuery)(ctx, 'replyMessage_'):
            activity = 'replay_message';
            break;
    }
    const state = ctx.wizard.state;
    if (!state.activity || state.activity == '')
        return chatController.sendMessage(ctx);
    switch (state.activity) {
        case 'send_message':
            return chatController.sendMessage(ctx);
        case 'enter_message_text':
            return chatController.enterMessage(ctx);
        case 'replay_message':
            return chatController.replyToMessage(ctx);
        case 'enter_message_replay':
            return chatController.enterReplyMessage(ctx);
        case 'update_display_name':
            return chatController.updateDisplayName(ctx);
    }
}));
ChatScene.use((0, auth_1.checkRegistration)());
exports.default = ChatScene;
// Handle errors gracefully (optional)
//# sourceMappingURL=chat.scene.js.map