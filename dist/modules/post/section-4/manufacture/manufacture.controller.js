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
const string_1 = require("../../../../utils/helpers/string");
const post_validaor_1 = require("../../../../utils/validator/post-validaor");
const mainmenu_controller_1 = __importDefault(require("../../../mainmenu/mainmenu.controller"));
const profile_service_1 = __importDefault(require("../../../profile/profile.service"));
const post_service_1 = __importDefault(require("../../post.service"));
const manufacture_formatter_1 = __importDefault(require("./manufacture.formatter"));
const manufacture_service_1 = __importDefault(require("./manufacture.service"));
const manufactureFormatter = new manufacture_formatter_1.default();
const profileService = new profile_service_1.default();
let imagesUploaded = [];
let imagesUploadedURL = [];
class ManufactureController {
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
                yield ctx.reply(manufactureFormatter.messages.imageWaitingMsg);
        });
    }
    constructor() {
        this.imageCounter = [];
    }
    start(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.wizard.state.category = 'Manufacture';
            yield ctx.reply(...manufactureFormatter.sectorPrompt());
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
            yield ctx.reply(...manufactureFormatter.numberOfWorkerPrompt());
            return ctx.wizard.next();
        });
    }
    chooseNumberOfWorker(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (callbackQuery) {
                if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                    yield ctx.reply(...manufactureFormatter.sectorPrompt());
                    return ctx.wizard.back();
                }
                if ((0, string_1.isInInlineOption)(callbackQuery.data, manufactureFormatter.numberOfWorkerOption)) {
                    ctx.wizard.state.number_of_worker = Number(callbackQuery.data);
                    console.log(typeof ctx.wizard.state.number_of_worker);
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.reply(...manufactureFormatter.estimatedCapitalPrompt());
                    return ctx.wizard.next();
                }
            }
            else {
                yield ctx.reply(...manufactureFormatter.inputError());
            }
        });
    }
    chooseEstimatedCapital(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (callbackQuery) {
                if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                    yield ctx.reply(...manufactureFormatter.numberOfWorkerPrompt());
                    return ctx.wizard.back();
                }
                if ((0, string_1.isInInlineOption)(callbackQuery.data, manufactureFormatter.estimatedCapitalOption)) {
                    ctx.wizard.state.estimated_capital = callbackQuery.data;
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.reply(...manufactureFormatter.enterpriseNamePrompt());
                    return ctx.wizard.next();
                }
            }
            else {
                yield ctx.reply(...manufactureFormatter.inputError());
            }
        });
    }
    enterEnterpriseName(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = ctx.message.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                yield ctx.reply(...manufactureFormatter.estimatedCapitalPrompt());
                return ctx.wizard.back();
            }
            const validationMessage = (0, post_validaor_1.postValidator)('title', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.enterprise_name = message;
            yield ctx.reply(...manufactureFormatter.descriptionPrompt());
            return ctx.wizard.next();
        });
    }
    enterDescription(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = ctx.message.text;
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                yield ctx.reply(...manufactureFormatter.enterpriseNamePrompt());
                return ctx.wizard.back();
            }
            const validationMessage = (0, post_validaor_1.postValidator)('description', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.description = message;
            yield ctx.reply(...manufactureFormatter.photoPrompt());
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
                ctx.reply(...manufactureFormatter.descriptionPrompt());
                this.clearImageWaiting(sender.id);
                return ctx.wizard.back();
            }
            this.setImageWaiting(ctx);
            if (ctx.message.document)
                return ctx.reply(`Please only upload compressed images`);
            if (message && (0, string_1.areEqaul)(message, 'back', true)) {
                ctx.reply(...manufactureFormatter.descriptionPrompt());
                this.clearImageWaiting(sender.id);
                return ctx.wizard.back();
            }
            // check if image is attached
            if (!ctx.message.photo)
                return ctx.reply(...manufactureFormatter.photoPrompt());
            // Add the image to the array
            const photo_id = ctx.message.photo[0].file_id;
            const photo_url = yield ctx.telegram.getFileLink(photo_id);
            imagesUploaded.push(photo_id);
            imagesUploadedURL.push(photo_url.href);
            // Check if all images received
            if (imagesUploaded.length == manufactureFormatter.imagesNumber) {
                this.clearImageWaiting(sender.id);
                const file = yield ctx.telegram.getFile(ctx.message.photo[0].file_id);
                // console.log(file);
                const mediaGroup = imagesUploaded.map((image) => ({
                    media: image,
                    type: 'photo',
                    caption: image == imagesUploaded[0] ? 'Here are the images you uploaded' : '',
                }));
                yield ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);
                const user = yield profileService.getProfileByTgId(sender.id);
                if (user) {
                    ctx.wizard.state.user = {
                        id: user.id,
                        display_name: user.display_name,
                    };
                }
                if (!user)
                    return yield ctx.reply(...manufactureFormatter.somethingWentWrongError());
                ctx.wizard.state.user = {
                    id: user === null || user === void 0 ? void 0 : user.id,
                    display_name: user === null || user === void 0 ? void 0 : user.display_name,
                };
                ctx.wizard.state.status = 'preview';
                ctx.wizard.state.notify_option = (user === null || user === void 0 ? void 0 : user.notify_option) || 'none';
                // Save the images to the state
                ctx.wizard.state.photo = imagesUploaded;
                ctx.wizard.state.photo_url = imagesUploadedURL;
                // empty the images array
                imagesUploaded = [];
                ctx.replyWithHTML(...manufactureFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                //   ctx.reply(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                //   ctx.reply(...postingFormatter.previewCallToAction());
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
                    yield ctx.reply(...manufactureFormatter.descriptionPrompt(), manufactureFormatter.goBackButton());
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
                        ctx.replyWithHTML(...manufactureFormatter.editPreview(state), { parse_mode: 'HTML' });
                        return ctx.wizard.next();
                    }
                    case 'editing_done': {
                        // await deleteMessageWithCallback(ctx);
                        yield ctx.replyWithHTML(manufactureFormatter.preview(state));
                        return ctx.wizard.back();
                    }
                    case 'post_data': {
                        // api request to post the data
                        const postDto = {
                            sector: ctx.wizard.state.sector,
                            number_of_workers: ctx.wizard.state.number_of_worker,
                            estimated_capital: ctx.wizard.state.estimated_capital,
                            enterprise_name: ctx.wizard.state.enterprise_name,
                            description: ctx.wizard.state.description,
                            photo: ctx.wizard.state.photo,
                            photo_url: ctx.wizard.state.photo_url,
                            category: ctx.wizard.state.category,
                            notify_option: ctx.wizard.state.notify_option,
                            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
                        };
                        const response = yield manufacture_service_1.default.createManufacturePost(postDto, callbackQuery.from.id);
                        // console.log(response);
                        // ctx.reply(...constructionFormatter.postingSuccessful());
                        if (response === null || response === void 0 ? void 0 : response.success) {
                            ctx.wizard.state.post_id = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id;
                            ctx.wizard.state.post_main_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.post_id;
                            yield (0, dialog_1.displayDialog)(ctx, manufactureFormatter.messages.postSuccessMsg, true);
                            yield (0, chat_1.deleteMessageWithCallback)(ctx);
                            // await ctx.replyWithHTML(...manufactureFormatter.preview(ctx.wizard.state, 'submitted'), {
                            //   parse_mode: 'HTML',
                            // });
                            const elements = (0, string_1.extractElements)(ctx.wizard.state.photo);
                            const [caption, button] = manufactureFormatter.preview(ctx.wizard.state, 'submitted');
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
                            // jump to posted review
                            return ctx.wizard.selectStep(10);
                        }
                        else {
                            ctx.reply(...manufactureFormatter.postingError());
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
                        yield ctx.reply(...manufactureFormatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
                        // jump to notify setting
                        return ctx.wizard.selectStep(11);
                    }
                    case 'mention_previous_post': {
                        console.log('mention_previous_post1');
                        yield ctx.reply('mention_previous_post');
                        // fetch previous posts of the user
                        const { posts, success, message } = yield post_service_1.default.getUserPostsByTgId(user.id);
                        if (!success || !posts) {
                            // remove past post
                            yield (0, chat_1.deleteMessageWithCallback)(ctx);
                            return yield ctx.reply(message);
                        }
                        if (posts.length == 0) {
                            yield (0, chat_1.deleteMessageWithCallback)(ctx);
                            return yield ctx.reply(...manufactureFormatter.noPostsErrorMessage());
                        }
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield ctx.reply(...manufactureFormatter.mentionPostMessage());
                        for (const post of posts) {
                            yield ctx.reply(...manufactureFormatter.displayPreviousPostsList(post));
                        }
                        // jump to mention previous post
                        return ctx.wizard.selectStep(12);
                    }
                    case 'remove_mention_previous_post': {
                        state.mention_post_data = '';
                        state.mention_post_id = '';
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        ctx.replyWithHTML(...manufactureFormatter.preview(state));
                        // return to preview
                        return ctx.wizard.selectStep(7);
                    }
                }
                // default: {
                //   await ctx.reply('DEFAULT');
                // }
            }
        });
    }
    editData(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const state = ctx.wizard.state;
            const fileds = [
                'sector',
                'number_of_worker',
                'estimated_capital',
                'enterprise_name',
                'description',
                'photo',
                'cancel',
                'done',
            ];
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
                return ctx.reply(...manufactureFormatter.editPreview(state), { parse_mode: 'HTML' });
            }
            // if callback exists
            // save the mesage id for later deleting
            ctx.wizard.state.previousMessageData = {
                message_id: ctx.callbackQuery.message.message_id,
                chat_id: ctx.callbackQuery.message.chat.id,
            };
            const callbackMessage = callbackQuery.data;
            if (callbackMessage == 'post_data') {
                // api request to post the data
                const response = yield manufacture_service_1.default.createManufacturePost({
                    sector: state.sector,
                    number_of_workers: state.number_of_worker,
                    estimated_capital: state.estimated_capital,
                    enterprise_name: state.enterprise_name,
                    description: state.description,
                    photo: state.photo,
                    photo_url: ctx.wizard.state.photo_url,
                    category: 'Manufacture',
                    notify_option: state.notify_option,
                }, callbackQuery.from.id);
                if (response === null || response === void 0 ? void 0 : response.success) {
                    console.log('Posting successful');
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield (0, dialog_1.displayDialog)(ctx, manufactureFormatter.messages.postingSuccess);
                    ctx.scene.leave();
                    return mainmenu_controller_1.default.onStart(ctx);
                }
                else {
                    ctx.reply(...manufactureFormatter.postingError());
                    if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        ctx.scene.leave();
                        return mainmenu_controller_1.default.onStart(ctx);
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
                // await deleteMessageWithCallback(ctx);
                yield ctx.replyWithHTML(...manufactureFormatter.preview(state));
                return ctx.wizard.back();
            }
            // if user chooses a field to edit
            if (fileds.some((filed) => filed == callbackQuery.data)) {
                // selecting field to change
                ctx.wizard.state.editField = callbackMessage;
                yield ctx.telegram.deleteMessage(ctx.wizard.state.previousMessageData.chat_id, ctx.wizard.state.previousMessageData.message_id);
                yield ctx.reply(...(yield manufactureFormatter.editFieldDisplay(callbackMessage)));
                return;
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
            if (messageText && (0, string_1.areEqaul)(messageText, 'back', true)) {
                ctx.reply(...manufactureFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
                this.clearImageWaiting(sender.id);
                return ctx.wizard.back();
            }
            // check if image is attached
            if (!ctx.message.photo)
                return ctx.reply(...manufactureFormatter.photoPrompt());
            if (messageText && (0, string_1.areEqaul)(messageText, 'back', true)) {
                yield (0, chat_1.deleteMessage)(ctx, {
                    message_id: (parseInt(messageText.message_id) - 1).toString(),
                    chat_id: messageText.chat.id,
                });
                ctx.reply(...manufactureFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
                this.clearImageWaiting(sender.id);
                return ctx.wizard.back();
            }
            // check if image is attached
            if (!ctx.message.photo)
                return ctx.reply(...manufactureFormatter.photoPrompt());
            // Add the image to the array
            const photo_id = ctx.message.photo[0].file_id;
            const photo_url = yield ctx.telegram.getFileLink(photo_id);
            imagesUploaded.push(photo_id);
            imagesUploadedURL.push(photo_url.href);
            // Check if all images received
            if (imagesUploaded.length === manufactureFormatter.imagesNumber) {
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
                ctx.replyWithHTML(...manufactureFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
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
                        sector: ctx.wizard.state.sector,
                        number_of_workers: ctx.wizard.state.number_of_worker,
                        estimated_capital: ctx.wizard.state.estimated_capital,
                        enterprise_name: ctx.wizard.state.enterprise_name,
                        description: ctx.wizard.state.description,
                        photo: ctx.wizard.state.photo,
                        photo_url: ctx.wizard.state.photo_url,
                        category: ctx.wizard.state.category,
                        notify_option: ctx.wizard.state.notify_option,
                        previous_post_id: ctx.wizard.state.mention_post_id || undefined,
                    };
                    const response = yield post_service_1.default.createCategoryPost(postDto, callbackQuery.from.id);
                    if (!(response === null || response === void 0 ? void 0 : response.success))
                        yield (0, dialog_1.displayDialog)(ctx, manufactureFormatter.messages.postErroMsg);
                    ctx.wizard.state.post_id = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id;
                    ctx.wizard.state.post_main_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.post_id;
                    yield (0, dialog_1.displayDialog)(ctx, manufactureFormatter.messages.postResubmit);
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
                    if (!deleted)
                        return yield (0, dialog_1.displayDialog)(ctx, manufactureFormatter.messages.postErroMsg);
                    yield (0, dialog_1.displayDialog)(ctx, manufactureFormatter.messages.postCancelled);
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
            yield (0, dialog_1.displayDialog)(ctx, manufactureFormatter.messages.notifySettingChanged.concat(` to  ${notify_option.toUpperCase()}`));
            yield (0, chat_1.deleteMessageWithCallback)(ctx);
            yield ctx.replyWithHTML(...manufactureFormatter.preview(ctx.wizard.state));
            return ctx.wizard.selectStep(7);
        });
    }
    mentionPreviousPost(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = ctx.wizard.state;
            console.log(state);
            const callbackQuery = ctx.callbackQuery;
            if (callbackQuery) {
                if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                    yield ctx.replyWithHTML(...manufactureFormatter.preview(ctx.wizard.state));
                    return ctx.wizard.back();
                }
                if (callbackQuery.data.startsWith('select_post_')) {
                    const post_id = callbackQuery.data.split('_')[2];
                    state.mention_post_id = post_id;
                    state.mention_post_data = ctx.callbackQuery.message.text;
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.replyWithHTML(...manufactureFormatter.preview(state));
                    // go back to preview
                    return ctx.wizard.selectStep(7);
                }
            }
        });
    }
}
exports.default = ManufactureController;
//# sourceMappingURL=manufacture.controller.js.map