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
exports.resetPassword = exports.verifyResetOtp = exports.forgotPassword = exports.loginAdmin = exports.deleteAdmin = exports.updateUserStatus = exports.updateAdminStatus = exports.createAdmin = exports.deleteUserPosts = exports.deletePost = exports.updatePostStatus = exports.getUserPosts = exports.getUserDetail = exports.getAdmins = exports.getUsers = exports.getPostDetail = exports.getPosts = exports.getPhotoUrls = void 0;
const telegraf_1 = require("telegraf");
const config_1 = __importDefault(require("../config/config"));
const bot_1 = __importDefault(require("../loaders/bot"));
const post_controller_1 = __importDefault(require("../modules/post/post.controller"));
const sendEmail_1 = __importDefault(require("../utils/helpers/sendEmail"));
const string_1 = require("../utils/helpers/string");
const service_1 = __importDefault(require("./service"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const { status, message } = yield service_1.default.crateDefaultAdmin();
    if (status == 'success') {
        yield (0, sendEmail_1.default)(config_1.default.super_admin_email, 'Admin Account Created', (0, string_1.formatAccountCreationEmailMsg)(config_1.default.super_admin_password));
    }
}))();
const getPhotoUrls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const bot = new telegraf_1.Telegraf(config_1.default.bot_token);
        const fileIds = Object.entries(req.query);
        const fileLinks = [];
        for (const [key, fileId] of fileIds) {
            try {
                const fileLink = yield ((_a = bot.telegram) === null || _a === void 0 ? void 0 : _a.getFileLink(fileId));
                fileLinks.push({ fileId, url: fileLink.href, success: true, key });
            }
            catch (error) {
                console.log(error);
                fileLinks.push({ fileId, success: false, message: 'Error fetching image' });
            }
        }
        res.json({ success: true, files: fileLinks });
    }
    catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.getPhotoUrls = getPhotoUrls;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status: postStatus, category, page, itemsPerPage } = req.query;
    const { status, data, message } = yield service_1.default.getPosts({
        status: postStatus,
        category,
        page: page || 1,
        itemsPerPage: itemsPerPage || 10,
    });
    if (status == 'fail') {
        res.status(500).json({
            status,
            message,
        });
    }
    return res.status(200).json({
        status,
        data: data,
    });
});
exports.getPosts = getPosts;
const getPostDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post_id = req.params.id;
    try {
        const { status, data, message } = yield service_1.default.getPostById(post_id);
        if (status == 'fail') {
            res.status(500).json({
                status,
                message,
                data: null,
            });
        }
        return res.status(200).json({
            status,
            data: data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
            data: null,
        });
    }
});
exports.getPostDetail = getPostDetail;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status: userStatus, page, itemsPerPage } = req.query;
    try {
        const { status, data, message } = yield service_1.default.getUsers({
            status: userStatus,
            page: page || 1,
            itemsPerPage: itemsPerPage || 10,
        });
        if (status == 'fail') {
            return res.status(500).json({
                status,
                message,
                data: null,
            });
        }
        return res.status(200).json({
            status,
            message,
            data: data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
            data: null,
        });
    }
});
exports.getUsers = getUsers;
const getAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status: userStatus, page, itemsPerPage } = req.query;
    try {
        const { status, data, message } = yield service_1.default.getAdmins({
            status: userStatus,
            page: page || 1,
            itemsPerPage: itemsPerPage || 10,
        });
        if (status == 'fail') {
            return res.status(500).json({
                status,
                message,
                data: null,
            });
        }
        return res.status(200).json({
            status,
            message,
            data: data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
            data: null,
        });
    }
});
exports.getAdmins = getAdmins;
const getUserDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const { status, data, message } = yield service_1.default.getUser(id);
        if (status == 'fail') {
            return res.status(500).json({
                status,
                message,
                data: null,
            });
        }
        return res.status(200).json({
            status,
            message,
            data: data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
            data: null,
        });
    }
});
exports.getUserDetail = getUserDetail;
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { status: postStatus, category, page, itemsPerPage } = req.query;
    try {
        const { status, data, message } = yield service_1.default.getUserPosts({
            status: postStatus,
            category,
            page: page || 1,
            itemsPerPage: itemsPerPage || 10,
            userId,
        });
        if (status == 'fail') {
            return res.status(500).json({
                status,
                message,
                data: null,
            });
        }
        return res.status(200).json({
            status,
            message,
            data: data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
            data: null,
        });
    }
});
exports.getUserPosts = getUserPosts;
const updatePostStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bot = (0, bot_1.default)();
    const { postId, status: postStatus } = req.body;
    const { data, status, message } = yield service_1.default.updatePostStatus(postId, postStatus);
    if (status == 'fail')
        return res.status(500).json({
            status: 'fail',
            message,
        });
    if (!data) {
        return res.status(404).json({
            status: 'fail',
            message: 'No post found',
        });
    }
    if (postStatus == 'open') {
        const { status, message } = yield post_controller_1.default.sendPostToUser(bot, data);
        yield post_controller_1.default.postToChannel(bot, config_1.default.channel_id, data);
    }
    return res.status(200).json({
        status: 'success',
        message: 'Post status updated',
        data: 'post',
    });
});
exports.updatePostStatus = updatePostStatus;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post_id = req.params.id;
    try {
        const { status, message } = yield service_1.default.deletePostById(post_id);
        if (status == 'fail') {
            return res.status(500).json({
                status,
                message,
            });
        }
        return res.status(200).json({
            status,
            message,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
});
exports.deletePost = deletePost;
const deleteUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.params.id;
        const { status, message } = yield service_1.default.deletePostById(user_id);
        if (status == 'fail') {
            return res.status(500).json({
                status,
                message,
            });
        }
        return res.status(200).json({
            status,
            message,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
});
exports.deleteUserPosts = deleteUserPosts;
function createAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { first_name, last_name, email, password } = req.body;
            const { status, message, data } = yield service_1.default.createAdmin({
                first_name,
                last_name,
                email,
                password,
                role: 'ADMIN',
            });
            if (status == 'fail') {
                return res.status(400).json({
                    status,
                    message,
                    data: null,
                });
            }
            yield (0, sendEmail_1.default)(email, 'Admin Account Created', (0, string_1.formatAccountCreationEmailMsg)(password));
            return res.status(200).json({
                status,
                message,
                data,
            });
        }
        catch (error) {
            res.status(500).json({
                status: 'fail',
                message: error.message,
                data: null,
            });
        }
    });
}
exports.createAdmin = createAdmin;
function updateAdminStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { adminId, status: adminStatus } = req.body;
            const { status, message } = yield service_1.default.updateAdminStatus({
                adminId,
                status: adminStatus,
            });
            if (status == 'fail') {
                return res.status(400).json({
                    status,
                    message,
                    data: null,
                });
            }
            return res.status(200).json({
                status,
                message,
            });
        }
        catch (error) {
            res.status(500).json({
                status: 'fail',
                message: error.message,
            });
        }
    });
}
exports.updateAdminStatus = updateAdminStatus;
function updateUserStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const { userId, status: userStatus, reason } = req.body;
            const { status, message } = yield service_1.default.updateUserStatus({
                userId,
                status: userStatus,
                reason,
            });
            if (status == 'fail') {
                return res.status(400).json({
                    status,
                    message,
                    data: null,
                });
            }
            return res.status(200).json({
                status,
                message,
            });
        }
        catch (error) {
            res.status(500).json({
                status: 'fail',
                message: error.message,
            });
        }
    });
}
exports.updateUserStatus = updateUserStatus;
function deleteAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { status, message } = yield service_1.default.deleteAdminById({ adminId: id });
            if (status === 'fail') {
                return res.status(400).json({
                    status,
                    message,
                    data: null,
                });
            }
            return res.status(200).json({
                status,
                message,
            });
        }
        catch (error) {
            res.status(500).json({
                status: 'fail',
                message: error.message,
            });
        }
    });
}
exports.deleteAdmin = deleteAdmin;
function loginAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const { status, message, data } = yield service_1.default.loginAdmin({ email, password });
            if (status == 'fail') {
                return res.status(400).json({
                    status,
                    message,
                    data: null,
                });
            }
            return res.status(200).json({
                status,
                message,
                data,
            });
        }
        catch (error) {
            res.status(500).json({
                status: 'fail',
                message: error.message,
                data: null,
            });
        }
    });
}
exports.loginAdmin = loginAdmin;
function forgotPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const { status, message, data: otp } = yield service_1.default.createOTP({ email });
            if (status == 'fail') {
                return res.status(400).json({
                    status,
                    message,
                });
            }
            yield (0, sendEmail_1.default)(email, 'Reset your password', (0, string_1.formatResetOptEmailMsg)(otp));
            return res.status(200).json({
                status,
                message,
            });
        }
        catch (error) {
            res.status(500).json({
                status: 'fail',
                message: error.message,
            });
        }
    });
}
exports.forgotPassword = forgotPassword;
function verifyResetOtp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide all required fields',
            });
        }
        try {
            const { status, message } = yield service_1.default.verifyResetOtp({ email, otp });
            if (status === 'fail') {
                return res.status(400).json({
                    status,
                    message,
                });
            }
            return res.status(200).json({
                status,
                message,
            });
        }
        catch (error) {
            res.status(500).json({
                status: 'fail',
                message: error.message,
            });
        }
    });
}
exports.verifyResetOtp = verifyResetOtp;
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, confirmPassword } = req.body;
        try {
            if (!email || !password || !confirmPassword) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Please provide all required fields',
                });
            }
            const { status, message } = yield service_1.default.resetPassword({ email, password, confirmPassword });
            if (status === 'fail') {
                return res.status(400).json({
                    status,
                    message,
                });
            }
            return res.status(200).json({
                status,
                message,
            });
        }
        catch (error) {
            return res.status(400).json({
                status: 'fail',
                message: error.message,
            });
        }
    });
}
exports.resetPassword = resetPassword;
//# sourceMappingURL=controller.js.map