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
const dialog_1 = require("../../../../ui/dialog");
const chat_1 = require("../../../../utils/helpers/chat");
const country_list_1 = require("../../../../utils/helpers/country-list");
const string_1 = require("../../../../utils/helpers/string");
const post_validaor_1 = require("../../../../utils/validator/post-validaor");
const mainmenu_controller_1 = __importDefault(require("../../../mainmenu/mainmenu.controller"));
const profile_service_1 = __importDefault(require("../../../profile/profile.service"));
const restgration_service_1 = __importDefault(require("../../../registration/restgration.service"));
const post_service_1 = __importDefault(require("../../post.service"));
const section1c_formatter_1 = __importDefault(require("./section1c.formatter"));
const section1cFormatter = new section1c_formatter_1.default();
const profileService = new profile_service_1.default();
const registrationService = new restgration_service_1.default();
let imagesUploaded = [];
let imagesUploadedURL = [];
class QuestionPostSection1CController {
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
        return this.imageCounter.find(({ id: counterId }) => counterId == id) ? true : false;
    }
    sendImageWaitingPrompt(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = (0, chat_1.findSender)(ctx);
            if (this.isWaitingImages(sender.id))
                yield ctx.reply(section1cFormatter.messages.imageWaitingMsg);
        });
    }
    start(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.wizard.state.category = 'Section1c';
            yield (0, chat_1.deleteKeyboardMarkup)(ctx, section1cFormatter.messages.paperStampPromt);
            yield ctx.reply(...section1cFormatter.choosePaperStampDisplay());
            return ctx.wizard.next();
        });
    }
    choosePaperTimeStamp(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            // if the user is using the inline keyboard
            if (callbackQuery) {
                if (callbackQuery.data && (0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                    (0, chat_1.deleteMessageWithCallback)(ctx);
                    // leave this scene and go back to the previous scene
                    ctx.scene.leave();
                    return ctx.scene.enter('Post-Section-1');
                }
                if ((0, string_1.isInInlineOption)(callbackQuery.data, section1cFormatter.paperStampOption)) {
                    ctx.wizard.state.paper_stamp = callbackQuery.data;
                    (0, chat_1.deleteMessageWithCallback)(ctx);
                    ctx.reply(...section1cFormatter.arBrOptionDisplay());
                    return ctx.wizard.next();
                }
            }
            // if the user is using the text message
            else {
                yield ctx.reply(...section1cFormatter.paperTimestampError());
                // stay on the same step
                // return ctx.wizard.steps[ctx.wizard.cursor](ctx);
            }
        });
    }
    arBrOption(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = (0, chat_1.findSender)(ctx);
            const callbackQuery = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(section1cFormatter.messages.useButtonError);
            if (callbackQuery.data && (0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.reply(...section1cFormatter.choosePaperStampDisplay());
                return ctx.wizard.back();
            }
            if ((0, string_1.isInInlineOption)(callbackQuery.data, section1cFormatter.arBrOption)) {
                ctx.wizard.state.arbr_value = callbackQuery.data;
                const userCountry = yield registrationService.getUserCountry(sender.id);
                const countryCode = (0, country_list_1.getCountryCodeByName)(userCountry);
                ctx.wizard.state.currentRound = 0;
                ctx.wizard.state.countryCode = countryCode;
                (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.reply(...section1cFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                return ctx.wizard.next();
            }
            return ctx.reply('Unknown option. Please choose a valid option.');
        });
    }
    chooseCity(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(section1cFormatter.messages.useButtonError);
            (0, chat_1.deleteMessageWithCallback)(ctx);
            switch (callbackQuery.data) {
                case 'back': {
                    if (ctx.wizard.state.currentRound == 0) {
                        ctx.reply(...section1cFormatter.arBrOptionDisplay());
                        return ctx.wizard.back();
                    }
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
                    return ctx.reply(...section1cFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                }
                case 'next': {
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
                    return ctx.reply(...section1cFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                }
                default:
                    ctx.wizard.state.currentRound = 0;
                    ctx.wizard.state.city = callbackQuery.data;
                    ctx.reply(...section1cFormatter.serviceType1Display());
                    return ctx.wizard.next();
            }
        });
    }
    chooseServiceType1(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(section1cFormatter.messages.useButtonError);
            (0, chat_1.deleteMessageWithCallback)(ctx);
            if (callbackQuery.data && (0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                ctx.wizard.state.currentRound = 0;
                ctx.reply(...section1cFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                return ctx.wizard.back();
            }
            if ((0, string_1.isInInlineOption)(callbackQuery.data, section1cFormatter.serviceType1)) {
                ctx.wizard.state.service_type_1 = callbackQuery.data;
                ctx.reply(...section1cFormatter.serviceType2Display());
                return ctx.wizard.next();
            }
        });
    }
    chooseServiceType2(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(section1cFormatter.messages.useButtonError);
            if (callbackQuery.data && (0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.reply(...section1cFormatter.serviceType1Display());
                return ctx.wizard.back();
            }
            if ((0, string_1.isInInlineOption)(callbackQuery.data, section1cFormatter.serviceType2)) {
                ctx.wizard.state.service_type_2 = callbackQuery.data;
                (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.reply(...section1cFormatter.serviceType3Display());
                return ctx.wizard.next();
            }
        });
    }
    chooseServiceType3(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(section1cFormatter.messages.useButtonError);
            if (callbackQuery.data && (0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.reply(...section1cFormatter.serviceType2Display());
                return ctx.wizard.back();
            }
            if ((0, string_1.isInInlineOption)(callbackQuery.data, section1cFormatter.serviceType3)) {
                ctx.wizard.state.service_type_3 = callbackQuery.data;
                (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.reply(...section1cFormatter.yearOfConfirmationDisplay());
                return ctx.wizard.next();
            }
        });
    }
    yearOfConfirmation(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = ctx.message.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                ctx.reply(...section1cFormatter.serviceType3Display());
                return ctx.wizard.back();
            }
            const validationMessage = (0, post_validaor_1.postValidator)('confirmation_year', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.confirmation_year = message;
            yield ctx.reply(...section1cFormatter.bIDIOptionDisplay());
            return ctx.wizard.next();
        });
    }
    // bi/di
    IDFirstOption(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery) {
                if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                    ctx.reply(...section1cFormatter.yearOfConfirmationDisplay());
                    return ctx.wizard.back();
                }
                return ctx.reply('Unknown option. Please use buttons to choose .');
            }
            if (callbackQuery.data && (0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.reply(...section1cFormatter.yearOfConfirmationDisplay());
                return ctx.wizard.back();
            }
            if ((0, string_1.isInInlineOption)(callbackQuery.data, section1cFormatter.bIDiOption)) {
                ctx.wizard.state.id_first_option = callbackQuery.data;
                (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.reply(...section1cFormatter.lastDigitDisplay());
                return ctx.wizard.next();
            }
        });
    }
    enterLastDigit(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                ctx.reply(...section1cFormatter.bIDIOptionDisplay());
                return ctx.wizard.back();
            }
            const validationMessage = (0, post_validaor_1.postValidator)('last_digit', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.last_digit = message;
            ctx.reply(...section1cFormatter.descriptionDisplay());
            return ctx.wizard.next();
        });
    }
    enterDescription(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                ctx.reply(...section1cFormatter.lastDigitDisplay());
                return ctx.wizard.back();
            }
            // const validationMessage = questionPostValidator('description', message);
            // if (validationMessage != 'valid') return await ctx.reply(validationMessage);
            ctx.wizard.state.description = message;
            ctx.reply(...section1cFormatter.photoDisplay());
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
                ctx.reply(...section1cFormatter.descriptionDisplay());
                return ctx.wizard.back();
            }
            // check if image is attached
            if (!ctx.message.photo)
                return ctx.reply(...section1cFormatter.photoDisplay());
            // Add the image to the array
            const photo_id = ctx.message.photo[0].file_id;
            const photo_url = yield ctx.telegram.getFileLink(photo_id);
            imagesUploaded.push(photo_id);
            imagesUploadedURL.push(photo_url.href);
            // Check if all images received
            if (imagesUploaded.length == section1cFormatter.imagesNumber) {
                this.clearImageWaiting(sender.id);
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
                ctx.wizard.state.status = 'preview';
                ctx.wizard.state.notify_option = (user === null || user === void 0 ? void 0 : user.notify_option) || 'none';
                // empty the images array
                imagesUploaded = [];
                ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                ctx.reply(...section1cFormatter.previewCallToAction());
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
                    yield ctx.reply(...section1cFormatter.photoDisplay(), section1cFormatter.goBackButton());
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
                        ctx.replyWithHTML(...section1cFormatter.editPreview(state), { parse_mode: 'HTML' });
                        return ctx.wizard.next();
                    }
                    case 'post_data': {
                        const postDto = {
                            arbr_value: ctx.wizard.state.arbr_value,
                            id_first_option: ctx.wizard.state.id_first_option,
                            description: ctx.wizard.state.description,
                            last_digit: Number(ctx.wizard.state.last_digit),
                            service_type_1: ctx.wizard.state.service_type_1,
                            service_type_2: ctx.wizard.state.service_type_2,
                            service_type_3: ctx.wizard.state.service_type_3,
                            paper_stamp: ctx.wizard.state.paper_stamp,
                            confirmation_year: ctx.wizard.state.confirmation_year,
                            photo: ctx.wizard.state.photo,
                            photo_url: ctx.wizard.state.photo_url,
                            city: ctx.wizard.state.city,
                            notify_option: ctx.wizard.state.notify_option,
                            category: 'Section 1C',
                            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
                        };
                        const response = yield post_service_1.default.createCategoryPost(postDto, callbackQuery.from.id);
                        if (response === null || response === void 0 ? void 0 : response.success) {
                            ctx.wizard.state.post_id = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id;
                            ctx.wizard.state.post_main_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.post_id;
                            ctx.wizard.state.status = 'Pending';
                            yield (0, dialog_1.displayDialog)(ctx, section1cFormatter.messages.postSuccessMsg, true);
                            yield (0, chat_1.deleteMessageWithCallback)(ctx);
                            const elements = (0, string_1.extractElements)(ctx.wizard.state.photo);
                            const [caption, button] = section1cFormatter.preview(ctx.wizard.state, 'submitted');
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
                            return ctx.wizard.selectStep(16);
                        }
                        else {
                            ctx.reply(...section1cFormatter.postingError());
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
                        yield ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state, 'Cancelled'), {
                            parse_mode: 'HTML',
                        });
                        return ctx.wizard.selectStep(16);
                    }
                    case 'notify_settings': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.reply(...section1cFormatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
                        return ctx.wizard.selectStep(17);
                    }
                    case 'mention_previous_post': {
                        // fetch previous posts of the user
                        const { posts, success, message } = yield post_service_1.default.getUserPostsByTgId(user.id);
                        if (!success || !posts)
                            return yield ctx.reply(message);
                        if (posts.length == 0)
                            return yield ctx.reply(...section1cFormatter.noPostsErrorMessage());
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.reply(...section1cFormatter.mentionPostMessage());
                        for (const post of posts) {
                            yield ctx.reply(...section1cFormatter.displayPreviousPostsList(post));
                        }
                        return ctx.wizard.selectStep(18);
                    }
                    case 'remove_mention_previous_post': {
                        state.mention_post_data = '';
                        state.mention_post_id = '';
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                    }
                    case 'back': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        ctx.wizard.back();
                        return yield ctx.replyWithHTML(...section1cFormatter.preview(state), { parse_mode: 'HTML' });
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
                'paper_stamp',
                'arbr_value',
                'city',
                'service_type_1',
                'service_type_2',
                'service_type_3',
                'confirmation_year',
                'id_first_option',
                'last_digit',
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
                    return yield ctx.reply(section1cFormatter.messages.invalidInput);
                if ((0, string_1.areEqaul)(messageText, 'back', true)) {
                    ctx.wizard.state.editField = null;
                    return ctx.replyWithHTML(...section1cFormatter.editPreview(state));
                }
                const validationMessage = (0, post_validaor_1.postValidator)(editField, messageText);
                if (validationMessage != 'valid')
                    return yield ctx.reply(validationMessage);
                ctx.wizard.state[editField] = messageText;
                yield (0, chat_1.deleteKeyboardMarkup)(ctx);
                return ctx.replyWithHTML(...section1cFormatter.editPreview(state), { parse_mode: 'HTML' });
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
                return ctx.replyWithHTML(...section1cFormatter.editPreview(state));
            }
            if (callbackMessage == 'editing_done' || callbackMessage == 'cancel_edit') {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.replyWithHTML(...section1cFormatter.preview(state), { parse_mode: 'HTML' });
                return ctx.wizard.back();
            }
            if (callbackMessage == 'editing_done') {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.replyWithHTML(...section1cFormatter.preview(state), { parse_mode: 'HTML' });
                return ctx.wizard.back();
            }
            if (fileds.some((filed) => filed == callbackQuery.data)) {
                // selecting field to change
                ctx.wizard.state.editField = callbackMessage;
                yield ctx.telegram.deleteMessage(ctx.wizard.state.previousMessageData.chat_id, ctx.wizard.state.previousMessageData.message_id);
                if (callbackMessage == 'city') {
                    ctx.wizard.state.currentRound = 0;
                    yield ctx.reply(...section1cFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                    // jump to edit city
                    return ctx.wizard.selectStep(15);
                }
                yield ctx.replyWithHTML(...(yield section1cFormatter.editFieldDispay(callbackMessage)), {
                    parse_mode: 'HTML',
                });
                if ((0, string_1.areEqaul)(callbackQuery.data, 'photo', true))
                    return ctx.wizard.selectStep(14);
                return;
            }
            if (editField) {
                //  if edit filed is selected
                ctx.wizard.state[editField] = callbackMessage;
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                return ctx.replyWithHTML(...section1cFormatter.editPreview(state), { parse_mode: 'HTML' });
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
                ctx.replyWithHTML(...section1cFormatter.editPreview(ctx.wizard.state));
                this.clearImageWaiting(sender.id);
                return ctx.wizard.back();
            }
            // check if image is attached
            if (!ctx.message.photo)
                return ctx.reply(...section1cFormatter.photoDisplay());
            // Add the image to the array
            const photo_id = ctx.message.photo[0].file_id;
            const photo_url = yield ctx.telegram.getFileLink(photo_id);
            imagesUploaded.push(photo_id);
            imagesUploadedURL.push(photo_url.href);
            // Check if all images received
            if (imagesUploaded.length == section1cFormatter.imagesNumber) {
                this.clearImageWaiting(sender.id);
                yield (0, chat_1.sendMediaGroup)(ctx, imagesUploaded, 'Here are the images you uploaded');
                // Save the images to the state
                ctx.wizard.state.photo = imagesUploaded;
                ctx.wizard.state.photo_url = imagesUploadedURL;
                // empty the images array
                // imagesUploaded.length = 0;
                ctx.replyWithHTML(...section1cFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
                return ctx.wizard.back();
            }
        });
    }
    editCity(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(section1cFormatter.messages.useButtonError);
            (0, chat_1.deleteMessageWithCallback)(ctx);
            switch (callbackQuery.data) {
                case 'back': {
                    if (ctx.wizard.state.currentRound == 0) {
                        yield ctx.replyWithHTML(...section1cFormatter.editPreview(ctx.wizard.state));
                        return ctx.wizard.selectStep(9);
                    }
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
                    return ctx.reply(...section1cFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                }
                case 'next': {
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
                    return ctx.reply(...section1cFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                }
                default:
                    ctx.wizard.state.currentRound = 0;
                    ctx.wizard.state.city = callbackQuery.data;
                    yield ctx.replyWithHTML(...section1cFormatter.editPreview(ctx.wizard.state));
                    return ctx.wizard.selectStep(9);
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
                        arbr_value: ctx.wizard.state.arbr_value,
                        id_first_option: ctx.wizard.state.id_first_option,
                        description: ctx.wizard.state.description,
                        last_digit: Number(ctx.wizard.state.last_digit),
                        service_type_1: ctx.wizard.state.service_type_1,
                        service_type_2: ctx.wizard.state.service_type_2,
                        service_type_3: ctx.wizard.state.service_type_3,
                        confirmation_year: ctx.wizard.state.confirmation_year,
                        paper_stamp: ctx.wizard.state.paper_stamp,
                        photo: ctx.wizard.state.photo,
                        photo_url: ctx.wizard.state.photo_url,
                        city: ctx.wizard.state.city,
                        notify_option: ctx.wizard.state.notify_option,
                        category: 'Section 1C',
                        previous_post_id: ctx.wizard.state.mention_post_id || undefined,
                    };
                    const response = yield post_service_1.default.createCategoryPost(postDto, callbackQuery.from.id);
                    if (!(response === null || response === void 0 ? void 0 : response.success))
                        yield ctx.reply(section1cFormatter.messages.resubmitError);
                    ctx.wizard.state.post_id = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id;
                    ctx.wizard.state.post_main_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.post_id;
                    ctx.wizard.state.status = 'Pending';
                    yield (0, dialog_1.displayDialog)(ctx, section1cFormatter.messages.postResubmit);
                    return ctx.editMessageReplyMarkup({
                        inline_keyboard: [
                            [{ text: 'Cancel', callback_data: `cancel_post` }],
                            [{ text: 'Main menu', callback_data: 'main_menu' }],
                        ],
                    });
                }
                case 'cancel_post': {
                    const deleted = yield post_service_1.default.deletePostById(ctx.wizard.state.post_main_id, 'Section 1C');
                    if (!deleted)
                        return yield ctx.reply('Unable to cancel the post ');
                    yield (0, dialog_1.displayDialog)(ctx, section1cFormatter.messages.postCancelled);
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
            yield (0, dialog_1.displayDialog)(ctx, section1cFormatter.messages.notifySettingChanged.concat(` to  ${notify_option.toUpperCase()}`));
            yield (0, chat_1.deleteMessageWithCallback)(ctx);
            yield ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state));
            return ctx.wizard.selectStep(12);
        });
    }
    mentionPreviousPost(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = ctx.wizard.state;
            const callbackQuery = ctx.callbackQuery;
            if (callbackQuery) {
                if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                    return ctx.wizard.selectStep(12);
                }
                if (callbackQuery.data.startsWith('select_post_')) {
                    const post_id = callbackQuery.data.split('_')[2];
                    state.mention_post_id = post_id;
                    state.mention_post_data = ctx.callbackQuery.message.text;
                    yield ctx.replyWithHTML(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                    return ctx.wizard.selectStep(12);
                }
            }
        });
    }
}
exports.default = QuestionPostSection1CController;
//# sourceMappingURL=section1c.controller.js.map