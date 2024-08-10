"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const admin_auth_1 = require("../middleware/admin-auth");
const router = express_1.default.Router();
router.use(admin_auth_1.authGuard);
// post routes
router.get('/posts/', controller_1.getPosts);
router.get('/posts/status/:status', controller_1.getPostsByStatus);
router.get('/posts/category/:category', controller_1.getPostsByCategory);
router.get('/posts/:id', controller_1.getPostDetail);
router.get('/posts/user/:userId', controller_1.getUserPosts);
router.put('/posts', controller_1.updatePostStatus);
router.delete('/posts/:id', controller_1.deletePost);
router.delete('/posts/user:id', controller_1.deleteUserPosts);
// admin auth routes
router.put('/user/update-status', controller_1.updateUserStatus);
router.post('/auth/login', controller_1.loginAdmin);
router.post('/auth/create-admin', (0, admin_auth_1.roleGuard)(['SUPER_ADMIN']), controller_1.createAdmin);
router.put('/auth/update-admin-status', (0, admin_auth_1.roleGuard)(['SUPER_ADMIN']), controller_1.updateAdminStatus);
router.delete('/auth/delete-admin', (0, admin_auth_1.roleGuard)(['SUPER_ADMIN']), controller_1.deleteAdmin);
router.post('/auth/forgot', controller_1.forgotPassword);
router.post('/auth/verify', controller_1.verifyResetOtp);
router.post('/auth/reset', controller_1.resetPassword);
exports.default = router;
//# sourceMappingURL=routes.js.map