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
const db_connecion_1 = __importDefault(require("../../loaders/db-connecion"));
const uuid_1 = require("uuid");
const post_service_1 = __importDefault(require("../post/post.service"));
const postService = new post_service_1.default();
class ProfileService {
    constructor() { }
    isUserRegisteredWithPhone(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_connecion_1.default.user.findUnique({
                    where: {
                        phone_number: phoneNumber,
                    },
                });
                return Boolean(user);
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    getProfileByTgId(tgId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_connecion_1.default.user.findUnique({
                    where: {
                        tg_id: tgId.toString(),
                    },
                });
                return user;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getProfileById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_connecion_1.default.user.findUnique({
                    where: {
                        id: user_id.toString(),
                    },
                });
                return user;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getProfileDataWithTgId(tgId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_connecion_1.default.user.findUnique({
                    where: {
                        tg_id: tgId.toString(),
                    },
                    include: {
                        posts: true,
                        followers: true,
                        followings: true,
                    },
                });
                return user;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getProfileDataWithId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_connecion_1.default.user.findUnique({
                    where: {
                        id: userId.toString(),
                    },
                    include: {
                        posts: true,
                        followers: true,
                        followings: true,
                    },
                });
                return user;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    updateNotifySettingByTgId(tg_id, notify_option) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_connecion_1.default.user.update({
                    where: {
                        tg_id: tg_id,
                    },
                    data: {
                        notify_option,
                    },
                });
                return { success: true, message: 'success' };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: 'unable to update notify setting ' };
            }
        });
    }
    updateProfile(userId, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield db_connecion_1.default.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        gender: newData.gender,
                        bio: newData.bio,
                        display_name: newData.display_name,
                        age: newData.age,
                        email: newData.email,
                        country: newData.country,
                        city: newData.city,
                    },
                });
                return yield db_connecion_1.default.user.findUnique({
                    where: {
                        id: userId,
                    },
                    include: {
                        posts: true,
                        followers: true,
                        followings: true,
                    },
                });
            }
            catch (error) {
                console.log(error);
                return null;
                throw new Error(`Error updating profile: ${error.message}`);
            }
        });
    }
    updateDiplayNameByTgId(tg_id, display_name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_connecion_1.default.user.update({
                    where: {
                        tg_id: tg_id,
                    },
                    data: {
                        display_name: display_name,
                    },
                });
                return { status: 'success', message: 'success' };
            }
            catch (error) {
                console.log(`: ${error.message}`);
                return { status: 'success', message: 'Error while updating display name' };
            }
        });
    }
    getFollowersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followers = yield db_connecion_1.default.follows.findMany({
                    where: {
                        following_id: userId,
                    },
                    include: {
                        following: {
                            select: {
                                display_name: true,
                                id: true,
                                tg_id: true,
                            },
                        },
                    },
                });
                return followers.map((entry) => entry.following);
            }
            catch (error) {
                throw new Error(`Error fetching followers: ${error.message}`);
            }
        });
    }
    getFollowingsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followings = yield db_connecion_1.default.follows.findMany({
                    where: {
                        follower_id: userId,
                    },
                    include: {
                        follower: {
                            select: {
                                display_name: true,
                                id: true,
                                tg_id: true,
                            },
                        },
                    },
                });
                return followings.map((entry) => entry.follower);
            }
            catch (error) {
                throw new Error(`Error fetching followers: ${error.message}`);
            }
        });
    }
    registerUser(createUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doesUserExist = yield this.isUserRegisteredWithPhone(createUserDto.phone_number);
                if (doesUserExist)
                    return { success: false, message: 'user exists', data: null };
                const createUserResult = yield this.createUser(createUserDto);
                return createUserResult;
            }
            catch (error) {
                console.error(error);
                return { success: false, message: 'unknown error', data: null };
            }
        });
    }
    createUser(createUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield db_connecion_1.default.user.create({
                    data: Object.assign({ id: (0, uuid_1.v4)() }, createUserDto),
                });
                return { success: true, data: newUser, message: 'user created' };
            }
            catch (error) {
                console.log(error);
                return { success: false, data: null, message: error === null || error === void 0 ? void 0 : error.message };
            }
        });
    }
    getUserPosts(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return post_service_1.default.getUserPosts(user_id);
        });
    }
    getPostById(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return post_service_1.default.getPostById(post_id);
        });
    }
    getUserPostsTgId(tg_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return post_service_1.default.getUserPostsByTgId(tg_id);
        });
    }
    followUser(followerId, followingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_connecion_1.default.follows.create({
                    data: {
                        follower_id: followerId,
                        following_id: followingId,
                    },
                });
                return { status: 'success', message: `You followed user with ID ${followingId}.` };
            }
            catch (error) {
                console.error('Error following user:', error);
                return { status: 'fail', message: `unable to make operation` };
            }
        });
    }
    unfollowUser(followerId, followingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_connecion_1.default.follows.deleteMany({
                    where: {
                        follower_id: followerId,
                        following_id: followingId,
                    },
                });
                return { status: 'success', message: `You Unfollowed user with ID ${followingId}.` };
            }
            catch (error) {
                console.error('Error unfollowing user:', error);
                return { status: 'fail', message: `unable to make operation` };
            }
        });
    }
    isBlockedBy(currentUserId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_connecion_1.default.user.findFirst({
                    where: {
                        id: currentUserId,
                    },
                    select: {
                        blocked_users: true,
                    },
                });
                if (!user)
                    return { status: 'success', isBlocked: false };
                const isBlocked = user === null || user === void 0 ? void 0 : user.blocked_users.find((blocked_user) => blocked_user == userId);
                return { status: 'success', isBlocked: isBlocked ? true : false };
            }
            catch (error) {
                console.error('Error checking if user is following:', error);
                return { status: 'fail', message: `unable to make operation`, isBlocked: false };
            }
        });
    }
    unblockUser(currentUserId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_connecion_1.default.user.findFirst({
                    where: {
                        id: currentUserId,
                    },
                    select: {
                        blocked_users: true,
                    },
                });
                if (!user)
                    return { status: 'fail', message: `success` };
                const filteredBlocks = user === null || user === void 0 ? void 0 : user.blocked_users.filter((blocked_user) => blocked_user != userId);
                yield db_connecion_1.default.user.update({
                    where: {
                        id: currentUserId,
                    },
                    data: {
                        blocked_users: filteredBlocks,
                    },
                });
                return { status: 'success', message: `success` };
            }
            catch (error) {
                console.error('Error checking if user is following:', error);
                return { status: 'fail', message: `unable to make operation` };
            }
        });
    }
    blockUser(currentUserId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_connecion_1.default.user.findFirst({
                    where: {
                        id: currentUserId,
                    },
                    select: {
                        blocked_users: true,
                    },
                });
                if (!user)
                    return { status: 'fail', message: `success` };
                const filteredBlocks = user === null || user === void 0 ? void 0 : user.blocked_users;
                yield db_connecion_1.default.user.update({
                    where: {
                        id: currentUserId,
                    },
                    data: {
                        blocked_users: [...filteredBlocks, userId],
                    },
                });
                return { status: 'success', message: `success` };
            }
            catch (error) {
                console.error('Error checking if user is following:', error);
                return { status: 'fail', message: `unable to make operation` };
            }
        });
    }
    isFollowing(currentUserId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const follow = yield db_connecion_1.default.follows.findFirst({
                    where: {
                        follower_id: currentUserId,
                        following_id: userId,
                    },
                });
                return { status: 'success', isFollowing: !!follow };
            }
            catch (error) {
                console.error('Error checking if user is following:', error);
                return { status: 'fail', message: `unable to make operation`, isFollowing: false };
            }
        });
    }
    isDisplayNameTaken(display_name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const follow = yield db_connecion_1.default.user.findFirst({
                    where: {
                        display_name,
                    },
                });
                return { status: 'success', isDisplayNameTaken: !!follow };
            }
            catch (error) {
                console.error('Error checking if user is following:', error);
                return { status: 'fail', message: `unable to make operation`, isDisplayNameTaken: false };
            }
        });
    }
    static fetchReceivedMessage(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield db_connecion_1.default.message.findMany({
                    where: {
                        receiver_id: user_id,
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                display_name: true,
                                chat_id: true,
                            },
                        },
                        receiver: {
                            select: {
                                id: true,
                                display_name: true,
                                chat_id: true,
                            },
                        },
                    },
                });
                return { status: 'success', messages };
            }
            catch (error) {
                console.error('Error checking if user is following:', error);
                return { status: 'fail', message: `unable to make operation`, messages: [] };
            }
        });
    }
    static fetchSendMessage(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield db_connecion_1.default.message.findMany({
                    where: {
                        sender_id: user_id,
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                display_name: true,
                                chat_id: true,
                            },
                        },
                        receiver: {
                            select: {
                                id: true,
                                display_name: true,
                                chat_id: true,
                            },
                        },
                    },
                });
                return { status: 'success', messages };
            }
            catch (error) {
                console.error('Error checking if user is following:', error);
                return { status: 'fail', message: `unable to make operation`, messages: [] };
            }
        });
    }
    static createMessage(user_id, receiver_id, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield db_connecion_1.default.message.create({
                    data: { id: (0, uuid_1.v4)(), content: message, sender_id: user_id, receiver_id },
                });
                return { success: true, data: newUser, message: 'user created' };
            }
            catch (error) {
                console.log(error);
                return { success: false, data: null, message: error === null || error === void 0 ? void 0 : error.message };
            }
        });
    }
    updatePostStatusByUser(postId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return post_service_1.default.updatePostStatusByUser(postId, status);
        });
    }
}
exports.default = ProfileService;
//# sourceMappingURL=profile.service.js.map