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
const post_validaor_1 = require("../../../../utils/validator/post-validaor");
const dialog_1 = require("../../../../ui/dialog");
const mainmenu_controller_1 = __importDefault(require("../../../mainmenu/mainmenu.controller"));
const construction_formatter_1 = __importDefault(require("./construction.formatter"));
const post_service_1 = __importDefault(require("../../post.service"));
const profile_service_1 = __importDefault(require("../../../profile/profile.service"));
const config_1 = __importDefault(require("../../../../config/config"));
const constructionFormatter = new construction_formatter_1.default();
const profileService = new profile_service_1.default();
let imagesUploaded = [];
let imagesUploadedURL = [];
class QuestionPostSectionConstructionController {
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
                yield ctx.reply(constructionFormatter.messages.imageWaitingMsg);
        });
    }
    start(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.reply(...constructionFormatter.chooseSizeDisplay());
            return ctx.wizard.next();
        });
    }
    chooseConstructionSize(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(constructionFormatter.messages.useButtonError);
            if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true))
                return ctx.scene.enter('Post-Question-Section-4');
            if (!(0, string_1.isInInlineOption)(callbackQuery.data, constructionFormatter.sizeOption))
                return ctx.reply(...constructionFormatter.messages.unknowOptionError);
            ctx.wizard.state.category = 'Construction';
            ctx.wizard.state.construction_size = callbackQuery.data;
            yield (0, chat_1.deleteMessageWithCallback)(ctx);
            if ((0, string_1.areEqaul)(ctx.wizard.state.construction_size, 'big', true)) {
                ctx.reply(...constructionFormatter.landSizeDisplay());
                return ctx.wizard.selectStep(4); // jump to 5'th controller (land size)
            }
            ctx.reply(...constructionFormatter.companyExpienceDisplay());
            return ctx.wizard.next();
        });
    }
    chooseCompanyExpience(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(constructionFormatter.messages.useButtonError);
            if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.reply(...constructionFormatter.chooseSizeDisplay());
                return ctx.wizard.back();
            }
            if (!(0, string_1.isInInlineOption)(callbackQuery.data, constructionFormatter.companyExperienceOption))
                return ctx.reply(...constructionFormatter.messages.unknowOptionError);
            ctx.wizard.state.company_experience = callbackQuery.data;
            yield (0, chat_1.deleteMessageWithCallback)(ctx);
            ctx.reply(...constructionFormatter.documentRequestDisplay());
            return ctx.wizard.next();
        });
    }
    chooseDocumentRequestType(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(constructionFormatter.messages.useButtonError);
            if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.reply(...constructionFormatter.companyExpienceDisplay());
                return ctx.wizard.back();
            }
            if (!(0, string_1.isInInlineOption)(callbackQuery.data, constructionFormatter.documentRequestOption))
                return ctx.reply(...constructionFormatter.messages.unknowOptionError);
            ctx.wizard.state.document_request_type = callbackQuery.data;
            yield (0, chat_1.deleteMessageWithCallback)(ctx);
            ctx.reply(...constructionFormatter.locationDisplay());
            return ctx.wizard.selectStep(6); // jump to 7'th controller (location)
        });
    }
    chooseLandSize(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(constructionFormatter.messages.useButtonError);
            if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.reply(...constructionFormatter.chooseSizeDisplay());
                return ctx.wizard.selectStep(1); // jump  to first controller(size option)
            }
            if (!(0, string_1.isInInlineOption)(callbackQuery.data, constructionFormatter.landSizeOption))
                return ctx.reply(...constructionFormatter.messages.unknowOptionError);
            ctx.wizard.state.land_size = callbackQuery.data;
            yield (0, chat_1.deleteMessageWithCallback)(ctx);
            ctx.reply(...constructionFormatter.landStatusDisplay());
            return ctx.wizard.next();
        });
    }
    chooseLandStatus(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(constructionFormatter.messages.useButtonError);
            if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.reply(...constructionFormatter.landSizeDisplay());
                return ctx.wizard.back();
            }
            if (!(0, string_1.isInInlineOption)(callbackQuery.data, constructionFormatter.landStatusOption))
                return ctx.reply(...constructionFormatter.messages.unknowOptionError);
            ctx.wizard.state.land_status = callbackQuery.data;
            yield (0, chat_1.deleteMessageWithCallback)(ctx);
            ctx.reply(...constructionFormatter.locationDisplay());
            return ctx.wizard.next(); // jump back to second controller
        });
    }
    enterLocation(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                if ((0, string_1.areEqaul)(ctx.wizard.state.construction_size, 'small', true)) {
                    yield (0, chat_1.deleteKeyboardMarkup)(ctx, constructionFormatter.messages.documentRequestTypePrompt);
                    ctx.reply(...constructionFormatter.documentRequestDisplay());
                    return ctx.wizard.selectStep(3); // jump to 4'th controller (document request type)
                }
                yield (0, chat_1.deleteKeyboardMarkup)(ctx, constructionFormatter.messages.landStatusPrompt);
                const validationMessage = (0, post_validaor_1.postValidator)('location', message);
                if (validationMessage != 'valid')
                    return yield ctx.reply(validationMessage);
                ctx.reply(...constructionFormatter.documentRequestDisplay());
                return ctx.wizard.back(); // jump to 4'th controller (document request type)
            }
            // assign the location to the state
            ctx.wizard.state.location = message;
            yield ctx.reply(...constructionFormatter.descriptionDisplay());
            return ctx.wizard.next();
        });
    }
    enterDescription(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const sender = (0, chat_1.findSender)(ctx);
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                ctx.reply(...constructionFormatter.locationDisplay());
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
                return yield ctx.reply(...constructionFormatter.somethingWentWrongError());
            ctx.wizard.state.user = {
                id: user === null || user === void 0 ? void 0 : user.id,
                display_name: user === null || user === void 0 ? void 0 : user.display_name,
            };
            ctx.wizard.state.description = message;
            ctx.wizard.state.status = 'preview';
            ctx.wizard.state.notify_option = (user === null || user === void 0 ? void 0 : user.notify_option) || 'none';
            if ((0, string_1.areEqaul)(ctx.wizard.state.construction_size, 'small', true)) {
                (0, chat_1.deleteKeyboardMarkup)(ctx);
                ctx.replyWithHTML(...constructionFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                ctx.reply(...constructionFormatter.previewCallToAction());
                return ctx.wizard.selectStep(9); // jump to 10'th controller
            }
            ctx.reply(...constructionFormatter.photoDisplay());
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
                ctx.reply(...constructionFormatter.descriptionDisplay());
                this.clearImageWaiting(sender.id);
                return ctx.wizard.back();
            }
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                ctx.reply(...constructionFormatter.descriptionDisplay());
                this.clearImageWaiting(sender.id);
                return ctx.wizard.back();
            }
            // check if image is attached
            if (!ctx.message.photo)
                return ctx.reply(...constructionFormatter.photoDisplay());
            // Add the image to the array
            const photo_id = ctx.message.photo[0].file_id;
            const photo_url = yield ctx.telegram.getFileLink(photo_id);
            imagesUploaded.push(photo_id);
            imagesUploadedURL.push(photo_url.href);
            // Check if all images received
            if (imagesUploaded.length == constructionFormatter.imagesNumber) {
                this.clearImageWaiting(sender.id);
                const file = yield ctx.telegram.getFile(ctx.message.photo[0].file_id);
                const mediaGroup = imagesUploaded.map((image) => ({
                    media: image,
                    type: 'photo',
                    caption: image == imagesUploaded[0] ? 'Here are the images you uploaded' : '',
                }));
                yield ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);
                // Save the images to the state
                ctx.wizard.state.photo = imagesUploaded;
                ctx.wizard.state.photo_url = imagesUploadedURL;
                ctx.wizard.state.status = 'preview';
                // empty the images array
                imagesUploaded = [];
                // deleteKeyboardMarkup(ctx);
                ctx.replyWithHTML(...constructionFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                // ctx.reply(...constructionFormatter.previewCallToAction());
                return ctx.wizard.next();
            }
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
                    yield ctx.reply(...constructionFormatter.photoDisplay(), constructionFormatter.goBackButton());
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
                        ctx.replyWithHTML(...constructionFormatter.editPreview(state));
                        // jump to edit data
                        return ctx.wizard.selectStep(10);
                    }
                    case 'post_data': {
                        // api request to post the data
                        const postDto = {
                            construction_size: ctx.wizard.state.construction_size,
                            company_experience: ctx.wizard.state.company_experience,
                            document_request_type: ctx.wizard.state.document_request_type,
                            land_size: ctx.wizard.state.land_size,
                            land_status: ctx.wizard.state.land_status,
                            location: ctx.wizard.state.location,
                            photo: ctx.wizard.state.photo,
                            photo_url: ctx.wizard.state.photo_url,
                            description: ctx.wizard.state.description,
                            category: ctx.wizard.state.category,
                            notify_option: ctx.wizard.state.notify_option,
                            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
                        };
                        const response = yield post_service_1.default.createCategoryPost(postDto, callbackQuery.from.id);
                        if (response === null || response === void 0 ? void 0 : response.success) {
                            ctx.wizard.state.post_id = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id;
                            ctx.wizard.state.post_main_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.post_id;
                            yield (0, dialog_1.displayDialog)(ctx, constructionFormatter.messages.postSuccessMsg, true);
                            yield (0, chat_1.deleteMessageWithCallback)(ctx);
                            const elements = ctx.wizard.state.photo ? (0, string_1.extractElements)(ctx.wizard.state.photo) : null;
                            const [caption, button] = constructionFormatter.preview(ctx.wizard.state, 'submitted');
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
                                yield ctx.replyWithHTML(...constructionFormatter.preview(ctx.wizard.state, 'submitted'));
                            }
                            // jump to posted review
                            return ctx.wizard.selectStep(12);
                        }
                        else {
                            ctx.reply(...constructionFormatter.postingError());
                            return mainmenu_controller_1.default.onStart(ctx);
                            if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
                                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                                ctx.scene.leave();
                                return mainmenu_controller_1.default.onStart(ctx);
                            }
                        }
                        //   ctx.reply(...constructionFormatter.postingSuccessful());
                        // ctx.scene.leave();
                        // return MainMenuController.onStart(ctx);
                        // } else {
                        //   ctx.reply(...constructionFormatter.postingError());
                        //   if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
                        //     await deleteMessageWithCallback(ctx);
                        //       ctx.scene.leave();
                        // return MainMenuController.onStart(ctx);
                        //   }
                        // increment the registration attempt
                        // return (ctx.wizard.state.postingAttempt = ctx.wizard.state.postingAttempt
                        //   ? parseInt(ctx.wizard.state.postingAttempt) + 1
                        //   : 1);
                    }
                    case 'notify_settings': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.reply(...constructionFormatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
                        // jump to notify setting
                        return ctx.wizard.selectStep(13);
                    }
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
                            return yield ctx.reply(...constructionFormatter.noPostsErrorMessage());
                        }
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.reply(...constructionFormatter.mentionPostMessage());
                        for (const post of posts) {
                            yield ctx.reply(...constructionFormatter.displayPreviousPostsList(post));
                        }
                        // jump to mention previous post
                        return ctx.wizard.selectStep(14);
                    }
                    case 'remove_mention_previous_post': {
                        state.mention_post_data = '';
                        state.mention_post_id = '';
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        return ctx.replyWithHTML(...constructionFormatter.preview(state));
                    }
                    case 'editing_done': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.replyWithHTML(...constructionFormatter.preview(state));
                        // return to preview
                        return ctx.wizard.selectStep(9);
                    }
                    case 'cancel': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        ctx.scene.leave();
                        return mainmenu_controller_1.default.onStart(ctx);
                    }
                    default: {
                        yield ctx.reply('DEFAULT');
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
                    yield ctx.replyWithHTML(...constructionFormatter.preview(ctx.wizard.state));
                    return ctx.wizard.back();
                }
                if (callbackQuery.data.startsWith('select_post_')) {
                    const post_id = callbackQuery.data.split('_')[2];
                    state.mention_post_id = post_id;
                    state.mention_post_data = ctx.callbackQuery.message.text;
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.replyWithHTML(...constructionFormatter.preview(state));
                    // go back to preview
                    return ctx.wizard.selectStep(9);
                }
            }
        });
    }
    editData(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const state = ctx.wizard.state;
            const fileds = [
                'document_request_type',
                'company_experience',
                'land_size',
                'land_status',
                'location',
                'description',
                'photo',
            ];
            const callbackQuery = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery;
            const editField = (_a = ctx.wizard.state) === null || _a === void 0 ? void 0 : _a.editField;
            if (!callbackQuery) {
                const messageText = ctx.message.text;
                if (!editField)
                    return yield ctx.reply('invalid input ');
                // changing field value
                ctx.wizard.state[editField] = messageText;
                yield (0, chat_1.deleteKeyboardMarkup)(ctx);
                return ctx.replyWithHTML(...constructionFormatter.editPreview(state), { parse_mode: 'HTML' });
            }
            // if callback exists
            // save the mesage id for later deleting
            ctx.wizard.state.previousMessageData = {
                message_id: ctx.callbackQuery.message.message_id,
                chat_id: ctx.callbackQuery.message.chat.id,
            };
            const callbackMessage = callbackQuery.data;
            if (callbackMessage == 'editing_done') {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.replyWithHTML(...constructionFormatter.preview(state));
                // jump to preview
                return ctx.wizard.selectStep(9);
            }
            if (fileds.some((filed) => filed == callbackQuery.data)) {
                // selecting field to change
                ctx.wizard.state.editField = callbackMessage;
                yield ctx.telegram.deleteMessage(ctx.wizard.state.previousMessageData.chat_id, ctx.wizard.state.previousMessageData.message_id);
                yield ctx.reply(...(yield constructionFormatter.editFieldDispay(callbackMessage)));
                if ((0, string_1.areEqaul)(callbackQuery.data, 'photo', true))
                    return ctx.wizard.next();
                return;
            }
            if (editField) {
                //  if edit filed is selected change field valued
                ctx.wizard.state[editField] = callbackMessage;
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.wizard.state.editField = null;
                return ctx.replyWithHTML(...constructionFormatter.editPreview(state), { parse_mode: 'HTML' });
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
                ctx.reply(...constructionFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
                this.clearImageWaiting(sender.id);
                return ctx.wizard.back();
            }
            if (messageText && (0, string_1.areEqaul)(messageText, 'back', true)) {
                yield (0, chat_1.deleteMessage)(ctx, {
                    message_id: (parseInt(messageText.message_id) - 1).toString(),
                    chat_id: messageText.chat.id,
                });
                ctx.replyWithHTML(...constructionFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
                this.clearImageWaiting(sender.id);
                return ctx.wizard.back();
            }
            // check if image is attached
            if (!ctx.message.photo)
                return ctx.reply(...constructionFormatter.photoDisplay());
            // Add the image to the array
            const photo_id = ctx.message.photo[0].file_id;
            const photo_url = yield ctx.telegram.getFileLink(photo_id);
            imagesUploaded.push(photo_id);
            imagesUploadedURL.push(photo_url.href);
            // Check if all images received
            if (imagesUploaded.length === constructionFormatter.imagesNumber) {
                this.clearImageWaiting(sender.id);
                const file = yield ctx.telegram.getFile(ctx.message.photo[0].file_id);
                const mediaGroup = imagesUploaded.map((image) => ({
                    media: image,
                    type: 'photo',
                    caption: image == imagesUploaded[0] ? 'Here are the images you uploaded' : '',
                }));
                yield ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);
                // Save the images to the state
                ctx.wizard.state.photo = imagesUploaded;
                ctx.wizard.state.photo_url = imagesUploadedURL;
                // empty the images array
                // imagesUploaded.length = 0;
                ctx.replyWithHTML(...constructionFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
                return ctx.wizard.back();
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
                        construction_size: ctx.wizard.state.construction_size,
                        company_experience: ctx.wizard.state.company_experience,
                        document_request_type: ctx.wizard.state.document_request_type,
                        land_size: ctx.wizard.state.land_size,
                        land_status: ctx.wizard.state.land_status,
                        location: ctx.wizard.state.location,
                        photo: ctx.wizard.state.photo,
                        photo_url: ctx.wizard.state.photo_url,
                        description: ctx.wizard.state.description,
                        category: ctx.wizard.state.category,
                        notify_option: ctx.wizard.state.notify_option,
                        previous_post_id: ctx.wizard.state.mention_post_id || undefined,
                    };
                    const response = yield post_service_1.default.createCategoryPost(postDto, callbackQuery.from.id);
                    if (!(response === null || response === void 0 ? void 0 : response.success))
                        yield yield (0, dialog_1.displayDialog)(ctx, constructionFormatter.messages.resubmitError);
                    ctx.wizard.state.post_id = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id;
                    ctx.wizard.state.post_main_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.post_id;
                    yield (0, dialog_1.displayDialog)(ctx, constructionFormatter.messages.postResubmit);
                    return ctx.editMessageReplyMarkup({
                        inline_keyboard: [
                            [{ text: 'Cancel', callback_data: `cancel_post` }],
                            [{ text: 'Main menu', callback_data: 'main_menu' }],
                        ],
                    });
                }
                case 'cancel_post': {
                    const deleted = yield post_service_1.default.deletePostById(ctx.wizard.state.post_main_id);
                    if (!deleted)
                        return yield (0, dialog_1.displayDialog)(ctx, constructionFormatter.messages.postErroMsg);
                    yield (0, dialog_1.displayDialog)(ctx, constructionFormatter.messages.postCancelled);
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
            yield (0, dialog_1.displayDialog)(ctx, constructionFormatter.messages.notifySettingChanged.concat(` to  ${notify_option.toUpperCase()}`));
            yield (0, chat_1.deleteMessageWithCallback)(ctx);
            yield ctx.replyWithHTML(...constructionFormatter.preview(ctx.wizard.state));
            return ctx.wizard.selectStep(9);
        });
    }
}
exports.default = QuestionPostSectionConstructionController;
//# sourceMappingURL=construction.controller.js.map