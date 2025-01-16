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
const chat_1 = require("../../utils/helpers/chat");
const chat_formatter_1 = __importDefault(require("./chat-formatter"));
const chat_service_1 = __importDefault(require("./chat.service"));
const profile_service_1 = __importDefault(require("../profile/profile.service"));
const string_1 = require("../../utils/helpers/string");
const restgration_service_1 = __importDefault(require("../registration/restgration.service"));
const registration_formatter_1 = __importDefault(require("../registration/registration-formatter"));
const chatService = new chat_service_1.default();
const profileService = new profile_service_1.default();
const profileFormatter = new chat_formatter_1.default();
const registrationService = new restgration_service_1.default();
const registrationFormatter = new registration_formatter_1.default();
class ChatController {
    constructor() { }
    saveToState(ctx, userData) {
        ctx.wizard.state.userData = {
            tg_id: userData === null || userData === void 0 ? void 0 : userData.tg_id,
            id: userData === null || userData === void 0 ? void 0 : userData.id,
            display_name: userData === null || userData === void 0 ? void 0 : userData.display_name,
            bio: userData === null || userData === void 0 ? void 0 : userData.bio,
            gender: userData === null || userData === void 0 ? void 0 : userData.gender,
            notify_option: userData === null || userData === void 0 ? void 0 : userData.notify_option,
            followers: userData === null || userData === void 0 ? void 0 : userData.followers.length,
            followings: userData === null || userData === void 0 ? void 0 : userData.followings.length,
            posts: userData === null || userData === void 0 ? void 0 : userData.posts.length,
            created_at: userData === null || userData === void 0 ? void 0 : userData.created_at,
        };
    }
    chatList(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = ctx.callbackQuery.data;
            console.log(query);
        });
    }
    sendMessage(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const sender = (0, chat_1.findSender)(ctx);
            let receiverId = null;
            const isUserActive = yield registrationService.isUserActive(sender.id);
            if (!isUserActive)
                return ctx.replyWithHTML(registrationFormatter.messages.activationPrompt);
            if (ctx.wizard.state.receiver_id) {
                receiverId = ctx.wizard.state.receiver_id;
            }
            else {
                const query = ctx.callbackQuery.data;
                const [_, receiver_id] = query.split('_');
                receiverId = receiver_id;
                ctx.wizard.state.receiver_id = receiver_id;
            }
            const currentUser = yield profileService.getProfileByTgId(sender.id);
            const { isBlocked: haveYouBlocked } = yield profileService.isBlockedBy((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', receiverId);
            const { isBlocked: yourAreBlocked } = yield profileService.isBlockedBy(receiverId, (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '');
            if (yourAreBlocked) {
                yield ctx.reply(profileFormatter.messages.yourAreBlocked);
                return (_a = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _a === void 0 ? void 0 : _a.leave();
            }
            const receiver = yield profileService.getProfileById(receiverId);
            if (!receiver)
                return ctx.reply(profileFormatter.messages.noReciverErrorMsg);
            ctx.wizard.state.receiver = {
                id: receiver.id,
                display_name: receiver.display_name || 'Anonymous',
                chat_id: receiver.chat_id,
            };
            const userData = yield profileService.getProfileDataWithTgId(sender.id);
            if ((userData === null || userData === void 0 ? void 0 : userData.display_name) == null) {
                ctx.wizard.state.activity = 'update_display_name';
                ctx.wizard.state.reason = 'message_replay';
                return yield ctx.reply(...profileFormatter.enterDisplayNameDisplay());
            }
            (0, chat_1.deleteMessageWithCallback)(ctx);
            ctx.wizard.state.activity = 'enter_message_text';
            return ctx.replyWithHTML(...profileFormatter.enterMessageDisplay(receiver.display_name || 'Anonymous', haveYouBlocked));
        });
    }
    enterMessage(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const sender = (0, chat_1.findSender)(ctx);
            const message = ctx.message;
            if (!message)
                return yield ctx.reply(profileFormatter.messages.ivalidInput);
            if ((0, string_1.areEqaul)(message.text, 'back', true)) {
                (0, chat_1.deleteKeyboardMarkup)(ctx);
                (_a = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _a === void 0 ? void 0 : _a.leave();
            }
            let receiver = ctx.wizard.state.receiver;
            if (!receiver)
                return yield ctx.reply(profileFormatter.messages.noReciverErrorMsg);
            const userData = yield profileService.getProfileDataWithTgId(sender.id);
            if (!userData)
                return;
            const { success } = yield chatService.createMessage(userData === null || userData === void 0 ? void 0 : userData.id, receiver.id, message.text);
            if (!success)
                if (!message)
                    return yield ctx.reply(profileFormatter.messages.sendMessageError);
            const currentUser = yield profileService.getProfileByTgId(sender.id);
            const { isBlocked: haveYouBlocked } = yield profileService.isBlockedBy((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', receiver.id);
            if (haveYouBlocked)
                yield profileService.unblockUser((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', receiver.id);
            yield (0, chat_1.sendMessage)(ctx, receiver.chat_id, profileFormatter.formatMessageSent(message.text, userData.id, (userData === null || userData === void 0 ? void 0 : userData.display_name) || ''), userData.id, 'messageid');
            yield ctx.replyWithHTML(...profileFormatter.messageSentDisplay(receiver));
            (_b = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _b === void 0 ? void 0 : _b.leave();
        });
    }
    replyToMessage(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const sender = (0, chat_1.findSender)(ctx);
            const isUserActive = yield registrationService.isUserActive(sender.id);
            if (!isUserActive)
                return ctx.replyWithHTML(registrationFormatter.messages.activationPrompt);
            let receiverId = null;
            if (ctx.wizard.state.receiver_id) {
                receiverId = ctx.wizard.state.receiver_id;
            }
            else {
                const query = ctx.callbackQuery.data;
                const [_, receiver_id] = query.split('_');
                receiverId = receiver_id;
                ctx.wizard.state.receiver_id = receiver_id;
            }
            const currentUser = yield profileService.getProfileByTgId(sender.id);
            const { isBlocked: haveYouBlocked } = yield profileService.isBlockedBy((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', receiverId);
            const { isBlocked: yourAreBlocked } = yield profileService.isBlockedBy(receiverId, (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '');
            if (yourAreBlocked) {
                yield ctx.reply(profileFormatter.messages.yourAreBlocked);
                return (_a = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _a === void 0 ? void 0 : _a.leave();
            }
            const receiver = yield profileService.getProfileById(ctx.wizard.state.receiver_id);
            if (!receiver)
                return ctx.reply(profileFormatter.messages.noReciverErrorMsg);
            ctx.wizard.state.receiver = {
                id: receiver.id,
                display_name: receiver.display_name || 'Anonymous',
                chat_id: receiver.chat_id,
            };
            const userData = yield profileService.getProfileDataWithTgId(sender.id);
            if ((userData === null || userData === void 0 ? void 0 : userData.display_name) == null) {
                ctx.wizard.state.activity = 'update_display_name';
                ctx.wizard.state.reason = 'message_replay';
                return yield ctx.reply(...profileFormatter.enterDisplayNameDisplay());
            }
            ctx.wizard.state.activity = 'enter_message_replay';
            return ctx.replyWithHTML(...profileFormatter.enterMessageDisplay(receiver.display_name || 'Anonymous', haveYouBlocked));
        });
    }
    enterReplyMessage(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const sender = (0, chat_1.findSender)(ctx);
            const message = ctx.message;
            if (!message)
                return yield ctx.reply(profileFormatter.messages.ivalidInput);
            if ((0, string_1.areEqaul)(message.text, 'back', true)) {
                (0, chat_1.deleteKeyboardMarkup)(ctx);
                (_a = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _a === void 0 ? void 0 : _a.leave();
            }
            let receiver = ctx.wizard.state.receiver;
            if (!receiver)
                return yield ctx.reply(profileFormatter.messages.noReciverErrorMsg);
            const userData = yield profileService.getProfileDataWithTgId(sender.id);
            if (!userData)
                return;
            const currentUser = yield profileService.getProfileByTgId(sender.id);
            const { isBlocked: haveYouBlocked } = yield profileService.isBlockedBy((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', receiver.id);
            if (haveYouBlocked)
                yield profileService.unblockUser((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', receiver.id);
            const { success } = yield chatService.createMessage(userData === null || userData === void 0 ? void 0 : userData.id, receiver.id, message.text);
            if (!success)
                if (!message)
                    return yield ctx.reply(profileFormatter.messages.sendMessageError);
            yield (0, chat_1.sendMessage)(ctx, receiver.chat_id, profileFormatter.formatMessageSent(message.text, userData.id, (userData === null || userData === void 0 ? void 0 : userData.display_name) || ''), userData.id, 'messageid');
            yield ctx.replyWithHTML(...profileFormatter.replaySentDisplay(receiver));
            (_b = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _b === void 0 ? void 0 : _b.leave();
        });
    }
    updateDisplayName(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const sender = (0, chat_1.findSender)(ctx);
            const message = ctx.message;
            if (!message)
                return yield ctx.reply(profileFormatter.messages.ivalidInput);
            if ((0, string_1.areEqaul)(message.text, 'back', true)) {
                (0, chat_1.deleteKeyboardMarkup)(ctx);
                (_a = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _a === void 0 ? void 0 : _a.leave();
            }
            const { status, isDisplayNameTaken, message: errorMsg } = yield profileService.isDisplayNameTaken(message.text);
            if (status == 'fail')
                return ctx.reply(errorMsg);
            if (isDisplayNameTaken)
                return ctx.reply(profileFormatter.messages.displayNameTakenMsg);
            const { status: updateStatus, message: updateMessage } = yield profileService.updateDiplayNameByTgId(sender.id.toString(), message.text);
            if (updateStatus == 'fail')
                return ctx.reply(updateMessage);
            const receiver = yield profileService.getProfileById(ctx.wizard.state.receiver_id);
            if (!receiver)
                return ctx.reply(profileFormatter.messages.noReciverErrorMsg);
            // deciding wehere to go next
            if (ctx.wizard.state.reason == 'message_replay')
                ctx.wizard.state.activity = 'enter_message_replay';
            else
                ctx.wizard.state.activity = 'enter_message_text';
            return ctx.reply(...profileFormatter.enterMessageDisplay(receiver.display_name || 'Anonymous'));
        });
    }
}
exports.default = ChatController;
//# sourceMappingURL=chat.controller.js.map