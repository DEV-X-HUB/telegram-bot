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
exports.sendMediaGroupToChannel = exports.sendMediaGroupToUser = exports.messageJoinPrompt = exports.replyPostPreview = exports.replyUserPostPreviewWithContext = exports.replyDetailWithContext = exports.messagePostPreviewWithBot = exports.messagePostPreview = exports.sendMessage = exports.hasCallbackQuery = exports.sendMediaGroup = exports.getMessage = exports.findSender = exports.deleteKeyboardMarkup = exports.deleteMessageWithCallback = exports.deleteMessage = void 0;
const config_1 = __importDefault(require("../../config/config"));
const string_1 = require("./string");
const deleteMessage = (ctx, messageData) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.telegram.deleteMessage(messageData.chat_id, messageData.message_id);
});
exports.deleteMessage = deleteMessage;
const deleteMessageWithCallback = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, exports.deleteMessage)(ctx, {
        message_id: ctx.callbackQuery.message.message_id,
        chat_id: ctx.callbackQuery.message.chat.id,
    });
});
exports.deleteMessageWithCallback = deleteMessageWithCallback;
const deleteKeyboardMarkup = (ctx, message) => __awaiter(void 0, void 0, void 0, function* () {
    // it should be sent before any message
    const messageOptions = {
        reply_markup: {
            remove_keyboard: true,
        },
    };
    const text = '\u200C' + '.' + '\u200C';
    yield ctx.replyWithHTML(message || text, messageOptions);
    yield (0, exports.deleteMessage)(ctx, {
        message_id: (parseInt(ctx.message.message_id) + 1).toString(),
        chat_id: ctx.message.chat.id,
    });
});
exports.deleteKeyboardMarkup = deleteKeyboardMarkup;
const findSender = (ctx) => {
    var _a, _b, _c, _d;
    let sender;
    if (ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery)
        sender = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.from;
    if (ctx === null || ctx === void 0 ? void 0 : ctx.inline_query)
        sender = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.inline_query) === null || _b === void 0 ? void 0 : _b.from;
    if (ctx === null || ctx === void 0 ? void 0 : ctx.message)
        sender = (_c = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _c === void 0 ? void 0 : _c.from;
    if (ctx === null || ctx === void 0 ? void 0 : ctx.update.inline_query)
        sender = (_d = ctx === null || ctx === void 0 ? void 0 : ctx.update.inline_query) === null || _d === void 0 ? void 0 : _d.from;
    return sender;
};
exports.findSender = findSender;
const getMessage = (ctx) => {
    let message = {
        messsageType: 'unknown',
        value: '',
    };
    if (ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery)
        message = { messsageType: 'callback', value: ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery.data };
    if (ctx === null || ctx === void 0 ? void 0 : ctx.inline_query)
        message = { messsageType: 'inline_query', value: ctx === null || ctx === void 0 ? void 0 : ctx.inline_query };
    if (ctx === null || ctx === void 0 ? void 0 : ctx.message)
        message = { messsageType: 'text', value: ctx === null || ctx === void 0 ? void 0 : ctx.message.text };
    if (ctx === null || ctx === void 0 ? void 0 : ctx.update.inline_query)
        message = { messsageType: 'update_inline_query', value: ctx === null || ctx === void 0 ? void 0 : ctx.update.inline_query.query };
    return message;
};
exports.getMessage = getMessage;
const sendMediaGroup = (ctx_1, phtos_1, ...args_1) => __awaiter(void 0, [ctx_1, phtos_1, ...args_1], void 0, function* (ctx, phtos, caption = 'Here are the images you uploaded') {
    const mediaGroup = phtos.map((image) => ({
        media: image,
        type: 'photo',
        caption: caption,
    }));
    yield ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);
});
exports.sendMediaGroup = sendMediaGroup;
const hasCallbackQuery = (ctx, queryStarter) => {
    if (!ctx.callbackQuery)
        return false;
    const query = ctx.callbackQuery.data;
    return query.startsWith(queryStarter);
};
exports.hasCallbackQuery = hasCallbackQuery;
const sendMessage = (ctx, chatId, message, sender_id, message_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ctx.telegram.sendMessage(chatId, message, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [[{ text: '✍️ Reply', callback_data: `replyMessage_${sender_id}_${message_id}` }]],
        },
    });
});
exports.sendMessage = sendMessage;
const messagePostPreview = (bot, chatId, message, post_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bot.telegram.sendMessage(chatId, message, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [[{ text: 'View Detail', url: `${config_1.default.bot_url}?start=postDetail_${post_id}` }]],
        },
    });
});
exports.messagePostPreview = messagePostPreview;
const messagePostPreviewWithBot = (_a) => __awaiter(void 0, [_a], void 0, function* ({ bot, chat_id, caption, photoURl, post_id, }) {
    return yield bot.telegram.sendPhoto(chat_id, photoURl, {
        parse_mode: 'HTML',
        caption,
        reply_markup: {
            inline_keyboard: [[{ text: 'View Detail', url: `${config_1.default.bot_url}?start=postDetail_${post_id}` }]],
        },
    });
});
exports.messagePostPreviewWithBot = messagePostPreviewWithBot;
const replyDetailWithContext = (_b) => __awaiter(void 0, [_b], void 0, function* ({ ctx, caption, photoURl, }) {
    ctx.replyWithPhoto(photoURl, {
        parse_mode: 'HTML',
        caption,
    });
});
exports.replyDetailWithContext = replyDetailWithContext;
const replyUserPostPreviewWithContext = (_c) => __awaiter(void 0, [_c], void 0, function* ({ ctx, caption, photoURl, post_id, status, }) {
    ctx.replyWithPhoto(photoURl, {
        parse_mode: 'HTML',
        caption: (0, string_1.trimParagraph)(caption),
        reply_markup: {
            inline_keyboard: [
                [{ text: 'View Detail', url: `${config_1.default.bot_url}?start=postDetail_${post_id}` }],
                status == 'pending'
                    ? [
                        {
                            text: 'Cancel',
                            callback_data: `cancelPost:${post_id}`,
                        },
                    ]
                    : status == 'open'
                        ? [
                            {
                                text: 'Close',
                                callback_data: `closePost:${post_id}`,
                            },
                        ]
                        : status == 'close'
                            ? [
                                {
                                    text: 'Open',
                                    callback_data: `openPost:${post_id}`,
                                },
                            ]
                            : [
                                {
                                    text: 'Open',
                                    callback_data: `openPost:${post_id}`,
                                },
                            ],
            ],
        },
    });
});
exports.replyUserPostPreviewWithContext = replyUserPostPreviewWithContext;
const replyPostPreview = (_d) => __awaiter(void 0, [_d], void 0, function* ({ ctx, caption, photoURl }) {
    ctx.replyWithPhoto(photoURl, {
        parse_mode: 'HTML',
        caption,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Cancel', callback_data: 'cancel_post' }],
                [{ text: 'Main menu', callback_data: 'main_menu' }],
            ],
        },
    });
});
exports.replyPostPreview = replyPostPreview;
const messageJoinPrompt = (bot, chatId, message) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bot.telegram.sendMessage(chatId, message, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [[{ text: 'Join', url: `https://t.me/${config_1.default.channel_username}` }]],
        },
    });
});
exports.messageJoinPrompt = messageJoinPrompt;
const sendMediaGroupToUser = (ctx_2, chatId_1, photos_1, ...args_2) => __awaiter(void 0, [ctx_2, chatId_1, photos_1, ...args_2], void 0, function* (ctx, chatId, photos, caption = 'Images associated with the post') {
    const mediaGroup = photos.map((image) => ({
        media: image,
        type: 'photo',
        caption: caption,
    }));
    yield ctx.telegram.sendMediaGroup(chatId, mediaGroup);
});
exports.sendMediaGroupToUser = sendMediaGroupToUser;
const sendMediaGroupToChannel = (ctx_3, photos_2, ...args_3) => __awaiter(void 0, [ctx_3, photos_2, ...args_3], void 0, function* (ctx, photos, caption = 'Images associated with the post') {
    const mediaGroup = photos.map((image) => ({
        media: image,
        type: 'photo',
        caption: caption,
    }));
    yield ctx.telegram.sendMediaGroup(config_1.default.channel_id, mediaGroup);
});
exports.sendMediaGroupToChannel = sendMediaGroupToChannel;
//# sourceMappingURL=chat.js.map