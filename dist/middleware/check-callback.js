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
exports.checkQueries = exports.checkCallBacks = exports.checkVoice = void 0;
const profile_controller_1 = __importDefault(require("../modules/profile/profile.controller"));
const post_controller_1 = __importDefault(require("../modules/post/post.controller"));
const profileController = new profile_controller_1.default();
// Middleware to check if user entered command and redirect to its scene
const checkVoice = (ctx) => {
    var _a;
    console.log(ctx.message);
    if ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.voice)
        return ctx.replyWithHTML('<b>Voice is not allowed input currenlty ! </b> ');
};
exports.checkVoice = checkVoice;
function checkCallBacks() {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            (0, exports.checkVoice)(ctx);
            const callbackQuery = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery;
            if (!callbackQuery)
                return next();
            const query = callbackQuery.data;
            switch (true) {
                case query.startsWith('searchedPosts'): {
                    const [_, round] = query.split(':');
                    return post_controller_1.default.listAllPosts(ctx, round);
                }
                case query.startsWith('post_detail'): {
                    const [_, postId] = query.split(':');
                    return post_controller_1.default.getPostDetail(ctx, postId);
                }
                case query.startsWith('openPost'): {
                    const [_, postId] = query.split(':');
                    return profileController.handleOpenPost(ctx, postId);
                }
                case query.startsWith('closePost'): {
                    const [_, postId] = query.split(':');
                    return profileController.handleClosePost(ctx, postId);
                }
                case query.startsWith('cancelPost'): {
                    const [_, postId] = query.split(':');
                    return profileController.handleCancelPost(ctx, postId);
                }
                case query.startsWith('answer'):
                    return post_controller_1.default.handleAnswerQuery(ctx, query);
                case query.startsWith('browse'):
                    return post_controller_1.default.handleBrowseQuery(ctx, query);
                case query.startsWith('follow'):
                    return profileController.handleFollow(ctx, query);
                case query.startsWith('unfollow'):
                    return profileController.handlUnfollow(ctx, query);
                case query.startsWith('unblock'):
                    return profileController.handlUnblock(ctx, query);
                case query.startsWith('asktoBlock'):
                    return profileController.askToBlock(ctx, query);
                case query.startsWith('blockUser'):
                    return profileController.handleBlock(ctx, query);
                case query.startsWith('cancelBlock'):
                    return profileController.cancelBlock(ctx, query);
                case query.startsWith('sendMessage_'):
                    return ctx.scene.enter('chat');
                case query.startsWith('replyMessage_'):
                    return ctx.scene.enter('chat');
            }
            return next();
        }
        catch (error) {
            throw error;
        }
    });
}
exports.checkCallBacks = checkCallBacks;
function checkQueries(ctx, query, next) {
    try {
        switch (true) {
            case query.startsWith('searchedPosts'): {
                const [_, searachText, round] = query.split('_');
                return post_controller_1.default.listAllPosts(ctx, parseInt(round), searachText);
            }
            case query.startsWith('answer'): {
                return post_controller_1.default.handleAnswerQuery(ctx, query);
            }
            case query.startsWith('browse'): {
                return post_controller_1.default.handleBrowseQuery(ctx, query);
            }
            case query.startsWith('userProfile'):
                const [_, userId] = query.split('_');
                return profileController.viewProfileByThirdParty(ctx, userId);
            case query.startsWith('postDetail'): {
                const [_, postId] = query.split('_');
                return post_controller_1.default.getPostDetail(ctx, postId);
            }
            default:
                return next();
        }
    }
    catch (error) {
        throw error;
    }
}
exports.checkQueries = checkQueries;
//# sourceMappingURL=check-callback.js.map