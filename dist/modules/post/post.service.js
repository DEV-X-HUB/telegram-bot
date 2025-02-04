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
const db_connecion_1 = __importDefault(require("../../loaders/db-connecion"));
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../../config/config"));
class PostService {
    constructor() { }
    static createpost(post, tg_id) {
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
                        data: null,
                        message: 'User not found',
                    };
                }
                // Create question and store it
                const question = yield db_connecion_1.default.post.create({
                    data: Object.assign(Object.assign({ id: (0, uuid_1.v4)() }, post), { user_id: user.id, status: 'pending' }),
                });
                return {
                    success: true,
                    data: question,
                    message: 'Question created successfully',
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
                    data: Object.assign(Object.assign({}, postDto), { status: 'pending', user_id: user.id }),
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
    static createCategoryPost(postDto, tg_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { description, category, notify_option, previous_post_id } = postDto;
                const postData = yield this.createPost({
                    description,
                    category,
                    notify_option,
                    previous_post_id,
                }, tg_id);
                if (!postData.success || !postData.post)
                    return {
                        success: false,
                        data: null,
                        message: postData.message,
                    };
                let post = null;
                switch (category) {
                    case 'Section 1A': {
                        const _a = postDto, { description, category, notify_option, previous_post_id } = _a, createCategoryPostDto = __rest(_a, ["description", "category", "notify_option", "previous_post_id"]);
                        post = yield db_connecion_1.default.service1A.create({
                            data: Object.assign({ post_id: postData.post.id }, createCategoryPostDto),
                        });
                        break;
                    }
                    case 'Section 1B': {
                        const _b = postDto, { description, category, notify_option, previous_post_id } = _b, createCategoryPostDto = __rest(_b, ["description", "category", "notify_option", "previous_post_id"]);
                        post = yield db_connecion_1.default.service1B.create({
                            data: Object.assign({ post_id: postData.post.id }, createCategoryPostDto),
                        });
                        break;
                    }
                    case 'Section 1C': {
                        const _c = postDto, { description, category, notify_option, previous_post_id } = _c, createCategoryPostDto = __rest(_c, ["description", "category", "notify_option", "previous_post_id"]);
                        post = yield db_connecion_1.default.service1C.create({
                            data: Object.assign({ post_id: postData.post.id }, createCategoryPostDto),
                        });
                        break;
                    }
                    case 'Section 2': {
                        const _d = postDto, { description, category, notify_option, previous_post_id } = _d, createCategoryPostDto = __rest(_d, ["description", "category", "notify_option", "previous_post_id"]);
                        post = yield db_connecion_1.default.service2.create({
                            data: Object.assign({ post_id: postData.post.id }, createCategoryPostDto),
                        });
                        break;
                    }
                    case 'Section 3': {
                        const _e = postDto, { description, category, notify_option, previous_post_id } = _e, createCategoryPostDto = __rest(_e, ["description", "category", "notify_option", "previous_post_id"]);
                        post = yield db_connecion_1.default.service3.create({
                            data: Object.assign({ post_id: postData.post.id }, createCategoryPostDto),
                        });
                        break;
                    }
                    case 'ChickenFarm': {
                        const _f = postDto, { description, category, notify_option, previous_post_id } = _f, createCategoryPostDto = __rest(_f, ["description", "category", "notify_option", "previous_post_id"]);
                        post = yield db_connecion_1.default.service4ChickenFarm.create({
                            data: Object.assign({ post_id: postData.post.id }, createCategoryPostDto),
                        });
                        break;
                    }
                    case 'Construction': {
                        const _g = postDto, { description, category, notify_option, previous_post_id } = _g, createCategoryPostDto = __rest(_g, ["description", "category", "notify_option", "previous_post_id"]);
                        post = yield db_connecion_1.default.service4Construction.create({
                            data: Object.assign({ post_id: postData.post.id }, createCategoryPostDto),
                        });
                        break;
                    }
                    case 'Manufacture':
                        {
                            const _h = postDto, { description, category, notify_option, previous_post_id } = _h, createCategoryPostDto = __rest(_h, ["description", "category", "notify_option", "previous_post_id"]);
                            post = yield db_connecion_1.default.service4Manufacture.create({
                                data: Object.assign({ post_id: postData.post.id }, createCategoryPostDto),
                            });
                        }
                        break;
                }
                if (post)
                    return {
                        success: true,
                        data: Object.assign(Object.assign({}, post), { post_id: postData.post.id }),
                        message: 'Post created successfully',
                    };
            }
            catch (error) {
                console.error(error);
                return {
                    success: false,
                    data: null,
                    message: 'An error occurred while creating the post',
                };
            }
        });
    }
    static deletePostById(postId, category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_connecion_1.default.post.delete({ where: { id: postId } });
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
            // try {
            //   switch (category) {
            //     case 'Section 1A':
            //       await prisma.post.delete({ where: { id: postId } });
            //       break;
            //     case 'Service4ChickenFarm':
            //       await prisma.post.delete({ where: { id: postId } });
            //     case 'Service4Construction':
            //       await prisma.post.delete({ where: { id: postId } });
            //     case 'Service4Manufacture':
            //       await prisma.post.delete({ where: { id: postId } });
            //   }
            //   return true;
            // } catch (error) {
            //   console.log(error);
            //   return false;
            // }
        });
    }
    static getUserPosts(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield db_connecion_1.default.post.findMany({
                    where: {
                        user_id,
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                display_name: true,
                            },
                        },
                    },
                });
                return { success: true, posts: posts, message: 'success' };
            }
            catch (error) {
                console.log(error);
                return { success: false, posts: null, message: error === null || error === void 0 ? void 0 : error.message };
            }
        });
    }
    static getUserPostsByTgId(tg_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_connecion_1.default.user.findUnique({
                where: {
                    tg_id: tg_id.toString(),
                },
            });
            if (!user)
                return { success: false, posts: null, message: `No user found with telegram Id ${tg_id}` };
            try {
                const posts = yield db_connecion_1.default.post.findMany({
                    where: {
                        user_id: user.id,
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                display_name: true,
                            },
                        },
                        Service1A: true,
                        Service1B: true,
                        Service1C: true,
                        Service2: true,
                        Service3: true,
                        Service4ChickenFarm: true,
                        Service4Manufacture: true,
                        Service4Construction: true,
                    },
                });
                return { success: true, posts: posts, message: 'success' };
            }
            catch (error) {
                console.log(error);
                return { success: false, posts: null, message: error === null || error === void 0 ? void 0 : error.message };
            }
        });
    }
    static getPostById(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield db_connecion_1.default.post.findFirst({
                    where: {
                        id: post_id,
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                display_name: true,
                            },
                        },
                        Service1A: true,
                        Service1B: true,
                        Service1C: true,
                        Service2: true,
                        Service3: true,
                        Service4ChickenFarm: true,
                        Service4Manufacture: true,
                        Service4Construction: true,
                    },
                });
                return { success: true, post: post, message: 'success' };
            }
            catch (error) {
                console.log(error);
                return { success: false, post: null, message: error === null || error === void 0 ? void 0 : error.message };
            }
        });
    }
    static updatePostStatusByUser(postId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield db_connecion_1.default.post.update({
                    where: { id: postId },
                    data: {
                        status: status,
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                display_name: true,
                            },
                        },
                        Service1A: true,
                        Service1B: true,
                        Service1C: true,
                        Service2: true,
                        Service3: true,
                        Service4ChickenFarm: true,
                        Service4Manufacture: true,
                        Service4Construction: true,
                    },
                });
                return {
                    status: 'success',
                    message: 'Post status updated',
                    data: post,
                };
            }
            catch (error) {
                console.log(error);
                return {
                    status: 'fail',
                    message: 'Unable to update Post',
                    data: null,
                };
            }
        });
    }
    getPostsByDescription(searchText) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield db_connecion_1.default.post.findMany({
                    where: {
                        description: {
                            contains: searchText,
                        },
                        status: {
                            not: {
                            // equals: 'pending',
                            },
                        },
                    },
                    include: {
                        user: {
                            select: { id: true, display_name: true },
                        },
                    },
                });
                return {
                    success: true,
                    posts: posts,
                };
            }
            catch (error) {
                console.error('Error searching questions:', error);
                return { success: false, posts: [] };
            }
        });
    }
    geAlltPosts(round) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = ((round - 1) * parseInt(config_1.default.number_of_result || '5'));
            const postCount = yield db_connecion_1.default.post.count();
            try {
                const posts = yield db_connecion_1.default.post.findMany({
                    where: {
                        status: {
                            not: {
                            // equals: 'pending',
                            },
                        },
                    },
                    include: {
                        user: {
                            select: { id: true, display_name: true },
                        },
                        Service1A: true,
                        Service1B: true,
                        Service1C: true,
                        Service2: true,
                        Service3: true,
                        Service4ChickenFarm: true,
                        Service4Manufacture: true,
                        Service4Construction: true,
                    },
                    skip,
                    take: parseInt(config_1.default.number_of_result || '5'),
                });
                return {
                    success: true,
                    posts: posts,
                    nextRound: posts.length == postCount ? round : round + 1,
                    total: postCount,
                };
            }
            catch (error) {
                console.error('Error searching questions:', error);
                return { success: true, posts: [], nextRound: round, total: 0 };
            }
        });
    }
    geAlltPostsByDescription(searchText, round) {
        return __awaiter(this, void 0, void 0, function* () {
            const postPerRound = parseInt(config_1.default.number_of_result || '5');
            const skip = (round - 1) * postPerRound;
            try {
                const postCount = yield db_connecion_1.default.post.count({
                    where: {
                        description: {
                            contains: searchText,
                        },
                    },
                });
                const posts = yield db_connecion_1.default.post.findMany({
                    skip: skip,
                    take: postPerRound,
                    where: {
                        description: {
                            contains: searchText,
                        },
                        status: {
                            not: {
                            // equals: 'pending',
                            },
                        },
                    },
                    include: {
                        user: {
                            select: { id: true, display_name: true },
                        },
                        Service1A: true,
                        Service1B: true,
                        Service1C: true,
                        Service2: true,
                        Service3: true,
                        Service4ChickenFarm: true,
                        Service4Manufacture: true,
                        Service4Construction: true,
                    },
                });
                return {
                    success: true,
                    posts: posts,
                    nextRound: posts.length == postCount ? round : round + 1,
                    total: postCount,
                };
            }
            catch (error) {
                console.error('Error searching questions:', error);
                return { success: true, posts: [], nextRound: round, total: 0 };
            }
        });
    }
    getPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield db_connecion_1.default.post.findFirst({
                    where: { id: postId },
                    include: {
                        user: {
                            select: {
                                id: true,
                                display_name: true,
                                followers: true,
                                followings: true,
                                blocked_users: true,
                            },
                        },
                        Service1A: true,
                        Service1B: true,
                        Service1C: true,
                        Service2: true,
                        Service3: true,
                        Service4ChickenFarm: true,
                        Service4Manufacture: true,
                        Service4Construction: true,
                    },
                });
                return {
                    success: true,
                    post,
                };
            }
            catch (error) {
                console.error('Error searching questions:', error);
                return { success: true, post: null };
            }
        });
    }
    getFollowersChatId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield db_connecion_1.default.post.findFirst({
                    where: { id: postId },
                    include: {
                        user: {
                            select: {
                                id: true,
                                display_name: true,
                                followers: true,
                                followings: true,
                            },
                        },
                        Service1A: true,
                        Service1B: true,
                        Service1C: true,
                        Service2: true,
                        Service3: true,
                        Service4ChickenFarm: true,
                        Service4Manufacture: true,
                        Service4Construction: true,
                    },
                });
                return {
                    success: true,
                    post,
                };
            }
            catch (error) {
                console.error('Error searching questions:', error);
                return { success: true, post: null };
            }
        });
    }
    getChatIds(recipientsIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatIds = yield db_connecion_1.default.user.findMany({
                    where: {
                        id: { in: recipientsIds },
                    },
                    select: {
                        chat_id: true,
                    },
                });
                return {
                    success: true,
                    chatIds,
                };
            }
            catch (error) {
                console.error('Error searching questions:', error);
                return { success: true, chatIds: [] };
            }
        });
    }
    getFilteredRecipients(recipientsIds, posterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipientChatIds = yield db_connecion_1.default.user.findMany({
                    where: {
                        id: {
                            in: recipientsIds,
                        },
                    },
                    select: {
                        chat_id: true,
                    },
                });
                return { status: 'success', recipientChatIds: recipientChatIds };
            }
            catch (error) {
                console.error('Error checking if user is following:', error);
                return { status: 'fail', recipientChatIds: [] };
            }
        });
    }
    getAllPostsByDescription(description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield db_connecion_1.default.post.findMany({
                    where: {
                        description: {
                            contains: description,
                        },
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                display_name: true,
                            },
                        },
                        Service1A: true,
                        Service1B: true,
                        Service1C: true,
                        Service2: true,
                        Service3: true,
                        Service4ChickenFarm: true,
                        Service4Manufacture: true,
                        Service4Construction: true,
                    },
                });
                return {
                    success: true,
                    posts,
                };
            }
            catch (error) {
                console.error('Error searching questions:', error);
                return { success: true, posts: [] };
            }
        });
    }
    getAllPostsWithQuery(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, page = 1) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
            // only one post per page
            const pageSize = 1;
            const { category, status, timeframe } = query;
            let formattedTimeframe;
            let lastDigit;
            let lastDigitStartsFrom;
            let lastDigitUpTo;
            let filterDate = new Date();
            const cityName = (_b = (_a = query === null || query === void 0 ? void 0 : query.fields) === null || _a === void 0 ? void 0 : _a.city) === null || _b === void 0 ? void 0 : _b.cityName;
            const arBrValue = (_c = query === null || query === void 0 ? void 0 : query.fields) === null || _c === void 0 ? void 0 : _c.ar_br;
            const mainCategory = (_d = query === null || query === void 0 ? void 0 : query.fields) === null || _d === void 0 ? void 0 : _d.main_category;
            const subCategory = (_e = query === null || query === void 0 ? void 0 : query.fields) === null || _e === void 0 ? void 0 : _e.sub_category;
            const servieType = (_f = query === null || query === void 0 ? void 0 : query.fields) === null || _f === void 0 ? void 0 : _f.service_type;
            const birthOrMarital = (_g = query === null || query === void 0 ? void 0 : query.fields) === null || _g === void 0 ? void 0 : _g.birth_or_marital;
            if (((_j = String((_h = query === null || query === void 0 ? void 0 : query.fields) === null || _h === void 0 ? void 0 : _h.last_digit)) === null || _j === void 0 ? void 0 : _j.startsWith('bi')) || ((_l = String((_k = query === null || query === void 0 ? void 0 : query.fields) === null || _k === void 0 ? void 0 : _k.last_digit)) === null || _l === void 0 ? void 0 : _l.startsWith('di'))) {
                lastDigit = (_o = (_m = query === null || query === void 0 ? void 0 : query.fields) === null || _m === void 0 ? void 0 : _m.last_digit) === null || _o === void 0 ? void 0 : _o.split('-')[0];
                lastDigitStartsFrom = Number((_q = (_p = query === null || query === void 0 ? void 0 : query.fields) === null || _p === void 0 ? void 0 : _p.last_digit) === null || _q === void 0 ? void 0 : _q.split('-')[1]);
                lastDigitUpTo = Number((_s = (_r = query === null || query === void 0 ? void 0 : query.fields) === null || _r === void 0 ? void 0 : _r.last_digit) === null || _s === void 0 ? void 0 : _s.split('-')[2]);
            }
            else
                lastDigit = 'all';
            let columnSpecificWhereCondition = { AND: [] };
            switch (category) {
                case 'Section 1A':
                    columnSpecificWhereCondition.AND = [
                        {
                            Service1A: {
                                arbr_value: !arBrValue || arBrValue == 'all' ? undefined : { equals: arBrValue },
                                last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
                                id_first_option: lastDigit == 'all' ? undefined : { equals: lastDigit },
                                city: cityName !== 'all'
                                    ? {
                                        mode: 'insensitive',
                                        equals: cityName,
                                    }
                                    : undefined,
                            },
                        },
                    ];
                    break;
                case 'Section 1B':
                    columnSpecificWhereCondition.AND = [
                        {
                            Service1B: {
                                main_category: !((_t = query === null || query === void 0 ? void 0 : query.fields) === null || _t === void 0 ? void 0 : _t.main_category) || mainCategory == 'all' ? undefined : { equals: mainCategory },
                                sub_category: !subCategory || subCategory == 'all' || mainCategory == 'all' ? undefined : { equals: subCategory },
                                city: cityName !== 'all'
                                    ? {
                                        mode: 'insensitive',
                                        equals: cityName,
                                    }
                                    : undefined,
                                last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
                                id_first_option: lastDigit == 'all' ? undefined : { equals: lastDigit },
                            },
                        },
                    ];
                    break;
                case 'Section 1C':
                    columnSpecificWhereCondition.AND = [
                        {
                            Service1C: {
                                arbr_value: !arBrValue || arBrValue == 'all' ? undefined : { equals: arBrValue },
                                last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
                                id_first_option: lastDigit == 'all' ? undefined : { equals: lastDigit },
                                city: cityName !== 'all'
                                    ? {
                                        mode: 'insensitive',
                                        equals: cityName,
                                    }
                                    : undefined,
                            },
                        },
                    ];
                    break;
                case 'Section 3':
                    columnSpecificWhereCondition.AND = [
                        {
                            Service3: {
                                birth_or_marital: !((_u = query === null || query === void 0 ? void 0 : query.fields) === null || _u === void 0 ? void 0 : _u.birth_or_marital) || ((_v = query === null || query === void 0 ? void 0 : query.fields) === null || _v === void 0 ? void 0 : _v.birth_or_marital) == 'all'
                                    ? undefined
                                    : { equals: (_w = query === null || query === void 0 ? void 0 : query.fields) === null || _w === void 0 ? void 0 : _w.birth_or_marital },
                            },
                        },
                    ];
                    break;
                case 'Section 2':
                    columnSpecificWhereCondition.AND = [
                        servieType && {
                            Service2: {
                                service_type: servieType || {},
                            },
                        },
                    ];
                    break;
                case 'all':
                    {
                        console.log(lastDigit, 'last digi t');
                        if (lastDigitStartsFrom && lastDigitUpTo && lastDigit !== 'all') {
                            columnSpecificWhereCondition.AND = [
                                {
                                    OR: [
                                        {
                                            Service1A: {
                                                id_first_option: lastDigit,
                                                last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
                                            },
                                        },
                                        {
                                            Service1B: {
                                                id_first_option: lastDigit,
                                                last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
                                            },
                                        },
                                        {
                                            Service1C: {
                                                id_first_option: lastDigit,
                                                last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
                                            },
                                        },
                                    ],
                                },
                            ];
                        }
                        else
                            columnSpecificWhereCondition = { AND: [] };
                    }
                    break;
                default:
                    if (category)
                        columnSpecificWhereCondition.AND = [
                            {
                                category,
                            },
                        ];
            }
            switch (status) {
                case 'all':
                    columnSpecificWhereCondition.AND = [
                        ...columnSpecificWhereCondition.AND,
                        { status: { in: ['open', 'closed'] } },
                    ];
                    break;
                case 'open':
                    columnSpecificWhereCondition.AND = [...columnSpecificWhereCondition.AND, { status: status }];
                    break;
                case 'closed':
                    columnSpecificWhereCondition.status = status;
                    break;
                default:
                    columnSpecificWhereCondition.AND = [
                        ...columnSpecificWhereCondition.AND,
                        { status: { in: ['open', 'closed'] } },
                    ];
            }
            switch (timeframe) {
                case 'today': {
                    filterDate.setHours(0, 0, 0, 0);
                    break;
                }
                case 'week': {
                    filterDate.setDate(filterDate.getDate() - 7);
                    break;
                }
                case 'month': {
                    filterDate.setMonth(filterDate.getMonth() - 1);
                    break;
                }
            }
            if (timeframe && timeframe !== 'all')
                columnSpecificWhereCondition.AND = [
                    ...columnSpecificWhereCondition.AND,
                    { created_at: { gte: filterDate } },
                ];
            try {
                const totalCount = yield db_connecion_1.default.post.count({
                    where: Object.assign({}, columnSpecificWhereCondition),
                });
                console.log(query, JSON.stringify(columnSpecificWhereCondition), 'where condition');
                const totalPages = Math.ceil(totalCount / pageSize);
                const skip = (page - 1) * pageSize;
                const posts = yield db_connecion_1.default.post.findMany({
                    where: Object.assign({}, columnSpecificWhereCondition),
                    include: {
                        user: {
                            select: {
                                id: true,
                                display_name: true,
                            },
                        },
                        Service1A: true,
                        Service1B: true,
                        Service1C: true,
                        Service2: true,
                        Service3: true,
                        Service4ChickenFarm: true,
                        Service4Manufacture: true,
                        Service4Construction: true,
                    },
                    skip,
                    take: 1,
                });
                return {
                    success: true,
                    posts,
                    total: totalCount,
                    totalPages,
                    currentPage: page,
                };
            }
            catch (error) {
                console.error('Error searching questions:', error);
                return { success: true, posts: [] };
            }
        });
    }
}
exports.default = PostService;
//# sourceMappingURL=post.service.js.map