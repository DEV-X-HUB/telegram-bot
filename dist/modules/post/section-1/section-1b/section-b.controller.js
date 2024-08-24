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
const chat_1 = require("../../../../utils/helpers/chat");
const string_1 = require("../../../../utils/helpers/string");
const section_b_formatter_1 = __importDefault(require("./section-b.formatter"));
const post_validaor_1 = require("../../../../utils/validator/post-validaor");
const mainmenu_controller_1 = __importDefault(require("../../../mainmenu/mainmenu.controller"));
const profile_service_1 = __importDefault(require("../../../profile/profile.service"));
const dialog_1 = require("../../../../ui/dialog");
const date_1 = require("../../../../utils/helpers/date");
const post_service_1 = __importDefault(require("../../post.service"));
const config_1 = __importDefault(require("../../../../config/config"));
const restgration_service_1 = __importDefault(require("../../../registration/restgration.service"));
const country_list_1 = require("../../../../utils/helpers/country-list");
const registrationService = new restgration_service_1.default();
const sectionBFormatter = new section_b_formatter_1.default();
const profileService = new profile_service_1.default();
let imagesUploaded = [];
let imagesUploadedURL = [];
class QuestionPostSectionBController {
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
                yield ctx.reply(sectionBFormatter.messages.imageWaitingMsg);
        });
    }
    start(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.reply(...sectionBFormatter.InsertTiteDisplay());
            return ctx.wizard.next();
        });
    }
    enterTitle(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = ctx.message.text;
            if ((0, string_1.areEqaul)(text, 'back', true))
                return ctx.scene.enter('Post-Section-1');
            const validationMessage = (0, post_validaor_1.postValidator)('title', text);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.title = text;
            yield (0, chat_1.deleteKeyboardMarkup)(ctx, sectionBFormatter.messages.categoriesPrompt);
            ctx.reply(...sectionBFormatter.mainCategoryOption());
            return ctx.wizard.next();
        });
    }
    chooseMainCategory(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(sectionBFormatter.messages.useButtonError);
            if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.reply(...sectionBFormatter.InsertTiteDisplay());
                return ctx.wizard.back();
            }
            ctx.wizard.state.main_category = callbackQuery.data;
            if ((0, string_1.areEqaul)(callbackQuery.data, 'main_10', true)) {
                ctx.wizard.state.sub_category = callbackQuery.data;
                (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.reply(...sectionBFormatter.bIDIOptionDisplay());
                return ctx.wizard.selectStep(4); // jumping to step with step index(bi di selector(id first))
            }
            (0, chat_1.deleteMessageWithCallback)(ctx);
            ctx.reply(...sectionBFormatter.subCategoryOption(callbackQuery.data));
            return ctx.wizard.next();
        });
    }
    chooseSubCategory(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(sectionBFormatter.messages.useButtonError);
            if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.reply(...sectionBFormatter.mainCategoryOption());
                return ctx.wizard.back();
            }
            ctx.wizard.state.sub_category = callbackQuery.data;
            (0, chat_1.deleteMessageWithCallback)(ctx);
            ctx.reply(...sectionBFormatter.bIDIOptionDisplay());
            return ctx.wizard.next();
        });
    }
    IDFirstOption(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(sectionBFormatter.messages.useButtonError);
            if (callbackQuery.data && (0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                const mainCategory = ctx.wizard.state.main_category;
                if ((0, string_1.areEqaul)(mainCategory, 'main_10', true)) {
                    (0, chat_1.deleteMessageWithCallback)(ctx);
                    ctx.reply(...sectionBFormatter.mainCategoryOption());
                    return ctx.wizard.selectStep(2);
                }
                else {
                    (0, chat_1.deleteMessageWithCallback)(ctx);
                    ctx.reply(...sectionBFormatter.subCategoryOption(mainCategory));
                    return ctx.wizard.back();
                }
            }
            if ((0, string_1.isInInlineOption)(callbackQuery.data, sectionBFormatter.bIDiOption)) {
                ctx.wizard.state.id_first_option = callbackQuery.data;
                (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.reply(...sectionBFormatter.lastDidtitDisplay());
                return ctx.wizard.next();
            }
            ctx.reply('unkown option');
        });
    }
    enterLastDigit(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                yield (0, chat_1.deleteKeyboardMarkup)(ctx, sectionBFormatter.messages.biDiPrompt);
                ctx.reply(...sectionBFormatter.bIDIOptionDisplay());
                return ctx.wizard.back();
            }
            const validationMessage = (0, post_validaor_1.postValidator)('last_digit', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.last_digit = message;
            const mainCategory = ctx.wizard.state.main_category;
            yield (0, chat_1.deleteKeyboardMarkup)(ctx, sectionBFormatter.messages.conditonPrompt);
            if ((0, string_1.areEqaul)(mainCategory, 'main_4', true)) {
                yield ctx.reply(...sectionBFormatter.OpSeCondtionOptionDisplay());
                // jump to se op condtion
                return ctx.wizard.selectStep(7);
            }
            yield ctx.reply(...sectionBFormatter.urgencyOptionDisplay());
            return ctx.wizard.next();
        });
    }
    urgencyCondtion(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = (0, chat_1.findSender)(ctx);
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(sectionBFormatter.messages.useButtonError);
            if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.reply(...sectionBFormatter.lastDidtitDisplay());
                return ctx.wizard.back();
            }
            ctx.wizard.state.condition = callbackQuery.data;
            (0, chat_1.deleteMessageWithCallback)(ctx);
            const userCountry = yield registrationService.getUserCountry(sender.id);
            const countryCode = (0, country_list_1.getCountryCodeByName)(userCountry);
            ctx.wizard.state.currentRound = 0;
            ctx.wizard.state.countryCode = countryCode;
            ctx.reply(...(yield sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, 0)));
            return ctx.wizard.selectStep(11); // jumping to step with step index(jump to city selector)
        });
    }
    seOpCondition(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(sectionBFormatter.messages.useButtonError);
            if (callbackQuery.data && (0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.reply(...sectionBFormatter.lastDidtitDisplay());
                return ctx.wizard.selectStep(5);
            }
            if ((0, string_1.isInInlineOption)(callbackQuery.data, sectionBFormatter.OpSeOption)) {
                ctx.wizard.state.condition = callbackQuery.data;
                (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.reply(...sectionBFormatter.dateOfIssue());
                return ctx.wizard.next();
            }
            ctx.reply('unkown option');
        });
    }
    enterDateofIssue(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                yield (0, chat_1.deleteKeyboardMarkup)(ctx, sectionBFormatter.messages.dateOfIssuePrompt);
                ctx.reply(...sectionBFormatter.OpSeCondtionOptionDisplay());
                return ctx.wizard.back();
            }
            const validationMessage = (0, post_validaor_1.postValidator)('issue_date', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.issue_date = message;
            yield ctx.reply(...sectionBFormatter.dateOfExpire());
            return ctx.wizard.next();
        });
    }
    enterDateofExpire(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                ctx.reply(...sectionBFormatter.dateOfIssue());
                return ctx.wizard.back();
            }
            // assign the location to the state
            const validationMessage = (0, post_validaor_1.postValidator)('expire_date', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.expire_date = message;
            yield ctx.reply(...sectionBFormatter.originalLocation());
            return ctx.wizard.next();
        });
    }
    enterOriginlaLocation(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const sender = (0, chat_1.findSender)(ctx);
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                ctx.reply(...sectionBFormatter.dateOfExpire());
                return ctx.wizard.back();
            }
            // assign the location to the state
            ctx.wizard.state.location = message;
            yield (0, chat_1.deleteKeyboardMarkup)(ctx, sectionBFormatter.messages.chooseCityPrompt);
            const userCountry = yield registrationService.getUserCountry(sender.id);
            const countryCode = (0, country_list_1.getCountryCodeByName)(userCountry);
            ctx.wizard.state.currentRound = 0;
            ctx.wizard.state.countryCode = countryCode;
            ctx.reply(...sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, 0));
            return ctx.wizard.next();
        });
    }
    chooseCity(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(sectionBFormatter.messages.useButtonError);
            (0, chat_1.deleteMessageWithCallback)(ctx);
            switch (callbackQuery.data) {
                case 'back': {
                    if (ctx.wizard.state.currentRound == 0) {
                        const mainCategory = ctx.wizard.state.main_category;
                        if ((0, string_1.areEqaul)(mainCategory, 'main_4', true)) {
                            yield ctx.reply(...sectionBFormatter.originalLocation());
                            return ctx.wizard.back();
                            // jump
                        }
                        ctx.reply(...sectionBFormatter.urgencyOptionDisplay());
                        return ctx.wizard.selectStep(6);
                    }
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
                    return ctx.reply(...(yield sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound)));
                }
                case 'next': {
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
                    return ctx.reply(...(yield sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound)));
                }
                default:
                    ctx.wizard.state.currentRound = 0;
                    ctx.wizard.state.city = callbackQuery.data;
                    yield ctx.reply(...sectionBFormatter.descriptionDisplay());
                    return ctx.wizard.next();
            }
        });
    }
    enterDescription(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                yield (0, chat_1.deleteKeyboardMarkup)(ctx, sectionBFormatter.messages.chooseCityPrompt);
                ctx.wizard.state.currentRound = 0;
                ctx.reply(...sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                return ctx.wizard.back();
            }
            const validationMessage = (0, post_validaor_1.postValidator)('description', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.description = message;
            ctx.reply(...sectionBFormatter.photoDisplay());
            return ctx.wizard.next();
        });
    }
    attachPhoto(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const sender = (0, chat_1.findSender)(ctx);
            const message = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            this.setImageWaiting(ctx);
            if ((_b = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _b === void 0 ? void 0 : _b.document)
                return ctx.reply(`Please only upload compressed images`);
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                yield ctx.reply(...sectionBFormatter.descriptionDisplay());
                this.clearImageWaiting(sender.id);
                return ctx.wizard.back();
            }
            // check if image is attached
            if (!ctx.message.photo)
                return ctx.reply(...sectionBFormatter.photoDisplay());
            // Add the image to the array
            const photo_id = ctx.message.photo[0].file_id;
            const photo_url = yield ctx.telegram.getFileLink(photo_id);
            imagesUploaded.push(photo_id);
            imagesUploadedURL.push(photo_url.href);
            // Check if all images received
            if (imagesUploaded.length == sectionBFormatter.imagesNumber) {
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
                ctx.replyWithHTML(...sectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                ctx.reply(...sectionBFormatter.previewCallToAction());
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
                    yield ctx.reply(...sectionBFormatter.photoDisplay(), sectionBFormatter.goBackButton());
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
                        ctx.replyWithHTML(...sectionBFormatter.editPreview(state), { parse_mode: 'HTML' });
                        return ctx.wizard.next();
                    }
                    case 'post_data': {
                        const postDto = {
                            title: ctx.wizard.state.title,
                            main_category: ctx.wizard.state.main_category,
                            sub_category: ctx.wizard.state.sub_category,
                            condition: ctx.wizard.state.condition,
                            id_first_option: ctx.wizard.state.id_first_option,
                            issue_date: ctx.wizard.state.issue_date ? (0, date_1.parseDateString)(ctx.wizard.state.issue_date) : undefined,
                            expire_date: ctx.wizard.state.expire_date ? (0, date_1.parseDateString)(ctx.wizard.state.expire_date) : undefined,
                            description: ctx.wizard.state.description,
                            last_digit: Number(ctx.wizard.state.last_digit),
                            location: ctx.wizard.state.location,
                            photo: ctx.wizard.state.photo,
                            photo_url: ctx.wizard.state.photo_url,
                            city: ctx.wizard.state.city,
                            notify_option: ctx.wizard.state.notify_option,
                            category: 'Section 1B',
                            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
                        };
                        const response = yield post_service_1.default.createCategoryPost(postDto, user.id);
                        if (response === null || response === void 0 ? void 0 : response.success) {
                            ctx.wizard.state.post_id = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id;
                            ctx.wizard.state.post_main_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.post_id;
                            ctx.wizard.state.status = 'Pending';
                            yield (0, dialog_1.displayDialog)(ctx, sectionBFormatter.messages.postSuccessMsg, true);
                            yield (0, chat_1.deleteMessageWithCallback)(ctx);
                            const elements = (0, string_1.extractElements)(ctx.wizard.state.photo);
                            const [caption, button] = sectionBFormatter.preview(ctx.wizard.state, 'submitted');
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
                            // jump to post review
                            return ctx.wizard.selectStep(18);
                        }
                        else {
                            ctx.reply(...sectionBFormatter.postingError());
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
                        yield (0, dialog_1.displayDialog)(ctx, sectionBFormatter.messages.postCancelled);
                        yield ctx.replyWithHTML(...sectionBFormatter.preview(ctx.wizard.state, 'Cancelled'), {
                            parse_mode: 'HTML',
                        });
                        // jump to post preview
                        return ctx.wizard.selectStep(18);
                    }
                    case 'notify_settings': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.reply(...sectionBFormatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
                        return ctx.wizard.selectStep(19);
                    }
                    case 'mention_previous_post': {
                        // fetch previous posts of the user
                        const { posts, success, message } = yield post_service_1.default.getUserPostsByTgId(user.id);
                        if (!success || !posts)
                            return yield ctx.reply(message);
                        if (posts.length == 0)
                            return yield ctx.reply(...sectionBFormatter.noPostsErrorMessage());
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.reply(...sectionBFormatter.mentionPostMessage());
                        for (const post of posts) {
                            yield ctx.reply(...sectionBFormatter.displayPreviousPostsList(post));
                        }
                        return ctx.wizard.selectStep(20);
                    }
                    case 'remove_mention_previous_post': {
                        state.mention_post_data = '';
                        state.mention_post_id = '';
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.replyWithHTML(...sectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                    }
                    case 'back': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        ctx.wizard.back();
                        return yield ctx.replyWithHTML(...sectionBFormatter.preview(state), { parse_mode: 'HTML' });
                    }
                    default: {
                        yield ctx.reply(sectionBFormatter.messages.invalidDateErrorPrompt);
                    }
                }
            }
        });
    }
    editData(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const fileds = [
                'title',
                'main_category',
                'sub_category',
                'condition',
                'id_first_option',
                'city',
                'last_digit',
                'location',
                'description',
                'issue_date',
                'expire_date',
                'photo',
                'cancel',
            ];
            const state = ctx.wizard.state;
            const callbackQuery = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery;
            const editField = (_a = ctx.wizard.state) === null || _a === void 0 ? void 0 : _a.editField;
            if (!callbackQuery) {
                // changing field value
                const messageText = ctx.message.text;
                if (!editField)
                    return yield ctx.reply('invalid input ');
                if ((0, string_1.areEqaul)(messageText, 'back', true)) {
                    ctx.wizard.state.editField = null;
                    return ctx.replyWithHTML(...sectionBFormatter.editPreview(state));
                }
                // validate data
                const validationMessage = (0, post_validaor_1.postValidator)(editField, messageText);
                if (validationMessage != 'valid')
                    return yield ctx.reply(validationMessage);
                ctx.wizard.state[editField] = messageText;
                yield (0, chat_1.deleteKeyboardMarkup)(ctx);
                return ctx.replyWithHTML(...sectionBFormatter.editPreview(state), { parse_mode: 'HTML' });
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
                return ctx.replyWithHTML(...sectionBFormatter.editPreview(state));
            }
            if (callbackMessage == 'editing_done' || callbackMessage == 'cancel_edit') {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.replyWithHTML(...sectionBFormatter.preview(state));
                return ctx.wizard.back();
            }
            if (callbackMessage == 'editing_done') {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.replyWithHTML(...sectionBFormatter.preview(state));
                return ctx.wizard.back();
            }
            if (fileds.some((filed) => filed == callbackMessage)) {
                // selecting field to change
                let extra = '';
                ctx.wizard.state.editField = callbackMessage;
                yield ctx.telegram.deleteMessage(ctx.wizard.state.previousMessageData.chat_id, ctx.wizard.state.previousMessageData.message_id);
                switch (callbackMessage) {
                    case 'condition':
                        extra = ctx.wizard.state.condition;
                        break;
                    case 'sub_category':
                        extra = ctx.wizard.state.condition;
                        break;
                }
                if (callbackMessage == 'city') {
                    ctx.wizard.state.currentRound = 0;
                    yield ctx.reply(...sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                    // jump to edit city
                    return ctx.wizard.selectStep(17);
                }
                yield ctx.replyWithHTML(...(yield sectionBFormatter.editFieldDispay(callbackMessage, state.condition)), {
                    parse_mode: 'HTML',
                });
                if ((0, string_1.areEqaul)(callbackMessage, 'photo', true))
                    return ctx.wizard.selectStep(16);
                return;
            }
            if (editField) {
                //  if edit filed is selected
                ctx.wizard.state[editField] = callbackMessage;
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                if ((0, string_1.areEqaul)(editField, 'main_category', true) && !(0, string_1.areEqaul)(callbackMessage, 'main_10', true)) {
                    ctx.wizard.state.editField = 'sub_category';
                    return ctx.reply(...sectionBFormatter.subCategoryOption(callbackMessage));
                }
                return ctx.replyWithHTML(...sectionBFormatter.editPreview(state), { parse_mode: 'HTML' });
            }
        });
    }
    editPhoto(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const sender = (0, chat_1.findSender)(ctx);
            const messageText = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            this.setImageWaiting(ctx);
            if ((_b = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _b === void 0 ? void 0 : _b.document)
                return ctx.reply(`Please only upload compressed images`);
            if (messageText && (0, string_1.areEqaul)(messageText, 'back', true)) {
                ctx.replyWithHTML(...sectionBFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
                this.clearImageWaiting(sender.id);
                return ctx.wizard.back();
            }
            // check if image is attached
            if (!ctx.message.photo)
                return ctx.reply(...sectionBFormatter.photoDisplay());
            // Add the image to the array
            const photo_id = ctx.message.photo[0].file_id;
            const photo_url = yield ctx.telegram.getFileLink(photo_id);
            imagesUploaded.push(photo_id);
            imagesUploadedURL.push(photo_url.href);
            // Check if all images received
            if (imagesUploaded.length == sectionBFormatter.imagesNumber) {
                this.clearImageWaiting(sender.id);
                yield (0, chat_1.sendMediaGroup)(ctx, imagesUploaded, 'Here are the images you uploaded');
                // Save the images to the state
                ctx.wizard.state.photo = imagesUploaded;
                ctx.wizard.state.photo_url = imagesUploadedURL;
                // empty the images array
                // imagesUploaded.length = 0;
                ctx.replyWithHTML(...sectionBFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
                return ctx.wizard.back();
            }
        });
    }
    editCity(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(sectionBFormatter.messages.useButtonError);
            (0, chat_1.deleteMessageWithCallback)(ctx);
            switch (callbackQuery.data) {
                case 'back': {
                    if (ctx.wizard.state.currentRound == 0) {
                        yield ctx.replyWithHTML(...sectionBFormatter.editPreview(ctx.wizard.state));
                        return ctx.wizard.selectStep(14);
                    }
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
                    return ctx.reply(...sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                }
                case 'next': {
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
                    return ctx.reply(...sectionBFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound));
                }
                default:
                    ctx.wizard.state.currentRound = 0;
                    ctx.wizard.state.city = callbackQuery.data;
                    yield ctx.replyWithHTML(...sectionBFormatter.editPreview(ctx.wizard.state));
                    return ctx.wizard.selectStep(14);
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
                        title: ctx.wizard.state.title,
                        main_category: ctx.wizard.state.main_category,
                        sub_category: ctx.wizard.state.sub_category,
                        condition: ctx.wizard.state.condition,
                        id_first_option: ctx.wizard.state.id_first_option,
                        issue_date: ctx.wizard.state.issue_date ? (0, date_1.parseDateString)(ctx.wizard.state.issue_date) : undefined,
                        expire_date: ctx.wizard.state.expire_date ? (0, date_1.parseDateString)(ctx.wizard.state.expire_date) : undefined,
                        description: ctx.wizard.state.description,
                        last_digit: Number(ctx.wizard.state.last_digit),
                        location: ctx.wizard.state.location,
                        photo: ctx.wizard.state.photo,
                        photo_url: ctx.wizard.state.photo_url,
                        city: ctx.wizard.state.city,
                        notify_option: ctx.wizard.state.notify_option,
                        category: 'Section 1B',
                        previous_post_id: ctx.wizard.state.mention_post_id || undefined,
                    };
                    const response = yield post_service_1.default.createCategoryPost(postDto, callbackQuery.from.id);
                    if (!(response === null || response === void 0 ? void 0 : response.success))
                        yield ctx.reply(sectionBFormatter.messages.resubmitError);
                    ctx.wizard.state.post_id = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id;
                    ctx.wizard.state.post_main_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.post_id;
                    ctx.wizard.state.status = 'Pending';
                    yield (0, dialog_1.displayDialog)(ctx, sectionBFormatter.messages.postResubmit);
                    return ctx.editMessageReplyMarkup({
                        inline_keyboard: [
                            [{ text: 'Cancel', callback_data: `cancel_post` }],
                            [{ text: 'Main menu', callback_data: 'main_menu' }],
                        ],
                    });
                }
                case 'cancel_post': {
                    const deleted = yield post_service_1.default.deletePostById(ctx.wizard.state.post_main_id, 'Section 1B');
                    if (!deleted)
                        return yield ctx.reply(sectionBFormatter.messages.deletePostErrorMsg);
                    yield (0, dialog_1.displayDialog)(ctx, sectionBFormatter.messages.postCancelled);
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
            yield (0, dialog_1.displayDialog)(ctx, sectionBFormatter.messages.notifySettingChanged.concat(` to  ${notify_option.toUpperCase()}`));
            yield (0, chat_1.deleteMessageWithCallback)(ctx);
            yield ctx.replyWithHTML(...sectionBFormatter.preview(ctx.wizard.state));
            return ctx.wizard.selectStep(14);
        });
    }
    mentionPreviousPost(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = ctx.wizard.state;
            const callbackQuery = ctx.callbackQuery;
            if (callbackQuery) {
                if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.replyWithHTML(...sectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                    return ctx.wizard.selectStep(14);
                }
                if (callbackQuery.data.startsWith('select_post_')) {
                    const post_id = callbackQuery.data.split('_')[2];
                    state.mention_post_id = post_id;
                    state.mention_post_data = ctx.callbackQuery.message.text;
                    yield ctx.replyWithHTML(...sectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                    return ctx.wizard.selectStep(14);
                }
            }
        });
    }
}
exports.default = QuestionPostSectionBController;
//# sourceMappingURL=section-b.controller.js.map