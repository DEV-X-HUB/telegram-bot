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
const dialog_1 = require("../../../../ui/dialog");
const chat_1 = require("../../../../utils/helpers/chat");
const string_1 = require("../../../../utils/helpers/string");
const post_validaor_1 = require("../../../../utils/validator/post-validaor");
const mainmenu_controller_1 = __importDefault(require("../../../mainmenu/mainmenu.controller"));
const profile_service_1 = __importDefault(require("../../../profile/profile.service"));
const post_service_1 = __importDefault(require("../../post.service"));
const chicken_farm_formatter_1 = __importDefault(require("./chicken-farm.formatter"));
const chicken_farm_service_1 = __importDefault(require("./chicken-farm.service"));
const postService = new post_service_1.default();
const chickenFarmFormatter = new chicken_farm_formatter_1.default();
const profileService = new profile_service_1.default();
class ChickenFarmController {
    constructor() { }
    start(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.wizard.state.category = 'ChickenFarm';
            yield ctx.reply(...chickenFarmFormatter.sectorPrompt());
            return ctx.wizard.next();
        });
    }
    enterSector(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = ctx.message.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                yield (0, chat_1.deleteKeyboardMarkup)(ctx);
                return ctx.scene.leave();
            }
            const validationMessage = (0, post_validaor_1.postValidator)('title', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.sector = message;
            yield (0, chat_1.deleteKeyboardMarkup)(ctx, 'What is the estimated capital?');
            yield ctx.reply(...chickenFarmFormatter.estimatedCapitalPrompt());
            return ctx.wizard.next();
        });
    }
    chooseEstimatedCapital(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (callbackQuery) {
                if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                    yield ctx.reply(...chickenFarmFormatter.sectorPrompt());
                    return ctx.wizard.back();
                }
                if ((0, string_1.isInInlineOption)(callbackQuery.data, chickenFarmFormatter.estimatedCapitalOption)) {
                    ctx.wizard.state.estimated_capital = callbackQuery.data;
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.reply(...chickenFarmFormatter.enterpriseNamePrompt());
                    return ctx.wizard.next();
                }
            }
            else {
                yield ctx.reply(...chickenFarmFormatter.inputError());
            }
        });
    }
    enterEnterpriseName(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = ctx.message.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                yield ctx.reply(...chickenFarmFormatter.estimatedCapitalPrompt());
                return ctx.wizard.back();
            }
            const validationMessage = (0, post_validaor_1.postValidator)('title', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.enterprise_name = message;
            yield ctx.reply(...chickenFarmFormatter.descriptionPrompt());
            return ctx.wizard.next();
        });
    }
    enterDescription(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = (0, chat_1.findSender)(ctx);
            const message = ctx.message.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                yield ctx.reply(...chickenFarmFormatter.enterpriseNamePrompt());
                return ctx.wizard.back();
            }
            const validationMessage = (0, post_validaor_1.postValidator)('description', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            const user = yield profileService.getProfileByTgId(sender.id);
            if (user) {
                ctx.wizard.state.user = {
                    id: user.id,
                    display_name: user.display_name,
                };
            }
            if (!user)
                return yield ctx.reply(...chickenFarmFormatter.somethingWentWrongError());
            ctx.wizard.state.user = {
                id: user === null || user === void 0 ? void 0 : user.id,
                display_name: user === null || user === void 0 ? void 0 : user.display_name,
            };
            ctx.wizard.state.description = message;
            ctx.wizard.state.status = 'preview';
            ctx.wizard.state.notify_option = (user === null || user === void 0 ? void 0 : user.notify_option) || 'none';
            yield ctx.replyWithHTML(...chickenFarmFormatter.preview(ctx.wizard.state));
            return ctx.wizard.next();
        });
    }
    preview(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const user = (0, chat_1.findSender)(ctx);
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery) {
                const message = ctx.message.text;
                if (message == 'Back') {
                    yield ctx.reply(...chickenFarmFormatter.descriptionPrompt(), chickenFarmFormatter.goBackButton());
                    return ctx.wizard.back();
                }
                yield ctx.reply('....');
            }
            else {
                const state = ctx.wizard.state;
                switch (callbackQuery.data) {
                    case 'preview_edit': {
                        console.log('preview edit');
                        ctx.wizard.state.editField = null;
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        ctx.replyWithHTML(...chickenFarmFormatter.editPreview(state), { parse_mode: 'HTML' });
                        return ctx.wizard.selectStep(7);
                    }
                    case 'editing_done': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.replyWithHTML(chickenFarmFormatter.preview(state));
                        return ctx.wizard.selectStep(5);
                    }
                    case 'post_data': {
                        const postDto = {
                            category: ctx.wizard.state.category,
                            sector: ctx.wizard.state.sector,
                            estimated_capital: ctx.wizard.state.estimated_capital,
                            enterprise_name: ctx.wizard.state.enterprise_name,
                            description: ctx.wizard.state.description,
                            notify_option: ctx.wizard.state.notify_option,
                            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
                        };
                        const response = yield post_service_1.default.createCategoryPost(postDto, callbackQuery.from.id);
                        if (response === null || response === void 0 ? void 0 : response.success) {
                            ctx.wizard.state.post_id = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id;
                            ctx.wizard.state.post_main_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.post_id;
                            // await deleteMessageWithCallback(ctx);
                            // await ctx.reply(...chickenFarmFormatter.postingSuccessful());
                            yield (0, dialog_1.displayDialog)(ctx, chickenFarmFormatter.messages.postSuccessMsg, true);
                            yield (0, chat_1.deleteMessageWithCallback)(ctx);
                            yield ctx.replyWithHTML(...chickenFarmFormatter.preview(ctx.wizard.state, 'submitted'), {
                                parse_mode: 'HTML',
                            });
                            return ctx.wizard.selectStep(8);
                            // return MainMenuController.onStart(ctx);
                        }
                        else {
                            ctx.reply(...chickenFarmFormatter.postingError());
                            if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
                                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                                ctx.scene.leave();
                                return mainmenu_controller_1.default.onStart(ctx);
                            }
                            // increment the registration attempt
                            return (ctx.wizard.state.postingAttempt = ctx.wizard.state.postingAttempt
                                ? parseInt(ctx.wizard.state.postingAttempt) + 1
                                : 1);
                        }
                    }
                    // default: {
                    //   await ctx.reply('DEFAULT');
                    // }
                    case 'mention_previous_post': {
                        // fetch previous posts of the user
                        const { posts, success, message } = yield post_service_1.default.getUserPostsByTgId(user.id);
                        if (!success || !posts) {
                            // remove past post
                            yield (0, chat_1.deleteMessageWithCallback)(ctx);
                            return yield ctx.reply(message);
                        }
                        if (posts.length == 0) {
                            yield (0, chat_1.deleteMessageWithCallback)(ctx);
                            return yield ctx.reply(...chickenFarmFormatter.noPostsErrorMessage());
                        }
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.reply(...chickenFarmFormatter.mentionPostMessage());
                        for (const post of posts) {
                            yield ctx.replyWithHTML(...chickenFarmFormatter.displayPreviousPostsList(post));
                        }
                        return ctx.wizard.next();
                    }
                    case 'remove_mention_previous_post': {
                        state.mention_post_data = '';
                        state.mention_post_id = '';
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        return ctx.replyWithHTML(...chickenFarmFormatter.preview(state));
                    }
                    case 'notify_settings': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.reply(...chickenFarmFormatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
                        return ctx.wizard.selectStep(9);
                    }
                    case 'back': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        ctx.wizard.back();
                        return yield ctx.replyWithHTML(...chickenFarmFormatter.preview(state));
                    }
                }
            }
        });
    }
    mentionPreviousPost(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = ctx.wizard.state;
            const callbackQuery = ctx.callbackQuery;
            if (callbackQuery) {
                if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                    yield ctx.replyWithHTML(...chickenFarmFormatter.preview(ctx.wizard.state));
                    return ctx.wizard.back();
                }
                if (callbackQuery.data.startsWith('select_post_')) {
                    const post_id = callbackQuery.data.split('_')[2];
                    state.mention_post_id = post_id;
                    state.mention_post_data = ctx.callbackQuery.message.text;
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.replyWithHTML(...chickenFarmFormatter.preview(state));
                    return ctx.wizard.back();
                }
            }
        });
    }
    editData(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const state = ctx.wizard.state;
            const fileds = ['sector', 'estimated_capital', 'enterprise_name', 'description', 'cancel', 'done'];
            const callbackQuery = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery;
            const editField = (_a = ctx.wizard.state) === null || _a === void 0 ? void 0 : _a.editField;
            if (!callbackQuery) {
                // changing field value
                const messageText = ctx.message.text;
                if (!editField)
                    return yield ctx.reply('invalid input ');
                // const validationMessage = questionPostValidator(ctx.wizard.state.editField, ctx.message.text);
                // if (validationMessage != 'valid') return await ctx.reply(validationMessage);
                ctx.wizard.state[editField] = messageText;
                yield (0, chat_1.deleteKeyboardMarkup)(ctx);
                // await deleteMessage(ctx, {
                //   message_id: (parseInt(ctx.message.message_id) - 1).toString(),
                //   chat_id: ctx.message.chat.id,
                // });
                return ctx.replyWithHTML(...chickenFarmFormatter.editPreview(state), { parse_mode: 'HTML' });
            }
            // if callback exists
            // save the mesage id for later deleting
            ctx.wizard.state.previousMessageData = {
                message_id: ctx.callbackQuery.message.message_id,
                chat_id: ctx.callbackQuery.message.chat.id,
            };
            const callbackMessage = callbackQuery.data;
            if (callbackMessage == 'post_data') {
                // console.log('Posted Successfully');
                // await displayDialog(ctx, 'Posted successfully');
                // ctx.scene.leave();
                // return MainMenuController.onStart(ctx);
                // return ctx.reply(...chickenFarmFormatter.postingSuccessful());
                // registration
                // api call for registration
                const response = yield chicken_farm_service_1.default.createChickenFarmPost(ctx.wizard.state, callbackQuery.from.id);
                if (response.success) {
                    ctx.wizard.state.status = 'pending';
                    yield ctx.reply(...chickenFarmFormatter.postingSuccessful());
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.replyWithHTML(...chickenFarmFormatter.preview(ctx.wizard.state, 'submitted'), {
                        parse_mode: 'HTML',
                    });
                    yield (0, dialog_1.displayDialog)(ctx, 'Posted succesfully');
                    // jump to posted review
                    return ctx.wizard.selectStep(8);
                }
                const registrationAttempt = parseInt(ctx.wizard.state.registrationAttempt);
                // ctx.reply(...postingFormatter.postingError());
                if (registrationAttempt >= 2) {
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    ctx.scene.leave();
                    return mainmenu_controller_1.default.onStart(ctx);
                }
                return (ctx.wizard.state.registrationAttempt = registrationAttempt ? registrationAttempt + 1 : 1);
            }
            else if (callbackMessage == 'editing_done') {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.replyWithHTML(...chickenFarmFormatter.preview(state));
                return ctx.wizard.selectStep(5);
            }
            // else if (callbackMessage =='mention_previous_post'){
            //   // fetch previous posts
            //   const posts = await Section4ChickenFarmService.getPostsOfUser(callbackQuery.from.id)
            // }
            else if (callbackMessage == 'mention_previous_post') {
                console.log('mention_previous_post2');
                yield ctx.reply('mention_previous_post');
                // fetch previous posts of the user
                const posts = yield chicken_farm_service_1.default.getPostsOfUser(callbackQuery.from.id);
                console.log(posts.posts);
                // if (!posts) {
                //   return await ctx.reply(chickenFarmFormatter.noPostsErrorMessage);
                // }
                // await ctx.reply(...chickenFarmFormatter.mentionPostMessage());
                // return await ctx.reply(...chickenFarmFormatter.displayPreviousPostsList(posts.posts));
            }
            // if user chooses a field to edit
            if (fileds.some((filed) => filed == callbackQuery.data)) {
                // selecting field to change
                ctx.wizard.state.editField = callbackMessage;
                yield ctx.telegram.deleteMessage(ctx.wizard.state.previousMessageData.chat_id, ctx.wizard.state.previousMessageData.message_id);
                yield ctx.replyWithHTML(...(yield chickenFarmFormatter.editFieldDisplay(callbackMessage)));
                return;
            }
        });
    }
    postedReview(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return;
            switch (callbackQuery.data) {
                case 're_submit_post': {
                    const postDto = {
                        category: ctx.wizard.state.category,
                        sector: ctx.wizard.state.sector,
                        estimated_capital: ctx.wizard.state.estimated_capital,
                        enterprise_name: ctx.wizard.state.enterprise_name,
                        description: ctx.wizard.state.description,
                        notify_option: ctx.wizard.state.notify_option,
                        previous_post_id: ctx.wizard.state.mention_post_id || undefined,
                    };
                    const response = yield post_service_1.default.createCategoryPost(postDto, callbackQuery.from.id);
                    if (!(response === null || response === void 0 ? void 0 : response.success))
                        yield ctx.reply('Unable to resubmite');
                    ctx.wizard.state.post_id = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id;
                    ctx.wizard.state.post_main_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.post_id;
                    yield (0, dialog_1.displayDialog)(ctx, chickenFarmFormatter.messages.postResubmit);
                    return ctx.editMessageReplyMarkup({
                        inline_keyboard: [
                            [{ text: 'Cancel', callback_data: `cancel_post` }],
                            [{ text: 'Main menu', callback_data: 'main_menu' }],
                        ],
                    });
                }
                case 'cancel_post': {
                    console.log(ctx.wizard.state);
                    const deleted = yield post_service_1.default.deletePostById(ctx.wizard.state.post_main_id);
                    console.log(`deleted  ${deleted}`);
                    if (!deleted)
                        return yield ctx.reply('Unable to cancel the post ');
                    yield (0, dialog_1.displayDialog)(ctx, chickenFarmFormatter.messages.postCancelled);
                    return ctx.editMessageReplyMarkup({
                        inline_keyboard: [
                            [{ text: 'Resubmit', callback_data: `re_submit_post` }],
                            [{ text: 'Main menu', callback_data: 'main_menu' }],
                        ],
                    });
                }
                case 'main_menu': {
                    (0, chat_1.deleteMessageWithCallback)(ctx);
                    ctx.scene.leave();
                    return mainmenu_controller_1.default.onStart(ctx);
                }
            }
        });
    }
    adjustNotifySetting(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            let notify_option = '';
            if (!callbackQuery)
                return;
            switch (callbackQuery.data) {
                case 'notify_none': {
                    ctx.wizard.state.notify_option = 'none';
                    notify_option = 'none';
                    break;
                }
                case 'notify_friend': {
                    ctx.wizard.state.notify_option = 'friend';
                    notify_option = 'friends';
                    break;
                }
                case 'notify_follower': {
                    ctx.wizard.state.notify_option = 'follower';
                    notify_option = 'followers';
                    break;
                }
            }
            yield (0, dialog_1.displayDialog)(ctx, chickenFarmFormatter.messages.notifySettingChanged.concat(` to  ${notify_option.toUpperCase()}`));
            yield (0, chat_1.deleteMessageWithCallback)(ctx);
            yield ctx.replyWithHTML(...chickenFarmFormatter.preview(ctx.wizard.state));
            return ctx.wizard.selectStep(5);
        });
    }
}
exports.default = ChickenFarmController;
//# sourceMappingURL=chicken-farm.controller.js.map