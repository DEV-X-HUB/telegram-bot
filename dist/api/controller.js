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
exports.resetPassword = exports.verifyResetOtp = exports.forgotPassword = exports.loginAdmin = exports.deleteAdmin = exports.updateUserStatus = exports.updateAdminStatus = exports.createAdmin = exports.deleteUserPosts = exports.deletePost = exports.updatePostStatus = exports.getUserPosts = exports.getPostDetail = exports.getPostsByCategory = exports.getPostsByStatus = exports.getPosts = void 0;
const config_1 = __importDefault(require("../config/config"));
const service_1 = __importDefault(require("./service"));
const bot_1 = __importDefault(require("../loaders/bot"));
const post_controller_1 = __importDefault(require("../modules/post/post.controller"));
const sendEmail_1 = __importDefault(require("../utils/helpers/sendEmail"));
const string_1 = require("../utils/helpers/string");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const { status, message } = yield service_1.default.crateDefaultAdmin();
    if (status == 'success') {
        yield (0, sendEmail_1.default)(config_1.default.super_admin_email, 'Admin Account Created', (0, string_1.formatAccountCreationEmailMsg)(config_1.default.super_admin_password));
    }
}))();
// express function to handle the request
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, data, message } = yield service_1.default.getPosts();
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
const getPostsByStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.params;
    if (!status) {
        return res.status(400).json({
            status: 'fail',
            message: 'Status parameter is required',
        });
    }
    const { status: fetchStatus, data, message } = yield service_1.default.getPostsByStatus(status);
    if (fetchStatus === 'fail') {
        return res.status(500).json({
            status: fetchStatus,
            message,
        });
    }
    return res.status(200).json({
        status: fetchStatus,
        data,
    });
});
exports.getPostsByStatus = getPostsByStatus;
const getPostsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    if (!category) {
        return res.status(400).json({
            status: 'fail',
            message: 'Status parameter is required',
        });
    }
    const { status: fetchStatus, data, message } = yield service_1.default.getPostsByCategory(category);
    if (fetchStatus === 'fail') {
        return res.status(500).json({
            status: fetchStatus,
            message,
        });
    }
    return res.status(200).json({
        status: fetchStatus,
        data,
    });
});
exports.getPostsByCategory = getPostsByCategory;
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
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.params.id;
    const round = req.params.round;
    try {
        const { status, data, message } = yield service_1.default.getUserPosts(user_id, parseInt(round));
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