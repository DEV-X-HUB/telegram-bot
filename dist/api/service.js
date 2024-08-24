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
const config_1 = __importDefault(require("../config/config"));
const db_connecion_1 = __importDefault(require("../loaders/db-connecion"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generatePassword_1 = __importDefault(require("../utils/generatePassword"));
class ApiService {
    static getPosts() {
        return __awaiter(this, arguments, void 0, function* (round = 1) {
            try {
                const posts = yield db_connecion_1.default.post.findMany({
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
                    status: 'success',
                    message: 'post fetched successfully',
                    data: posts,
                };
            }
            catch (error) {
                console.error('Error searching questions:', error);
                return { status: 'fail', message: error === null || error === void 0 ? void 0 : error.message, data: null };
            }
        });
    }
    static getPostsByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield db_connecion_1.default.post.findMany({
                    where: {
                        status: status,
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
                    status: 'success',
                    message: 'Posts fetched successfully',
                    data: posts,
                };
            }
            catch (error) {
                console.error('Error fetching posts:', error);
                return {
                    status: 'fail',
                    message: error === null || error === void 0 ? void 0 : error.message,
                    data: null,
                };
            }
        });
    }
    static getPostsByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield db_connecion_1.default.post.findMany({
                    where: {
                        category,
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
                    status: 'success',
                    message: 'Posts fetched successfully',
                    data: posts,
                };
            }
            catch (error) {
                console.error('Error fetching posts:', error);
                return {
                    status: 'fail',
                    message: error === null || error === void 0 ? void 0 : error.message,
                    data: null,
                };
            }
        });
    }
    static getUserPosts(userId, round) {
        return __awaiter(this, void 0, void 0, function* () {
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
                });
                return {
                    status: 'success',
                    message: 'post fetched successfully',
                    data: posts,
                };
            }
            catch (error) {
                console.error('Error searching questions:', error);
                return { status: 'fail', message: error === null || error === void 0 ? void 0 : error.message, data: null };
            }
        });
    }
    static getPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield db_connecion_1.default.post.findFirst({
                    where: { id: postId },
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
                    data: post,
                    message: 'success',
                };
            }
            catch (error) {
                console.error('Error searching questions:', error);
                return { status: 'fail', message: error === null || error === void 0 ? void 0 : error.message, data: null };
            }
        });
    }
    static updatePostStatus(postId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield db_connecion_1.default.post.update({
                    where: { id: postId },
                    data: {
                        status: status,
                    },
                    include: {
                        user: {
                            include: {
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
    static deletePostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_connecion_1.default.post.delete({ where: { id: postId } });
                return { status: 'success', message: 'post deleted successfully' };
            }
            catch (error) {
                console.log(error);
                return { status: 'fail', message: error === null || error === void 0 ? void 0 : error.message };
            }
        });
    }
    static deleteUserPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_connecion_1.default.post.deleteMany({ where: { user_id: userId } });
                return { status: 'success', message: 'post deleted successfully' };
            }
            catch (error) {
                console.log(error);
                return { status: 'fail', message: error === null || error === void 0 ? void 0 : error.message };
            }
        });
    }
    static createAdmin(createAdminDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { first_name, last_name, email, password, role } = createAdminDto;
            if (!first_name || !last_name || !email || !password) {
                return {
                    data: null,
                    status: 'fail',
                    message: 'Please provide all required fields',
                };
            }
            const adminExists = yield db_connecion_1.default.admin.findUnique({
                where: {
                    email,
                },
            });
            if (adminExists) {
                return {
                    data: null,
                    status: 'fail',
                    message: 'Admin already exists',
                };
            }
            try {
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const admin = yield db_connecion_1.default.admin.create({
                    data: {
                        first_name,
                        last_name,
                        email,
                        role,
                        password: hashedPassword,
                    },
                });
                return {
                    status: 'success',
                    message: 'Admin created Successfully',
                    data: { first_name, last_name, email, role, id: admin.id },
                };
            }
            catch (error) {
                return {
                    data: null,
                    status: 'fail',
                    message: error.message,
                };
            }
        });
    }
    static crateDefaultAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield db_connecion_1.default.admin.findMany({});
            if (!admin || admin.length == 0) {
                return yield this.createAdmin({
                    first_name: config_1.default.super_admin_firstname,
                    last_name: config_1.default.super_admin_firstname,
                    email: config_1.default.super_admin_email,
                    password: config_1.default.super_admin_password,
                    role: 'SUPER_ADMIN',
                });
            }
            else
                return {
                    status: 'fail',
                    message: '---admin exists---',
                    data: null,
                };
        });
    }
    static loginAdmin(signInDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = signInDto;
            if (!email || !password) {
                return {
                    data: null,
                    status: 'fail',
                    message: 'Please provide all required fields',
                };
            }
            try {
                const admin = yield db_connecion_1.default.admin.findUnique({
                    where: {
                        email,
                    },
                });
                if (!admin) {
                    return {
                        status: 'fail',
                        message: 'Email or password is incorrect',
                        data: null,
                    };
                }
                const isPasswordCorrect = yield bcrypt_1.default.compare(password, admin.password);
                if (!isPasswordCorrect) {
                    return {
                        status: 'fail',
                        message: 'Email or password is incorrect',
                        data: null,
                    };
                }
                if (admin.status == 'INACTIVE') {
                    return {
                        status: 'fail',
                        message: 'Your are currently Deactivated',
                        data: null,
                    };
                }
                // create a token
                const token = yield jsonwebtoken_1.default.sign({ id: admin.id, role: admin === null || admin === void 0 ? void 0 : admin.role }, config_1.default.jwt.secret, {
                    expiresIn: config_1.default.jwt.expires_in,
                });
                return {
                    status: 'success',
                    message: 'Admin logged in',
                    data: {
                        user: { id: admin.id, first_name: admin.first_name, last_name: admin.last_name, email: admin.email },
                        token,
                    },
                };
            }
            catch (error) {
                console.log(error);
                return {
                    status: 'fail',
                    message: error.message,
                    data: null,
                };
            }
        });
    }
    static createOTP(forgotPasswordDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = config_1.default.super_admin_email;
            if (!email) {
                return {
                    status: 'fail',
                    message: 'Please provide all required fields',
                    data: null,
                };
            }
            try {
                const admin = yield db_connecion_1.default.admin.findUnique({
                    where: {
                        email,
                    },
                });
                if (!admin) {
                    return {
                        status: 'fail',
                        message: 'Admin not found',
                        data: null,
                    };
                }
                const otp = (0, generatePassword_1.default)();
                const hashedOTP = yield bcrypt_1.default.hash(otp, 10);
                yield db_connecion_1.default.otp.upsert({
                    where: {
                        admin_id: admin.id,
                    },
                    update: {
                        otp: hashedOTP,
                        otp_expires: new Date(Date.now() + 600000), // 10 minutes
                    },
                    create: {
                        admin_id: admin.id,
                        otp: hashedOTP,
                        otp_expires: new Date(Date.now() + 600000), // 10 minutes
                    },
                });
                // send email
                return {
                    status: 'success',
                    message: 'OTP sent to your email',
                    data: otp,
                };
            }
            catch (error) {
                return {
                    status: 'fail',
                    message: error.message,
                    data: null,
                };
            }
        });
    }
    static updateAdminStatus(updateAdminStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { adminId, status } = updateAdminStatus;
                const admin = yield db_connecion_1.default.admin.findFirst({
                    where: {
                        id: adminId,
                        role: 'ADMIN',
                    },
                });
                if (!admin) {
                    return {
                        status: 'fail',
                        message: 'Admin not foundl',
                    };
                }
                yield db_connecion_1.default.admin.update({
                    where: {
                        id: adminId,
                    },
                    data: {
                        status: status,
                    },
                });
                return {
                    status: 'fail',
                    message: `Admin status updated to ${status}`,
                };
            }
            catch (error) {
                console.log(error);
                return {
                    status: 'fail',
                    message: error.message,
                };
            }
        });
    }
    static updateUserStatus(updateAdminStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, status, reason } = updateAdminStatus;
                const admin = yield db_connecion_1.default.user.findFirst({
                    where: {
                        id: userId,
                    },
                });
                if (!admin) {
                    return {
                        status: 'fail',
                        message: 'user  not found',
                    };
                }
                yield db_connecion_1.default.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        status,
                        inactive_reason: reason || '',
                    },
                });
                return {
                    status: 'fail',
                    message: `User  status updated to ${status}`,
                };
            }
            catch (error) {
                console.log(error);
                return {
                    status: 'fail',
                    message: error.message,
                };
            }
        });
    }
    static deleteAdminById(deleteAdminDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { adminId } = deleteAdminDto;
                const admin = yield db_connecion_1.default.admin.findFirst({
                    where: {
                        id: adminId,
                        role: 'ADMIN',
                    },
                });
                if (!admin) {
                    return {
                        status: 'fail',
                        message: 'Admin not found',
                    };
                }
                yield db_connecion_1.default.admin.delete({
                    where: {
                        id: adminId,
                    },
                });
                return {
                    status: 'success',
                    message: 'Admin successfully deleted',
                };
            }
            catch (error) {
                console.log(error);
                return {
                    status: 'fail',
                    message: error.message,
                };
            }
        });
    }
    static verifyResetOtp(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, otp }) {
            try {
                const otpInfo = yield db_connecion_1.default.otp.findFirst({
                    where: {
                        admin: {
                            email,
                        },
                    },
                });
                if (!otpInfo) {
                    return {
                        status: 'fail',
                        message: 'OTP not found',
                    };
                }
                if (new Date() > otpInfo.otp_expires) {
                    return {
                        status: 'fail',
                        message: 'OTP has expired. Please request a new one',
                    };
                }
                const isOtpValid = yield bcrypt_1.default.compare(otp, otpInfo.otp);
                if (!isOtpValid) {
                    return {
                        status: 'fail',
                        message: 'Invalid OTP',
                    };
                }
                yield db_connecion_1.default.otp.update({
                    where: {
                        id: otpInfo.id,
                    },
                    data: {
                        isVerified: true,
                    },
                });
                return {
                    status: 'success',
                    message: 'OTP verified',
                };
            }
            catch (error) {
                return {
                    status: 'fail',
                    message: error.message,
                };
            }
        });
    }
    static resetPassword(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password, confirmPassword }) {
            if (password !== confirmPassword) {
                return {
                    status: 'fail',
                    message: 'Passwords do not match',
                };
            }
            try {
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const admin = yield db_connecion_1.default.admin.findUnique({
                    where: { email },
                });
                if (!admin) {
                    return {
                        status: 'fail',
                        message: 'Admin not found',
                    };
                }
                yield db_connecion_1.default.admin.update({
                    where: { email },
                    data: { password: hashedPassword },
                });
                // Delete the OTP
                yield db_connecion_1.default.otp.deleteMany({
                    where: { admin_id: admin.id },
                });
                return {
                    status: 'success',
                    message: 'Password reset successful. Please login',
                };
            }
            catch (error) {
                return {
                    status: 'fail',
                    message: error.message,
                };
            }
        });
    }
}
exports.default = ApiService;
//# sourceMappingURL=service.js.map