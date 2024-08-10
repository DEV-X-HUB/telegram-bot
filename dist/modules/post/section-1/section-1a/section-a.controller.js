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
const config_1 = __importDefault(require("../../../../config/config"));
const chat_1 = require("../../../../utils/helpers/chat");
const string_1 = require("../../../../utils/helpers/string");
const section_a_formatter_1 = __importDefault(require("./section-a.formatter"));
const post_validaor_1 = require("../../../../utils/validator/post-validaor");
const mainmenu_controller_1 = __importDefault(require("../../../mainmenu/mainmenu.controller"));
const profile_service_1 = __importDefault(require("../../../profile/profile.service"));
const dialog_1 = require("../../../../ui/dialog");
const post_service_1 = __importDefault(require("../../post.service"));
const restgration_service_1 = __importDefault(require("../../../registration/restgration.service"));
const country_list_1 = require("../../../../utils/helpers/country-list");
const image_1 = require("../../../../utils/helpers/image");
const registrationService = new restgration_service_1.default();
const section1AFormatter = new section_a_formatter_1.default();
const profileService = new profile_service_1.default();
let imagesUploaded = [];
let imagesUploadedURL = [];
class QuestionPostSectionAController {
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
                yield ctx.reply(section1AFormatter.messages.imageWaitingMsg);
        });
    }
    start(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, chat_1.deleteKeyboardMarkup)(ctx, section1AFormatter.messages.arBrPromt);
            yield ctx.reply(...section1AFormatter.arBrOptionDisplay());
            return ctx.wizard.next();
        });
    }
    arBrOption(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            const sender = (0, chat_1.findSender)(ctx);
            if (!callbackQuery)
                return ctx.reply(section1AFormatter.messages.useButtonError);
            if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                return ctx.scene.enter('Post-Section-1');
            }
            if ((0, string_1.isInInlineOption)(callbackQuery.data, section1AFormatter.arBrOption)) {
                ctx.wizard.state.arbr_value = callbackQuery.data;
                ctx.wizard.state.category = 'Section 1A';
                const userCountry = yield registrationService.getUserCountry(sender.id);
                const countryCode = (0, country_list_1.getCountryCodeByName)(userCountry);
                ctx.wizard.state.currentRound = 0;
                ctx.wizard.state.countryCode = countryCode;
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.reply(...section1AFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                return ctx.wizard.next();
            }
            return ctx.reply('Unknown option. Please choose a valid option.');
        });
    }
    chooseCity(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(section1AFormatter.messages.useButtonError);
            (0, chat_1.deleteMessageWithCallback)(ctx);
            switch (callbackQuery.data) {
                case 'back': {
                    if (ctx.wizard.state.currentRound == 0) {
                        ctx.reply(...section1AFormatter.arBrOptionDisplay());
                        return ctx.wizard.back();
                    }
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
                    return ctx.reply(...section1AFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                }
                case 'next': {
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
                    return ctx.reply(...section1AFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                }
                default:
                    ctx.wizard.state.currentRound = 0;
                    ctx.wizard.state.city = callbackQuery.data;
                    yield ctx.reply(...section1AFormatter.bIDIOptionDisplay());
                    return ctx.wizard.next();
            }
        });
    }
    IDFirstOption(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(section1AFormatter.messages.useButtonError);
            if (callbackQuery.data && (0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.wizard.state.currentRound = 0;
                ctx.reply(...section1AFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                return ctx.wizard.back();
            }
            if ((0, string_1.isInInlineOption)(callbackQuery.data, section1AFormatter.bIDiOption)) {
                ctx.wizard.state.id_first_option = callbackQuery.data;
                (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.reply(...section1AFormatter.lastDidtitDisplay());
                return ctx.wizard.next();
            }
        });
    }
    enterLastDigit(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                ctx.reply(...section1AFormatter.bIDIOptionDisplay());
                return ctx.wizard.back();
            }
            const validationMessage = (0, post_validaor_1.postValidator)('last_digit', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.last_digit = message;
            ctx.reply(...section1AFormatter.locationDisplay());
            return ctx.wizard.next();
        });
    }
    enterLocation(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                ctx.reply(...section1AFormatter.lastDidtitDisplay());
                return ctx.wizard.back();
            }
            const validationMessage = (0, post_validaor_1.postValidator)('location', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            // assign the location to the state
            ctx.wizard.state.location = message;
            yield ctx.reply(...section1AFormatter.descriptionDisplay());
            return ctx.wizard.next();
        });
    }
    enterDescription(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                ctx.reply(...section1AFormatter.locationDisplay());
                return ctx.wizard.back();
            }
            const validationMessage = (0, post_validaor_1.postValidator)('description', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.description = message;
            ctx.reply(...section1AFormatter.photoDisplay());
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
                yield (0, chat_1.deleteMessage)(ctx, {
                    message_id: (parseInt(ctx.message.message_id) - 1).toString(),
                    chat_id: ctx.message.chat.id,
                });
                this.clearImageWaiting(sender.id);
                ctx.reply(...section1AFormatter.descriptionDisplay());
                return ctx.wizard.back();
            }
            // check if image is attached
            if (!ctx.message.photo)
                return ctx.reply(...section1AFormatter.photoDisplay());
            // Add the image to the array
            const photo_id = ctx.message.photo[0].file_id;
            const photo_url = yield ctx.telegram.getFileLink(photo_id);
            imagesUploaded.push(photo_id);
            imagesUploadedURL.push(photo_url.href);
            // Check if all images received
            if (imagesUploaded.length == section1AFormatter.imagesNumber) {
                this.clearImageWaiting(sender.id);
                const file = yield ctx.telegram.getFile(ctx.message.photo[0].file_id);
                yield (0, chat_1.sendMediaGroup)(ctx, imagesUploaded, 'Here are the images you uploaded');
                const user = yield profileService.getProfileByTgId(sender.id);
                if (user) {
                    ctx.wizard.state.user = {
                        id: user.id,
                        display_name: user.display_name,
                    };
                }
                ctx.wizard.state.photo = imagesUploaded;
                ctx.wizard.state.photo_url = imagesUploadedURL;
                ctx.wizard.state.status = 'previewing';
                ctx.wizard.state.notify_option = (user === null || user === void 0 ? void 0 : user.notify_option) || 'none';
                // empty the images array
                imagesUploaded = [];
                ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state));
                ctx.reply(...section1AFormatter.previewCallToAction());
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
                    yield ctx.reply(...section1AFormatter.photoDisplay(), section1AFormatter.goBackButton());
                    return ctx.wizard.back();
                }
                yield ctx.reply('....');
            }
            else {
                const state = ctx.wizard.state;
                switch (callbackQuery.data) {
                    case 'preview_edit': {
                        ctx.wizard.state.editField = null;
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        ctx.replyWithHTML(...section1AFormatter.editPreview(state));
                        return ctx.wizard.next();
                    }
                    case 'post_data': {
                        const { filePaths, status, msg } = yield (0, image_1.saveImages)({
                            fileIds: ctx.wizard.state.photo,
                            fileLinks: ctx.wizard.state.photo_url,
                            folderName: 'service-1a',
                        });
                        if (status == 'fail')
                            return yield ctx.reply('Unable to download the image please try again');
                        const postDto = {
                            id_first_option: ctx.wizard.state.id_first_option,
                            arbr_value: ctx.wizard.state.arbr_value,
                            description: ctx.wizard.state.description,
                            last_digit: Number(ctx.wizard.state.last_digit),
                            location: ctx.wizard.state.location,
                            photo: ctx.wizard.state.photo,
                            // photo_url: ctx.wizard.state.photo_url,
                            photo_url: filePaths,
                            city: ctx.wizard.state.city,
                            notify_option: ctx.wizard.state.notify_option,
                            category: 'Section 1A',
                            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
                        };
                        const response = yield post_service_1.default.createCategoryPost(postDto, callbackQuery.from.id);
                        if (response === null || response === void 0 ? void 0 : response.success) {
                            ctx.wizard.state.post_id = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id;
                            ctx.wizard.state.post_main_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.post_id;
                            yield (0, dialog_1.displayDialog)(ctx, section1AFormatter.messages.postSuccessMsg, true);
                            yield (0, chat_1.deleteMessageWithCallback)(ctx);
                            const elements = (0, string_1.extractElements)(ctx.wizard.state.photo);
                            const [caption, button] = section1AFormatter.preview(ctx.wizard.state, 'submitted');
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
                            // jump to post preview
                            return ctx.wizard.selectStep(12);
                        }
                        else {
                            ctx.reply(...section1AFormatter.postingError());
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
                    case 'cancel': {
                        ctx.wizard.state.status = 'Cancelled';
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state, 'Cancelled'));
                        return ctx.wizard.selectStep(12);
                    }
                    case 'notify_settings': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.reply(...section1AFormatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
                        return ctx.wizard.selectStep(13);
                    }
                    case 'mention_previous_post': {
                        // fetch previous posts of the user
                        const { posts, success, message } = yield post_service_1.default.getUserPostsByTgId(user.id);
                        if (!success || !posts)
                            return yield ctx.reply(message);
                        if (posts.length == 0)
                            return yield ctx.reply(...section1AFormatter.noPostsErrorMessage());
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.reply(...section1AFormatter.mentionPostMessage());
                        for (const post of posts) {
                            yield ctx.replyWithHTML(...section1AFormatter.displayPreviousPostsList(post));
                        }
                        return ctx.wizard.selectStep(14);
                    }
                    case 'remove_mention_previous_post': {
                        state.mention_post_data = '';
                        state.mention_post_id = '';
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state));
                    }
                    case 'back': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        ctx.wizard.back();
                        return yield ctx.replyWithHTML(...section1AFormatter.preview(state), { parse_mode: 'HTML' });
                    }
                    default: {
                        yield ctx.reply('DEFAULT');
                    }
                }
            }
        });
    }
    editData(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const state = ctx.wizard.state;
            const fileds = [
                'arbr_value',
                'id_first_option',
                'city',
                'last_digit',
                'location',
                'description',
                'photo',
                'cancel',
            ];
            const callbackQuery = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery;
            const editField = (_a = ctx.wizard.state) === null || _a === void 0 ? void 0 : _a.editField;
            if (!callbackQuery) {
                // changing field value
                const messageText = ctx.message.text;
                if (!editField)
                    return yield ctx.reply('invalid input ');
                if ((0, string_1.areEqaul)(messageText, 'back', true)) {
                    ctx.wizard.state.editField = null;
                    return ctx.replyWithHTML(...section1AFormatter.editPreview(state));
                }
                // validate data
                const validationMessage = (0, post_validaor_1.postValidator)(editField, messageText);
                if (validationMessage != 'valid')
                    return yield ctx.reply(validationMessage);
                ctx.wizard.state[editField] = messageText;
                yield (0, chat_1.deleteKeyboardMarkup)(ctx);
                return ctx.replyWithHTML(...section1AFormatter.editPreview(state));
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
                return ctx.replyWithHTML(...section1AFormatter.editPreview(state));
            }
            if (callbackMessage == 'editing_done' || callbackMessage == 'cancel_edit') {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.replyWithHTML(...section1AFormatter.preview(state), { parse_mode: 'HTML' });
                return ctx.wizard.back();
            }
            if (callbackMessage == 'editing_done') {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.replyWithHTML(...section1AFormatter.preview(state), { parse_mode: 'HTML' });
                return ctx.wizard.back();
            }
            if (fileds.some((filed) => filed == callbackQuery.data)) {
                // selecting field to change
                ctx.wizard.state.editField = callbackMessage;
                yield ctx.telegram.deleteMessage(ctx.wizard.state.previousMessageData.chat_id, ctx.wizard.state.previousMessageData.message_id);
                if (callbackQuery.data == 'city') {
                    ctx.wizard.state.currentRound = 0;
                    yield ctx.reply(...section1AFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                    return ctx.wizard.selectStep(11);
                }
                yield ctx.replyWithHTML(...(yield section1AFormatter.editFieldDispay(callbackMessage)));
                if ((0, string_1.areEqaul)(callbackQuery.data, 'photo', true))
                    return ctx.wizard.selectStep(10);
                return;
            }
            if (editField) {
                //  if edit filed is selected
                ctx.wizard.state[editField] = callbackMessage;
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.wizard.state.editField = null;
                return ctx.replyWithHTML(...section1AFormatter.editPreview(state));
            }
        });
    }
    editPhoto(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const sender = (0, chat_1.findSender)(ctx);
            this.setImageWaiting(ctx);
            if (ctx.message.document)
                return ctx.reply(`Please only upload compressed images`);
            const messageText = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (messageText && (0, string_1.areEqaul)(messageText, 'back', true)) {
                ctx.replyWithHTML(...section1AFormatter.editPreview(ctx.wizard.state));
                this.clearImageWaiting(sender.id);
                return ctx.wizard.back();
            }
            // check if image is attached
            if (!ctx.message.photo)
                return ctx.reply(...section1AFormatter.photoDisplay());
            // Add the image to the array
            // Add the image to the array
            const photo_id = ctx.message.photo[0].file_id;
            const photo_url = yield ctx.telegram.getFileLink(photo_id);
            imagesUploaded.push(photo_id);
            imagesUploadedURL.push(photo_url.href);
            // Check if all images received
            if (imagesUploaded.length === section1AFormatter.imagesNumber) {
                this.clearImageWaiting(sender.id);
                yield (0, chat_1.sendMediaGroup)(ctx, imagesUploaded, 'Here are the images you uploaded');
                // Save the images to the state
                ctx.wizard.state.photo = imagesUploaded;
                ctx.wizard.state.photo_url = imagesUploadedURL;
                // empty the images array
                // imagesUploaded.length = 0;
                ctx.replyWithHTML(...section1AFormatter.editPreview(ctx.wizard.state));
                return ctx.wizard.back();
            }
        });
    }
    editCity(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(section1AFormatter.messages.useButtonError);
            (0, chat_1.deleteMessageWithCallback)(ctx);
            switch (callbackQuery.data) {
                case 'back': {
                    if (ctx.wizard.state.currentRound == 0) {
                        yield ctx.replyWithHTML(...section1AFormatter.editPreview(ctx.wizard.state));
                        return ctx.wizard.selectStep(9);
                    }
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
                    return ctx.reply(...section1AFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                }
                case 'next': {
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
                    return ctx.reply(...section1AFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                }
                default:
                    ctx.wizard.state.currentRound = 0;
                    ctx.wizard.state.city = callbackQuery.data;
                    yield ctx.replyWithHTML(...section1AFormatter.editPreview(ctx.wizard.state));
                    return ctx.wizard.selectStep(9);
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
                    const { filePaths, status, msg } = yield (0, image_1.saveImages)({
                        fileIds: ctx.wizard.state.photo,
                        fileLinks: ctx.wizard.state.photo_url,
                        folderName: 'service-1a',
                    });
                    if (status == 'fail')
                        return yield ctx.reply('Unable to download the image please try again');
                    const postDto = {
                        id_first_option: ctx.wizard.state.id_first_option,
                        arbr_value: ctx.wizard.state.arbr_value,
                        description: ctx.wizard.state.description,
                        last_digit: Number(ctx.wizard.state.last_digit),
                        location: ctx.wizard.state.location,
                        notify_option: ctx.wizard.state.notify_option,
                        photo: ctx.wizard.state.photo,
                        // photo_url: ctx.wizard.state.photo_url,
                        photo_url: filePaths,
                        city: ctx.wizard.state.city,
                        category: 'Section 1A',
                        previous_post_id: ctx.wizard.state.mention_post_id || undefined,
                    };
                    const response = yield post_service_1.default.createCategoryPost(postDto, callbackQuery.from.id);
                    if (!(response === null || response === void 0 ? void 0 : response.success))
                        yield ctx.reply(section1AFormatter.messages.resubmitError);
                    ctx.wizard.state.post_id = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id;
                    ctx.wizard.state.post_main_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.post_id;
                    yield (0, dialog_1.displayDialog)(ctx, section1AFormatter.messages.postResubmit);
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
                    yield (0, dialog_1.displayDialog)(ctx, section1AFormatter.messages.postCancelled);
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
            yield (0, dialog_1.displayDialog)(ctx, section1AFormatter.messages.notifySettingChanged.concat(` to  ${notify_option.toUpperCase()}`));
            yield (0, chat_1.deleteMessageWithCallback)(ctx);
            yield ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state));
            return ctx.wizard.selectStep(8);
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
                    yield ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state));
                    return ctx.wizard.selectStep(8);
                }
                if (callbackQuery.data.startsWith('select_post_')) {
                    const post_id = callbackQuery.data.split('_')[2];
                    ctx.wizard.state.mention_post_id = post_id;
                    ctx.wizard.state.mention_post_data = ctx.callbackQuery.message.text;
                    yield ctx.replyWithHTML(...section1AFormatter.preview(ctx.wizard.state));
                    return ctx.wizard.selectStep(8);
                }
            }
        });
    }
}
exports.default = QuestionPostSectionAController;
//# sourceMappingURL=section-a.controller.js.map