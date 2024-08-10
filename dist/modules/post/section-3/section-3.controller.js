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
const config_1 = __importDefault(require("../../../config/config"));
const dialog_1 = require("../../../ui/dialog");
const chat_1 = require("../../../utils/helpers/chat");
const string_1 = require("../../../utils/helpers/string");
const post_validaor_1 = require("../../../utils/validator/post-validaor");
const mainmenu_controller_1 = __importDefault(require("../../mainmenu/mainmenu.controller"));
const profile_service_1 = __importDefault(require("../../profile/profile.service"));
const post_service_1 = __importDefault(require("../post.service"));
const section_3_formatter_1 = __importDefault(require("./section-3.formatter"));
const section3Formatter = new section_3_formatter_1.default();
let imagesUploaded = [];
let imagesUploadedURL = [];
const profileService = new profile_service_1.default();
class Section3Controller {
    constructor() {
        this.imageCounter = [];
    }
    setImageWaiting(ctx) {
        const sender = (0, chat_1.findSender)(ctx);
        if (this.isWaitingImages(sender.id))
            return;
        this.imageTimer = setTimeout(() => {
            this.sendImageWaitingPrompt(ctx);
        }, parseInt(config_1.default.image_upload_minute.toString()) * 60 * 1000);
        this.imageCounter.push({ id: sender.id, waiting: true });
    }
    clearImageWaiting(id) {
        this.imageCounter = this.imageCounter.filter(({ id: counterId }) => counterId != id);
    }
    isWaitingImages(id) {
        const exists = this.imageCounter.find(({ id: counterId }) => counterId == id);
        return exists != undefined;
    }
    sendImageWaitingPrompt(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = (0, chat_1.findSender)(ctx);
            if (this.isWaitingImages(sender.id))
                yield ctx.reply(section3Formatter.messages.imageWaitingMsg);
        });
    }
    start(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.wizard.state.category = 'Section3';
            yield (0, chat_1.deleteKeyboardMarkup)(ctx, 'choose an option');
            yield ctx.reply(...section3Formatter.birthOrMaritalOptionDisplay());
            return ctx.wizard.next();
        });
    }
    chooseBirthOrMarital(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            // if the user is using the inline keyboard
            if (callbackQuery) {
                if (callbackQuery.data && (0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                    (0, chat_1.deleteMessageWithCallback)(ctx);
                    // leave this scene a
                    ctx.scene.leave();
                    return mainmenu_controller_1.default.onStart(ctx);
                }
                if ((0, string_1.isInInlineOption)(callbackQuery.data, section3Formatter.birthOrMaritalOption)) {
                    ctx.wizard.state.birth_or_marital = callbackQuery.data;
                    (0, chat_1.deleteMessageWithCallback)(ctx);
                    ctx.reply(...section3Formatter.titlePrompt());
                    return ctx.wizard.next();
                }
            }
            else {
                yield ctx.reply(...section3Formatter.displayError());
                // stay on the same step
                // return ctx.wizard.steps[ctx.wizard.cursor](ctx);
            }
        });
    }
    enterTitle(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                ctx.reply(...section3Formatter.birthOrMaritalOptionDisplay());
                return ctx.wizard.back();
            }
            const validationMessage = (0, post_validaor_1.postValidator)('title', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.title = message;
            yield ctx.reply(...section3Formatter.descriptionPrompt());
            return ctx.wizard.next();
        });
    }
    enterDescription(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = ctx.message.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                ctx.reply(...section3Formatter.birthOrMaritalOptionDisplay());
                return ctx.wizard.back();
            }
            const validationMessage = (0, post_validaor_1.postValidator)('description', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.description = message;
            yield ctx.reply(...section3Formatter.photoPrompt(ctx.wizard.state.birth_or_marital == 'birth'));
            return ctx.wizard.next();
        });
    }
    attachPhoto(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const sender = (0, chat_1.findSender)(ctx);
            const message = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if ((_b = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _b === void 0 ? void 0 : _b.document)
                return ctx.reply(`Please only upload compressed images`);
            this.setImageWaiting(ctx);
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                yield (0, chat_1.deleteKeyboardMarkup)(ctx, section3Formatter.messages.descriptionPrompt);
                ctx.reply(...section3Formatter.descriptionPrompt());
                this.clearImageWaiting(sender.id);
                return ctx.wizard.back();
            }
            const user = yield profileService.getProfileByTgId(sender.id);
            if (user) {
                ctx.wizard.state.user = {
                    id: user.id,
                    display_name: user.display_name,
                };
            }
            if (!user)
                return yield ctx.reply(...section3Formatter.somethingWentWrong());
            ctx.wizard.state.user = {
                id: user === null || user === void 0 ? void 0 : user.id,
                display_name: user === null || user === void 0 ? void 0 : user.display_name,
            };
            ctx.wizard.state.notify_option = (user === null || user === void 0 ? void 0 : user.notify_option) || 'none';
            if (message && (0, string_1.areEqaul)(message, 'skip', true)) {
                this.clearImageWaiting(sender.id);
                ctx.wizard.state.photo = [];
                ctx.wizard.state.status = 'preview';
                yield (0, chat_1.deleteKeyboardMarkup)(ctx, section3Formatter.preview(ctx.wizard.state)[0]);
                ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                return ctx.wizard.next();
            }
            // check if image is attached
            if (!ctx.message.photo)
                return ctx.reply(...section3Formatter.photoPrompt(ctx.wizard.state.birth_or_marital == 'birth'));
            // Add the image to the array
            const photo_id = ctx.message.photo[0].file_id;
            const photo_url = yield ctx.telegram.getFileLink(photo_id);
            imagesUploaded.push(photo_id);
            imagesUploadedURL.push(photo_url.href);
            // Check if all images received
            if (imagesUploaded.length == section3Formatter.imagesNumber) {
                this.clearImageWaiting(sender.id);
                const file = yield ctx.telegram.getFile(ctx.message.photo[0].file_id);
                // console.log(file);
                yield (0, chat_1.deleteKeyboardMarkup)(ctx, section3Formatter.preview(ctx.wizard.state)[0]);
                yield (0, chat_1.sendMediaGroup)(ctx, imagesUploaded, 'Here are the images you uploaded');
                // Find the user
                // Save the images to the state
                ctx.wizard.state.photo = imagesUploaded;
                ctx.wizard.state.photo_url = imagesUploadedURL;
                ctx.wizard.state.status = 'preview';
                // empty the images array
                imagesUploaded = [];
                ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                return ctx.wizard.next();
            }
        });
    }
    preview(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const callbackQuery = ctx.callbackQuery;
            const user = (0, chat_1.findSender)(ctx);
            if (!callbackQuery) {
                const message = ctx.message.text;
                if (message == 'Back') {
                    yield ctx.reply(...section3Formatter.photoPrompt(ctx.wizard.state.birth_or_marital == 'birth'), section3Formatter.goBackButton());
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
                        ctx.replyWithHTML(...section3Formatter.editPreview(state), { parse_mode: 'HTML' });
                        return ctx.wizard.next();
                    }
                    case 'editing_done': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.replyWithHTML(section3Formatter.preview(state));
                        return ctx.wizard.back();
                    }
                    case 'post_data': {
                        const postDto = {
                            birth_or_marital: state.birth_or_marital,
                            title: ctx.wizard.state.title,
                            description: ctx.wizard.state.description,
                            photo: ctx.wizard.state.photo,
                            photo_url: ctx.wizard.state.photo_url,
                            notify_option: ctx.wizard.state.notify_option,
                            category: 'Section 3',
                            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
                        };
                        const response = yield post_service_1.default.createCategoryPost(postDto, callbackQuery.from.id);
                        if (response === null || response === void 0 ? void 0 : response.success) {
                            ctx.wizard.state.post_id = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id;
                            ctx.wizard.state.post_main_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.post_id;
                            yield (0, chat_1.deleteMessageWithCallback)(ctx);
                            yield (0, dialog_1.displayDialog)(ctx, section3Formatter.messages.postSuccessMsg, true);
                            if (ctx.wizard.state.photo.length > 0) {
                                const elements = (0, string_1.extractElements)(ctx.wizard.state.photo);
                                const [caption, button] = section3Formatter.preview(ctx.wizard.state, 'submitted');
                                if (elements) {
                                    // if array of elelement has many photos
                                    yield (0, chat_1.sendMediaGroup)(ctx, elements.firstNMinusOne, 'Images Uploaded with post');
                                    yield (0, chat_1.replyPostPreview)({
                                        ctx,
                                        photoURl: elements.lastElement,
                                        caption: caption,
                                    });
                                }
                                else {
                                    // if array of  has one  photo
                                    yield (0, chat_1.replyPostPreview)({
                                        ctx,
                                        photoURl: ctx.wizard.state.photo[0],
                                        caption: caption,
                                    });
                                }
                            }
                            else {
                                yield ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state, 'submitted'), {
                                    parse_mode: 'HTML',
                                });
                            }
                            // jump to posted review
                            return ctx.wizard.selectStep(8);
                        }
                        else {
                            ctx.reply(...section3Formatter.postingError());
                            if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
                                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                                ctx.scene.leave();
                                return mainmenu_controller_1.default.onStart(ctx);
                            }
                            if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
                                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                                return ctx.scene.enter('start');
                            }
                            // increment the registration attempt
                            return (ctx.wizard.state.postingAttempt = ctx.wizard.state.postingAttempt
                                ? parseInt(ctx.wizard.state.postingAttempt) + 1
                                : 1);
                        }
                    }
                    case 'cancel': {
                        ctx.wizard.state.status = 'Cancelled';
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state, 'Cancelled'), {
                            parse_mode: 'HTML',
                        });
                        return ctx.wizard.selectStep(8);
                    }
                    case 'notify_settings': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.reply(...section3Formatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
                        // jump to notify setting
                        return ctx.wizard.selectStep(9);
                    }
                    case 'mention_previous_post': {
                        // fetch previous posts of the user
                        const { posts, success, message } = yield post_service_1.default.getUserPostsByTgId(user.id);
                        if (!success || !posts)
                            return yield ctx.reply(message);
                        if (posts.length == 0)
                            return yield ctx.reply(...section3Formatter.noPostsErrorMessage());
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.reply(...section3Formatter.mentionPostMessage());
                        for (const post of posts) {
                            yield ctx.replyWithHTML(...section3Formatter.displayPreviousPostsList(post));
                        }
                        // jump to mention previous post
                        return ctx.wizard.selectStep(10);
                    }
                    case 'remove_mention_previous_post': {
                        state.mention_post_data = '';
                        state.mention_post_id = '';
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                        // return to preview
                        return ctx.wizard.selectStep(5);
                    }
                    default: {
                        yield ctx.reply('Unknown action');
                    }
                    // default: {
                    //   await ctx.reply('DEFAULT');
                    // }
                }
            }
        });
    }
    editData(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const state = ctx.wizard.state;
            const fileds = ['birth_or_marital', 'title', 'description', 'photo', 'cancel'];
            const callbackQuery = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery;
            const editField = (_a = ctx.wizard.state) === null || _a === void 0 ? void 0 : _a.editField;
            if (!callbackQuery) {
                // changing field value
                const messageText = ctx.message.text;
                if (!editField)
                    return yield ctx.reply('invalid input ');
                if ((0, string_1.areEqaul)(messageText, 'back', true)) {
                    ctx.wizard.state.editField = null;
                    return ctx.replyWithHTML(...section3Formatter.editPreview(state));
                }
                const validationMessage = (0, post_validaor_1.postValidator)(editField, messageText);
                if (validationMessage != 'valid')
                    return yield ctx.reply(validationMessage);
                ctx.wizard.state[editField] = messageText;
                yield (0, chat_1.deleteKeyboardMarkup)(ctx, section3Formatter.preview(ctx.wizard.state)[0]);
                return ctx.replyWithHTML(...section3Formatter.editPreview(state), { parse_mode: 'HTML' });
            }
            // if callback exists
            // save the mesage id for later deleting
            ctx.wizard.state.previousMessageData = {
                message_id: ctx.callbackQuery.message.message_id,
                chat_id: ctx.callbackQuery.message.chat.id,
            };
            const callbackMessage = callbackQuery.data;
            if ((0, string_1.areEqaul)(callbackMessage, 'back', true)) {
                ctx.wizard.state.editField = null;
                return ctx.replyWithHTML(...section3Formatter.editPreview(state));
            }
            if (callbackMessage == 'editing_done' || callbackMessage == 'cancel_edit') {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.replyWithHTML(...section3Formatter.preview(state));
                return ctx.wizard.back();
            }
            if (callbackMessage == 'editing_done') {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.replyWithHTML(...section3Formatter.preview(state));
                return ctx.wizard.back();
            }
            if (fileds.some((filed) => filed == callbackQuery.data)) {
                // selecting field to change
                ctx.wizard.state.editField = callbackMessage;
                yield ctx.telegram.deleteMessage(ctx.wizard.state.previousMessageData.chat_id, ctx.wizard.state.previousMessageData.message_id);
                yield ctx.reply(...(yield section3Formatter.editFieldDisplay(callbackMessage, ctx.wizard.state.birth_or_marital == 'birth')));
                if ((0, string_1.areEqaul)(callbackQuery.data, 'photo', true))
                    return ctx.wizard.next();
                return;
            }
            if (editField) {
                //  if edit filed is selected
                ctx.wizard.state[editField] = callbackMessage;
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.wizard.state.editField = null;
                return ctx.replyWithHTML(...section3Formatter.editPreview(state), { parse_mode: 'HTML' });
            }
        });
    }
    editPhoto(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const sender = (0, chat_1.findSender)(ctx);
            const messageText = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            this.setImageWaiting(ctx);
            if (ctx.message.document)
                return ctx.reply(`Please only upload compressed images`);
            if (messageText && ((0, string_1.areEqaul)(messageText, 'skip', true) || (0, string_1.areEqaul)(messageText, 'back', true))) {
                yield (0, chat_1.deleteKeyboardMarkup)(ctx, section3Formatter.preview(ctx.wizard.state)[0]);
                ctx.reply(...section3Formatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
                this.clearImageWaiting(sender.id);
                return ctx.wizard.back();
            }
            // check if image is attached
            if (!ctx.message.photo)
                return ctx.reply(...section3Formatter.photoPrompt(ctx.wizard.state.birth_or_marital == 'birth'));
            // Add the image to the array
            const photo_id = ctx.message.photo[0].file_id;
            const photo_url = yield ctx.telegram.getFileLink(photo_id);
            imagesUploaded.push(photo_id);
            imagesUploadedURL.push(photo_url.href);
            // Check if all images received
            if (imagesUploaded.length === section3Formatter.imagesNumber) {
                this.clearImageWaiting(sender.id);
                const file = yield ctx.telegram.getFile(ctx.message.photo[0].file_id);
                yield (0, chat_1.deleteKeyboardMarkup)(ctx, section3Formatter.preview(ctx.wizard.state)[0]);
                yield (0, chat_1.sendMediaGroup)(ctx, imagesUploaded, 'Here are the images you uploaded');
                // Save the images to the state
                ctx.wizard.state.photo = imagesUploaded;
                ctx.wizard.state.photo_url = imagesUploadedURL;
                // empty the images array
                // imagesUploaded.length = 0;
                ctx.replyWithHTML(...section3Formatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
                return ctx.wizard.back();
            }
        });
    }
    postReview(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return;
            switch (callbackQuery.data) {
                case 're_submit_post': {
                    const postDto = {
                        birth_or_marital: ctx.wizard.state.birth_or_marital,
                        title: ctx.wizard.state.title,
                        photo: ctx.wizard.state.photo,
                        photo_url: ctx.wizard.state.photo_url,
                        description: ctx.wizard.state.description,
                        category: 'Section 3',
                        notify_option: ctx.wizard.state.notify_option,
                        previous_post_id: ctx.wizard.state.mention_post_id || undefined,
                    };
                    const response = yield post_service_1.default.createCategoryPost(postDto, callbackQuery.from.id);
                    if (!(response === null || response === void 0 ? void 0 : response.success))
                        return yield ctx.reply('Unable to resubmite');
                    ctx.wizard.state.post_id = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id;
                    ctx.wizard.state.post_main_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.post_id;
                    yield (0, dialog_1.displayDialog)(ctx, section3Formatter.messages.postResubmit);
                    return ctx.editMessageReplyMarkup({
                        inline_keyboard: [
                            [{ text: 'Cancel', callback_data: `cancel_post` }],
                            [{ text: 'Main menu', callback_data: 'main_menu' }],
                        ],
                    });
                }
                case 'cancel_post': {
                    const deleted = yield post_service_1.default.deletePostById(ctx.wizard.state.post_main_id, 'Section 1A');
                    if (!deleted)
                        return yield ctx.reply('Unable to cancel the post ');
                    yield (0, dialog_1.displayDialog)(ctx, section3Formatter.messages.postCancelled);
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
            yield (0, dialog_1.displayDialog)(ctx, section3Formatter.messages.notifySettingChanged.concat(` to  ${notify_option.toUpperCase()}`));
            yield (0, chat_1.deleteMessageWithCallback)(ctx);
            yield ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state));
            return ctx.wizard.selectStep(5);
        });
    }
    mentionPreviousPost(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return;
            if (callbackQuery) {
                if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                    return ctx.wizard.back();
                }
                if (callbackQuery.data.startsWith('select_post_')) {
                    const post_id = callbackQuery.data.split('_')[2];
                    ctx.wizard.state.mention_post_id = post_id;
                    ctx.wizard.state.mention_post_data = ctx.callbackQuery.message.text;
                    yield ctx.replyWithHTML(...section3Formatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                    // go back to preview
                    return ctx.wizard.selectStep(5);
                }
            }
        });
    }
}
exports.default = Section3Controller;
//# sourceMappingURL=section-3.controller.js.map