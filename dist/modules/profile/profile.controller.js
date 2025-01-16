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
const date_1 = require("../../utils/helpers/date");
const string_1 = require("../../utils/helpers/string");
const profile_formatter_1 = __importDefault(require("./profile-formatter"));
const profile_service_1 = __importDefault(require("./profile.service"));
const mainmenu_controller_1 = __importDefault(require("../mainmenu/mainmenu.controller"));
const post_service_1 = __importDefault(require("../post/post.service"));
const profile_validator_1 = require("../../utils/validator/profile-validator");
const dialog_1 = require("../../ui/dialog");
const profileService = new profile_service_1.default();
const profileFormatter = new profile_formatter_1.default();
class ProfileController {
    constructor() { }
    saveToState(ctx, userData) {
        ctx.wizard.state.userData = {
            tg_id: userData === null || userData === void 0 ? void 0 : userData.tg_id,
            id: userData === null || userData === void 0 ? void 0 : userData.id,
            display_name: userData === null || userData === void 0 ? void 0 : userData.display_name,
            bio: userData === null || userData === void 0 ? void 0 : userData.bio,
            gender: userData === null || userData === void 0 ? void 0 : userData.gender,
            country: userData === null || userData === void 0 ? void 0 : userData.country,
            city: userData === null || userData === void 0 ? void 0 : userData.city,
            age: userData === null || userData === void 0 ? void 0 : userData.age,
            email: userData === null || userData === void 0 ? void 0 : userData.email,
            notify_option: userData === null || userData === void 0 ? void 0 : userData.notify_option,
            followers: userData === null || userData === void 0 ? void 0 : userData.followers.length,
            followings: userData === null || userData === void 0 ? void 0 : userData.followings.length,
            posts: userData === null || userData === void 0 ? void 0 : userData.posts.length,
            created_at: userData === null || userData === void 0 ? void 0 : userData.created_at,
        };
    }
    preview(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = (0, chat_1.findSender)(ctx);
            const userData = yield profileService.getProfileDataWithTgId(sender.id);
            this.saveToState(ctx, userData);
            ctx.wizard.state.activity = 'preview';
            yield (0, chat_1.deleteKeyboardMarkup)(ctx, profileFormatter.formatePreview(ctx.wizard.state.userData));
            return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
        });
    }
    previewHandler(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const userData = ctx.wizard.state.userData;
            const callbackQuery = ctx.callbackQuery;
            if (callbackQuery)
                switch (callbackQuery.data) {
                    case 'edit_profile': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        ctx.wizard.state.activity = 'profile_edit_option_view';
                        return ctx.reply(...profileFormatter.editOptions());
                    }
                    case 'my_followers': {
                        const followers = yield profileService.getFollowersByUserId(userData.id);
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        ctx.wizard.state.activity = 'followers_list_view';
                        return ctx.replyWithHTML(...profileFormatter.formateFollowersList(followers));
                    }
                    case 'my_followings': {
                        const followings = yield profileService.getFollowingsByUserId(userData.id);
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        ctx.wizard.state.activity = 'followings_list_view';
                        return ctx.replyWithHTML(...profileFormatter.formateFollowingsList(followings));
                    }
                    case 'my_posts': {
                        const user = (0, chat_1.findSender)(ctx);
                        const { posts, success, message } = yield profileService.getUserPostsTgId(user.id);
                        if (!success || !posts)
                            return ctx.reply(profileFormatter.messages.postFetchError);
                        if ((posts === null || posts === void 0 ? void 0 : posts.length) == 0)
                            return ctx.reply(profileFormatter.messages.noPostMsg);
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        ctx.wizard.state.activity = 'post_list_view';
                        for (const post of posts) {
                            const sectionName = (0, string_1.getSectionName)(post.category);
                            if (((_a = post[sectionName]) === null || _a === void 0 ? void 0 : _a.photo) && ((_b = post[sectionName]) === null || _b === void 0 ? void 0 : _b.photo[0])) {
                                yield (0, chat_1.replyUserPostPreviewWithContext)({
                                    ctx,
                                    photoURl: post[sectionName].photo[0],
                                    caption: profileFormatter.postPreview(post)[0],
                                    post_id: post.id,
                                    status: post.status,
                                });
                            }
                            else
                                ctx.replyWithHTML(...profileFormatter.postPreview(post)); // if post has no photo
                        }
                        break;
                    }
                    case 'profile_setting': {
                        ctx.wizard.state.activity = 'profile_setting';
                        (0, chat_1.deleteMessageWithCallback)(ctx);
                        return ctx.reply(...profileFormatter.settingDisplay());
                    }
                    case 'back': {
                        (0, chat_1.deleteMessageWithCallback)(ctx);
                        (_c = ctx === null || ctx === void 0 ? void 0 : ctx.scene) === null || _c === void 0 ? void 0 : _c.leave();
                        return mainmenu_controller_1.default.onStart(ctx);
                    }
                    default: {
                        ctx.reply('Unknown Command');
                    }
                }
            else {
                ctx.reply(profileFormatter.messages.useButtonError);
            }
        });
    }
    viewProfileByThirdParty(ctx, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUserData = (0, chat_1.findSender)(ctx);
            const currentUser = yield profileService.getProfileByTgId(currentUserData.id);
            if (currentUser && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) == userId) {
                return ctx.scene.enter('Profile');
            }
            const { status, isFollowing } = yield profileService.isFollowing((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', userId);
            if (status == 'fail')
                return ctx.reply(profileFormatter.messages.dbError);
            const userData = yield profileService.getProfileDataWithId(userId);
            const { isBlocked } = yield profileService.isBlockedBy((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', userId);
            if (!userData)
                return ctx.reply(profileFormatter.messages.userNotFound);
            return ctx.reply(...profileFormatter.profilePreviwByThirdParty(userData, isFollowing, isBlocked));
        });
    }
    handleFollow(ctx, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const [_, userId] = query.split('_');
            const currentUserData = (0, chat_1.findSender)(ctx);
            const currentUser = yield profileService.getProfileByTgId(currentUserData.id);
            if (!currentUser)
                return;
            const { status } = yield profileService.followUser(currentUser === null || currentUser === void 0 ? void 0 : currentUser.id, userId);
            if (status == 'fail')
                return ctx.reply(profileFormatter.messages.dbError);
            const userData = yield profileService.getProfileDataWithId(userId);
            const { isBlocked } = yield profileService.isBlockedBy((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', userId);
            if (userData)
                try {
                    return ctx.editMessageReplyMarkup({
                        inline_keyboard: [profileFormatter.getProfileButtons(userData.id, true, isBlocked)],
                    });
                }
                catch (error) {
                    console.log(error);
                }
        });
    }
    handlUnfollow(ctx, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const [_, userId] = query.split('_');
            const currentUserData = (0, chat_1.findSender)(ctx);
            const currentUser = yield profileService.getProfileByTgId(currentUserData.id);
            if (!currentUser)
                return;
            const userData = yield profileService.getProfileDataWithId(userId);
            const { status } = yield profileService.unfollowUser(currentUser === null || currentUser === void 0 ? void 0 : currentUser.id, userId);
            if (status == 'fail')
                return ctx.reply(profileFormatter.messages.dbError);
            const { isBlocked } = yield profileService.isBlockedBy((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', userId);
            return ctx.editMessageReplyMarkup({
                inline_keyboard: [profileFormatter.getProfileButtons(userId, false, isBlocked)],
            });
        });
    }
    askToBlock(ctx, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const [_, userId] = query.split('_');
            const currentUserData = (0, chat_1.findSender)(ctx);
            const currentUser = yield profileService.getProfileByTgId(currentUserData.id);
            if (!currentUser)
                return;
            const userData = yield profileService.getProfileDataWithId(userId);
            if (!userData)
                return ctx.reply(profileFormatter.messages.dbError);
            yield (0, chat_1.deleteMessageWithCallback)(ctx);
            return ctx.replyWithHTML(...profileFormatter.blockUserDisplay({ id: userData.id, display_name: userData.display_name || 'Anoynmous' }), { parse_mode: 'HTML' });
        });
    }
    handleBlock(ctx, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const [_, userId] = query.split('_');
            const currentUserData = (0, chat_1.findSender)(ctx);
            const currentUser = yield profileService.getProfileByTgId(currentUserData.id);
            if (!currentUser)
                return;
            const { status: blockStatus } = yield profileService.blockUser(currentUser === null || currentUser === void 0 ? void 0 : currentUser.id, userId);
            if (blockStatus == 'fail')
                return ctx.reply(profileFormatter.messages.dbError);
            const { status, isFollowing } = yield profileService.isFollowing((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', userId);
            if (status == 'fail')
                return ctx.reply(profileFormatter.messages.dbError);
            const userData = yield profileService.getProfileDataWithId(userId);
            const { isBlocked } = yield profileService.isBlockedBy((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', userId);
            (0, chat_1.deleteMessageWithCallback)(ctx);
            yield ctx.reply(profileFormatter.messages.blockSuccess);
            return ctx.reply(...profileFormatter.profilePreviwByThirdParty(userData, isFollowing, isBlocked));
        });
    }
    cancelBlock(ctx, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const [_, userId] = query.split('_');
            const currentUserData = (0, chat_1.findSender)(ctx);
            const currentUser = yield profileService.getProfileByTgId(currentUserData.id);
            if (!currentUser)
                return;
            const { status, isFollowing } = yield profileService.isFollowing((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', userId);
            if (status == 'fail')
                return ctx.reply(profileFormatter.messages.dbError);
            const userData = yield profileService.getProfileDataWithId(userId);
            const { isBlocked } = yield profileService.isBlockedBy((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', userId);
            (0, chat_1.deleteMessageWithCallback)(ctx);
            return ctx.reply(...profileFormatter.profilePreviwByThirdParty(userData, isFollowing, isBlocked));
        });
    }
    handlUnblock(ctx, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const [_, userId] = query.split('_');
            const currentUserData = (0, chat_1.findSender)(ctx);
            const currentUser = yield profileService.getProfileByTgId(currentUserData.id);
            if (!currentUser)
                return;
            const { status } = yield profileService.unblockUser(currentUser === null || currentUser === void 0 ? void 0 : currentUser.id, userId);
            if (status == 'fail')
                return ctx.reply(profileFormatter.messages.dbError);
            const { status: followStatus, isFollowing } = yield profileService.isFollowing((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', userId);
            if (followStatus == 'fail')
                return ctx.reply(profileFormatter.messages.dbError);
            const { isBlocked } = yield profileService.isBlockedBy((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || '', userId);
            const userData = yield profileService.getProfileDataWithId(userId);
            (0, chat_1.deleteMessageWithCallback)(ctx);
            yield ctx.reply(profileFormatter.messages.unBlockSuccess);
            return ctx.reply(...profileFormatter.profilePreviwByThirdParty(userData, isFollowing, isBlocked));
        });
    }
    editProfileOption(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(profileFormatter.messages.useButtonError);
            (0, chat_1.deleteMessageWithCallback)(ctx);
            if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                ctx.wizard.state.activity = 'preview';
                return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
            }
            ctx.wizard.state.activity = 'profile_edit_editing';
            ctx.wizard.state.editField = callbackQuery.data;
            return ctx.reply(...(yield profileFormatter.editPrompt(callbackQuery.data, ctx.wizard.state.userData.gender)));
        });
    }
    editProfileEditField(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            const message = ctx.message;
            const state = ctx.wizard.state;
            if (callbackQuery) {
                switch (state.editField) {
                    case 'city': {
                        switch (callbackQuery.data) {
                            case 'back': {
                                if (ctx.wizard.state.currentRound == 0) {
                                    ctx.wizard.state.editField = 'country';
                                    (0, chat_1.deleteMessageWithCallback)(ctx);
                                    return ctx.reply(...(yield profileFormatter.chooseCountryFormatter()));
                                }
                                ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
                                (0, chat_1.deleteMessageWithCallback)(ctx);
                                return ctx.reply(...(yield profileFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound)));
                            }
                            case 'next': {
                                ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
                                (0, chat_1.deleteMessageWithCallback)(ctx);
                                return ctx.reply(...(yield profileFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound)));
                            }
                            default:
                                ctx.wizard.state.userData[state.editField] = callbackQuery.data;
                                ctx.wizard.state.currentRound = 0;
                                ctx.wizard.state.activity = 'preview';
                                const newData = yield profileService.updateProfile(state.userData.id, {
                                    bio: state.userData.bio,
                                    gender: state.userData.gender,
                                    display_name: state.userData.display_name,
                                    city: state.userData.city,
                                    country: state.userData.country,
                                    email: state.userData.email,
                                    age: parseInt(state.userData.age.toString()),
                                });
                                (0, chat_1.deleteMessageWithCallback)(ctx);
                                this.saveToState(ctx, newData);
                                yield (0, dialog_1.displayDialog)(ctx, profileFormatter.updateProfileMessage('country'));
                                return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
                        }
                    }
                    case 'country': {
                        const [countryCode, country] = callbackQuery.data.split(':');
                        ctx.wizard.state.countryCode = countryCode;
                        ctx.wizard.state.userData[state.editField] = country;
                        ctx.wizard.state.editField = 'city';
                        ctx.wizard.state.currentRound = 0;
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        return ctx.reply(...(yield profileFormatter.chooseCityFormatter(countryCode, 0)));
                    }
                    case 'back': {
                        ctx.wizard.state.activity = 'profile_edit_option_view';
                        return ctx.reply(...profileFormatter.editOptions());
                    }
                    default:
                        ctx.wizard.state.userData[state.editField] = callbackQuery.data;
                        const newData = yield profileService.updateProfile(state.userData.id, {
                            bio: state.userData.bio,
                            gender: state.userData.gender,
                            display_name: state.userData.display_name,
                            city: state.userData.city,
                            country: state.userData.country,
                            email: state.userData.email,
                            age: parseInt(state.userData.age.toString()),
                        });
                        (0, chat_1.deleteMessageWithCallback)(ctx);
                        this.saveToState(ctx, newData);
                        ctx.wizard.state.activity = 'preview';
                        yield (0, dialog_1.displayDialog)(ctx, profileFormatter.updateProfileMessage(state.editField));
                        return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
                }
            }
            if ((message === null || message === void 0 ? void 0 : message.text) && (0, string_1.areEqaul)(message === null || message === void 0 ? void 0 : message.text, 'back', true)) {
                ctx.wizard.state.activity = 'profile_edit_option_view';
                return ctx.reply(...profileFormatter.editOptions());
            }
            if (state.editField == 'display_name') {
                const { status, isDisplayNameTaken, message: errorMsg } = yield profileService.isDisplayNameTaken(message.text);
                if (status == 'fail')
                    return ctx.reply(errorMsg);
                if (isDisplayNameTaken)
                    return ctx.reply(profileFormatter.messages.displayNameTakenMsg);
            }
            const validationMessage = (0, profile_validator_1.profileValidator)(state.editField, message.text);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            if (state.editField == 'age')
                state.userData[state.editField] = (0, date_1.calculateAge)(ctx.message.text);
            else
                state.userData[state.editField] = message.text;
            const newData = yield profileService.updateProfile(state.userData.id, {
                bio: state.userData.bio,
                gender: state.userData.gender,
                display_name: state.userData.display_name,
                city: state.userData.city,
                country: state.userData.country,
                email: state.userData.email,
                age: parseInt(state.userData.age.toString()),
            });
            this.saveToState(ctx, newData);
            ctx.wizard.state.activity = 'preview';
            yield (0, dialog_1.displayDialog)(ctx, profileFormatter.updateProfileMessage(state.editField));
            return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
        });
    }
    followingList(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(profileFormatter.messages.useButtonError);
            switch (callbackQuery.data) {
                case 'back': {
                    ctx.wizard.state.activity = 'preview';
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
                }
            }
        });
    }
    followersList(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(profileFormatter.messages.useButtonError);
            switch (callbackQuery.data) {
                case 'back': {
                    ctx.wizard.state.activity = 'preview';
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
                }
            }
        });
    }
    postList(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(profileFormatter.messages.useButtonError);
            switch (callbackQuery.data) {
                case 'cancel': {
                    ctx.wizard.state.activity = 'preview';
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
                }
            }
        });
    }
    settingPreview(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(profileFormatter.messages.useButtonError);
            switch (callbackQuery.data) {
                case 'back': {
                    ctx.wizard.state.activity = 'preview';
                    (0, chat_1.deleteMessageWithCallback)(ctx);
                    return ctx.reply(...profileFormatter.preview(ctx.wizard.state.userData));
                }
                case 'notify_setting': {
                    ctx.wizard.state.activity = 'notify_setting';
                    (0, chat_1.deleteMessageWithCallback)(ctx);
                    return ctx.reply(...profileFormatter.notifyOptionDisplay(ctx.wizard.state.userData.notify_option, true));
                }
            }
        });
    }
    changeNotifSetting(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = (0, chat_1.findSender)(ctx);
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(profileFormatter.messages.useButtonError);
            if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                ctx.wizard.state.activity = 'profile_setting';
                (0, chat_1.deleteMessageWithCallback)(ctx);
                return ctx.reply(...profileFormatter.settingDisplay());
            }
            const [_, message] = callbackQuery.data.split('_');
            const { success } = yield profileService.updateNotifySettingByTgId(sender.id.toString(), message);
            if (!success)
                return ctx.reply(profileFormatter.messages.updateNotifyOptionError);
            ctx.wizard.state.userData.notify_option = message;
            return ctx.editMessageReplyMarkup({
                inline_keyboard: profileFormatter.notifyOptionDisplay(message),
            });
        });
    }
    sendMessage(ctx, receiver_id, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = (0, chat_1.findSender)(ctx);
            const userData = yield profileService.getProfileDataWithTgId(sender.id);
            if ((userData === null || userData === void 0 ? void 0 : userData.display_name) == null) {
                ctx.wizard.state.activity = 'update_display_name';
                return ctx.reply(...(yield profileFormatter.editPrompt('display_name', ctx.wizard.state.userData.gender)));
            }
        });
    }
    replyToMessage(ctx, receiver_id, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = (0, chat_1.findSender)(ctx);
            const userData = yield profileService.getProfileDataWithTgId(sender.id);
            if ((userData === null || userData === void 0 ? void 0 : userData.display_name) == null) {
                ctx.wizard.state.activity = 'update_display_name';
                return ctx.reply(...(yield profileFormatter.editPrompt('display_name', ctx.wizard.state.userData.gender)));
            }
        });
    }
    updateDisplayName(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = ctx.message;
            if (!message)
                return yield ctx.reply('Enter string for name');
            const { status, isDisplayNameTaken, message: errorMsg } = yield profileService.isDisplayNameTaken(message.text);
            if (status == 'fail')
                return ctx.reply(errorMsg);
            if (isDisplayNameTaken)
                return ctx.reply(profileFormatter.messages.displayNameTakenMsg);
        });
    }
    handleOpenPost(ctx, post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = ctx.callbackQuery.message;
            const message_id = message.message_id;
            const chat_id = message.chat.id;
            const { data, status } = yield profileService.updatePostStatusByUser(post_id, 'open');
            if (status == 'fail')
                return ctx.reply('Unable to  Open the post ');
            const response = profileFormatter.postPreview(data);
            const [messageText, buttons] = response;
            return yield ctx.telegram.editMessageText(chat_id, // Chat ID
            message_id, undefined, // Message ID
            messageText, // New text to set
            {
                reply_markup: buttons === null || buttons === void 0 ? void 0 : buttons.reply_markup,
                parse_mode: 'HTML',
            });
        });
    }
    handleClosePost(ctx, post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = ctx.callbackQuery.message;
            const message_id = message.message_id;
            const chat_id = message.chat.id;
            const { data, status } = yield profileService.updatePostStatusByUser(post_id, 'closed');
            if (status == 'fail')
                return ctx.reply('Unable to  Close  the post ');
            const response = profileFormatter.postPreview(data);
            const [messageText, buttons] = response;
            return yield ctx.telegram.editMessageText(chat_id, // Chat ID
            message_id, undefined, // Message ID
            messageText, // New text to set
            {
                reply_markup: buttons === null || buttons === void 0 ? void 0 : buttons.reply_markup,
                parse_mode: 'HTML',
            });
        });
    }
    handleCancelPost(ctx, post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield post_service_1.default.deletePostById(post_id);
            if (deleted) {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                return ctx.reply('Post Cancelled');
            }
            else {
                return ctx.reply('Unable to  cancelled the post ');
            }
        });
    }
}
exports.default = ProfileController;
//# sourceMappingURL=profile.controller.js.map