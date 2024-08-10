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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_connecion_1 = __importDefault(require("../../../../loaders/db-connecion"));
const uuid_1 = require("uuid");
class Section4ConstructionService {
    constructor() { }
    static createPost(postDto, tg_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find user with tg_id
                const user = yield db_connecion_1.default.user.findUnique({
                    where: {
                        tg_id: tg_id.toString(),
                    },
                });
                if (!user) {
                    return {
                        success: false,
                        post: null,
                        message: 'User not found',
                    };
                }
                // Create question and store it
                const post = yield db_connecion_1.default.post.create({
                    data: Object.assign(Object.assign({}, postDto), { user_id: user.id, notify_option: postDto.notify_option, status: 'pending' }),
                });
                return {
                    success: true,
                    post: post,
                    message: 'post created',
                };
            }
            catch (error) {
                console.error(error);
                return {
                    success: false,
                    post: null,
                    message: 'An error occurred while creating the post',
                };
            }
        });
    }
    static createConstructionPost(postData, tg_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newPost = yield this.createPost({
                    description: postData.description,
                    category: postData.category,
                    notify_option: postData.notify_option,
                }, tg_id);
                if (!newPost.success || !newPost.post)
                    return {
                        success: false,
                        data: null,
                        message: newPost.message,
                    };
                const { description, category, notify_option } = postData, constructionData = __rest(postData, ["description", "category", "notify_option"]);
                // Create constuction post and store it
                const newConstructionePost = yield db_connecion_1.default.service4Construction.create({
                    data: Object.assign({ id: (0, uuid_1.v4)(), post_id: newPost.post.id }, constructionData),
                });
                return {
                    success: true,
                    data: newConstructionePost,
                    message: 'Post created successfully',
                };
            }
            catch (error) {
                console.error(error);
                return {
                    success: false,
                    data: null,
                    message: 'An error occurred while creating the question',
                };
            }
        });
    }
}
exports.default = Section4ConstructionService;
//# sourceMappingURL=construction.service.js.map