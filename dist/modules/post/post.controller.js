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
const config_1 = __importDefault(require("../../config/config"));
const chat_1 = require("../../utils/helpers/chat");
const string_1 = require("../../utils/helpers/string");
const mainmenu_controller_1 = __importDefault(require("../mainmenu/mainmenu.controller"));
const profile_service_1 = __importDefault(require("../profile/profile.service"));
const post_formmater_1 = __importDefault(require("./post.formmater"));
const post_service_1 = __importDefault(require("./post.service"));
const questionService = new post_service_1.default();
const profileService = new profile_service_1.default();
const postFormmatter = new post_formmater_1.default();
const roundSize = 10;
class PostController {
    constructor() {
        postFormmatter.chooseCityFormatter('et', 1);
    }
    static handleSearch(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const query = (_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.update) === null || _a === void 0 ? void 0 : _a.inline_query) === null || _b === void 0 ? void 0 : _b.query;
            if (!query || query.trim() == '')
                return;
            const { success, posts } = yield questionService.getAllPostsByDescription(query);
            if (!success)
                return yield ctx.reply('unable to make search');
            if (posts.length == 0)
                return yield ctx.answerInlineQuery([...postFormmatter.formatNoQuestionsErrorMessage()], {
                    button: postFormmatter.seachQuestionTopBar(0, query),
                });
            return yield ctx.answerInlineQuery([...postFormmatter.formatSearchQuestions(posts)], {
                button: postFormmatter.seachQuestionTopBar(posts.length, query),
                cache_time: 0,
            });
        });
    }
    static handleAnswerBrowseQuery(ctx, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query.startsWith('answer')) {
                const [_, postId] = query.split('_');
                // get question data from the answerinlinequery
                const questionData = {
                    postId: '0',
                    question: 'Hello guys here is my question 3',
                    questionText: '#tech\n\nWhat is the best programming language for beginners? \n\nBy: @username',
                    description: 'Asked 1 month ago, 2 Answers',
                };
                yield ctx.reply(`${questionData.questionText}`, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'Browse', callback_data: 'browse' },
                                { text: 'Subscribe', callback_data: 'subscribe' },
                            ],
                        ],
                    },
                });
                return yield ctx.reply(
                // add copy sticker
                'Send me your answer   \n\n`Note that you can send your answer through voice, or you could send your answer with media(photo, video, audio)`', {
                    reply_markup: {
                        keyboard: [[{ text: 'Back' }]],
                        resize_keyboard: true,
                    },
                    parse_mode: 'Markdown',
                });
            }
            if (query.startsWith('browse')) {
                return yield ctx.reply('Browse');
            }
        });
    }
    static handleAnswerQuery(ctx, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = (0, chat_1.findSender)(ctx);
            const [_, postId] = query.split('_');
            const { success, post } = yield questionService.getPostById(postId);
            if (!success || !post)
                return ctx.reply('error while');
            // const mediaGroup = question.photo.map((image) => ({
            //   media: image,
            //   type: 'photo',
            //   caption: 'Images uploaded with the Question',
            // }));
            // await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);
            // await ctx.replyWithHTML(...postFormmatter.formatSingleQuestion(question, true));
            // await ctx.reply(
            //   // add copy sticker
            //   'Send me your answer   \n\n`Note that you can send your answer through voice, or you could send your answer with media(photo, video, audio)`',
            //   {
            //     reply_markup: {
            //       keyboard: [[{ text: 'cancel' }]],
            //       resize_keyboard: true,
            //     },
            //     parse_mode: 'Markdown',
            //   },
            // );
            ctx.replyWithMarkdown(' selected ');
            ctx.scene.enter('answer_scene');
            ctx.session.usersSession = {
                [sender.id]: { postId },
            };
        });
    }
    static AnswerQuestion(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const sender = (0, chat_1.findSender)(ctx);
            const userSesion = ctx.session.usersSession[sender.id];
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message && (0, string_1.areEqaul)(message, 'cancel', true)) {
                ctx.scene.leave();
                return mainmenu_controller_1.default.onStart(ctx);
            }
            const postId = userSesion.postId;
            if (!postId) {
                ctx.replyWithMarkdown('No question selected ');
                ctx.replyWithMarkdown('No question selected ');
                ctx.scene.leave();
            }
            if (message.startsWith('/start'))
                return;
            const answer = message;
            ctx.wizard.state.answer = answer;
            const user = yield profileService.getProfileByTgId(sender.id);
            if (user)
                ctx.replyWithHTML(...postFormmatter.formatAnswerPreview(answer, user), { parse_mode: 'HTML' });
            return ctx.wizard.next();
        });
    }
    static AnswerQuestionPreview(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            const message = ctx.message.text;
            if (message && (0, string_1.areEqaul)(message, 'cancel', true)) {
                return ctx.reply('canceled ');
            }
            if (!callbackQuery)
                return ctx.reply(postFormmatter.messages.useButtonError);
            switch (callbackQuery.data) {
                case 'edit_answer': {
                    return yield ctx.reply(
                    // add copy sticker
                    'Send me your answer   \n\n`Note that you can send your answer through voice, or you could send your answer with media(photo, video, audio)`', {
                        reply_markup: {
                            keyboard: [[{ text: 'cancel' }]],
                            resize_keyboard: true,
                        },
                        parse_mode: 'Markdown',
                    });
                }
                case 'cancel_answer': {
                    (0, chat_1.deleteMessageWithCallback)(ctx);
                    ctx.scene.leave();
                    return mainmenu_controller_1.default.onStart(ctx);
                }
                case 'post_answer': {
                    (0, chat_1.deleteMessageWithCallback)(ctx);
                    ctx.reply('answered');
                    ctx.scene.leave();
                    return mainmenu_controller_1.default.onStart(ctx);
                }
            }
        });
    }
    static handleBrowseQuery(ctx, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query) {
                if (query.startsWith('answer')) {
                    const [_, postId] = query.split('_');
                    // get question data from the answerinlinequery
                    const questionData = {
                        postId: '0',
                        question: 'Hello guys here is my question 3',
                        questionText: '#tech\n\nWhat is the best programming language for beginners? \n\nBy: @username',
                        description: 'Asked 1 month ago, 2 Answers',
                    };
                    return yield ctx.reply(
                    // add copy sticker
                    'Send me your answer   \n\n`Note that you can send your answer through voice, or you could send your answer with media(photo, video, audio)`', {
                        reply_markup: {
                            keyboard: [[{ text: 'Back' }]],
                            resize_keyboard: true,
                        },
                        parse_mode: 'Markdown',
                    });
                }
                if (query === 'browse') {
                    return yield ctx.reply('Browse');
                }
            }
        });
    }
    static listAllPosts(ctx_1) {
        return __awaiter(this, arguments, void 0, function* (ctx, round = 1, searchString) {
            const { success, posts, nextRound, total } = searchString
                ? yield questionService.geAlltPostsByDescription(searchString, round)
                : yield questionService.geAlltPosts(round);
            if (!success)
                return ctx.reply('error while');
            for (const post of posts) {
                const sectionName = (0, string_1.getSectionName)(post.category);
                if (post[sectionName].photo && post[sectionName].photo[0])
                    yield ctx.replyWithPhoto(post[sectionName].photo[0], {
                        caption: postFormmatter.getformattedQuestionDetail(post),
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [[{ text: 'View Detail', callback_data: `post_detail:${post.id}` }]],
                        },
                    });
                else
                    yield ctx.replyWithHTML(postFormmatter.getformattedQuestionDetail(post), {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [[{ text: 'View Detail', callback_data: `post_detail:${post.id}` }]],
                        },
                    });
            }
            if (nextRound != round) {
                yield ctx.reply(...postFormmatter.nextRoundSeachedPostsPrompDisplay(round, total, searchString));
            }
        });
    }
    static getPostDetail(ctx, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { success, post } = yield questionService.getPostById(postId);
            if (!success || !post)
                return ctx.reply('error while');
            const sectionName = (0, string_1.getSectionName)(post.category);
            if (((_a = post[sectionName]) === null || _a === void 0 ? void 0 : _a.photo) && ((_b = post[sectionName]) === null || _b === void 0 ? void 0 : _b.photo[0])) {
                const elements = (0, string_1.extractElements)(post[sectionName].photo);
                if (elements) {
                    // if array of elelement has many photos
                    yield (0, chat_1.sendMediaGroup)(ctx, elements.firstNMinusOne, 'Images Uploaded with post');
                    yield (0, chat_1.replyDetailWithContext)({
                        ctx,
                        photoURl: elements.lastElement,
                        caption: postFormmatter.getformattedQuestionDetail(post),
                    });
                }
                else {
                    // if array of  has one  photo
                    yield (0, chat_1.replyDetailWithContext)({
                        ctx,
                        photoURl: post[sectionName].photo[0],
                        caption: postFormmatter.getformattedQuestionDetail(post),
                    });
                }
            }
            else
                return yield ctx.replyWithHTML(...postFormmatter.formatQuestionDetail(post)); // if post has no photo
        });
    }
    static searchByTitle() {
        return __awaiter(this, void 0, void 0, function* () {
            const { success, posts } = yield questionService.geAlltPosts(1);
        });
    }
    static postToChannel(bot, channelId, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const sectionName = (0, string_1.getSectionName)(post.category);
            if (post[sectionName].photo && post[sectionName].photo[0]) {
                // // if phost has image
                // await sendMediaGroupToChannel(bot, [(post as any)[sectionName].photo[0]], '');
                yield (0, chat_1.messagePostPreviewWithBot)({
                    bot,
                    post_id: post.id,
                    chat_id: config_1.default.channel_id,
                    photoURl: post[sectionName].photo[0],
                    caption: postFormmatter.getFormattedQuestionPreview(post),
                });
            }
            else
                yield (0, chat_1.messagePostPreview)(bot, config_1.default.channel_id, postFormmatter.getPostsPreview(post), post.id);
        });
    }
    static sendPostToUser(bot, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipientsIds = [];
            const followerings = post === null || post === void 0 ? void 0 : post.user.followings;
            const followers = post === null || post === void 0 ? void 0 : post.user.followers;
            if ((post === null || post === void 0 ? void 0 : post.notify_option) == 'friend') {
                if (followerings && (followerings === null || followerings === void 0 ? void 0 : followerings.length) > 0 && followers && (followers === null || followers === void 0 ? void 0 : followers.length) > 0) {
                    followers.forEach((follower) => {
                        followerings.forEach((followering) => {
                            if (follower.follower_id == followering.following_id) {
                                recipientsIds.push(follower.follower_id);
                            }
                        });
                    });
                }
            }
            if ((post === null || post === void 0 ? void 0 : post.notify_option) == 'follower') {
                if (followers && followers.length > 0) {
                    followers.forEach((follower) => {
                        recipientsIds.push(follower.follower_id);
                    });
                }
            }
            if (recipientsIds.length > 0) {
                const { status, recipientChatIds } = yield questionService.getFilteredRecipients(recipientsIds, post.user.id);
                if (status == 'fail')
                    return { status: 'fail', message: 'message not send to user , unable to find recipients chat id' };
                if (recipientChatIds.length < 0)
                    return { status: 'fail', message: 'message not send to user, all recipients have blocked the user' };
                const sectionName = (0, string_1.getSectionName)(post.category);
                for (const chatId of recipientChatIds) {
                    if (post[sectionName].photo && post[sectionName].photo[0]) {
                        yield (0, chat_1.messagePostPreviewWithBot)({
                            bot,
                            post_id: post.id,
                            chat_id: chatId.chat_id,
                            photoURl: post[sectionName].photo[0],
                            caption: postFormmatter.getFormattedQuestionPreview(post),
                        });
                    }
                }
                return { status: 'success', message: 'message sent to user ' };
            }
            else
                return { status: 'success', message: 'no  recipients ' };
        });
    }
}
exports.default = PostController;
//# sourceMappingURL=post.controller.js.map