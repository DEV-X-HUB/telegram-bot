import express from 'express';
import { authGuard, roleGuard } from '../middleware/admin-auth';
import { validateCreateNotification } from '../utils/validator/notification.validator';
import {
  createAdmin,
  createNotification,
  deleteAdmin,
  deleteNotification,
  deletePost,
  deleteUserPosts,
  forgotPassword,
  getAdmins,
  getAnalytics,
  getNotifications,
  getPhotoUrls,
  getPostDetail,
  getPosts,
  getUserDetail,
  getUserPosts,
  getUsers,
  loginAdmin,
  resendNotification,
  resetPassword,
  updateAdminStatus,
  updatePostStatus,
  updateUserStatus,
  verifyResetOtp,
} from './controller';
const router = express.Router();

router.use(authGuard);

// post routes
router.get('/posts/', getPosts);
router.get('/posts/:id', getPostDetail);
router.get('/posts/user/:userId', getUserPosts);
router.put('/posts', updatePostStatus);
router.delete('/posts/user:id', deleteUserPosts);

router.get('/users', roleGuard(['SUPER_ADMIN']), getUsers);
router.get('/users/:id', roleGuard(['SUPER_ADMIN']), getUserDetail);
router.delete('/posts/:id', roleGuard(['SUPER_ADMIN']), deletePost);
router.put('/users/status', roleGuard(['SUPER_ADMIN']), updateUserStatus);

// admin auth routes
router.post('/auth/login', loginAdmin);
router.get('/photos', getPhotoUrls);
router.get('/admins', roleGuard(['SUPER_ADMIN']), getAdmins);
router.post('/auth/create-admin', roleGuard(['SUPER_ADMIN']), createAdmin);
router.put('/auth/update-admin-status', roleGuard(['SUPER_ADMIN']), updateAdminStatus);
router.delete('/auth/delete-admin/:id', roleGuard(['SUPER_ADMIN']), deleteAdmin);

router.post('/auth/forgot', forgotPassword);
router.post('/auth/verify', verifyResetOtp);
router.post('/auth/reset', resetPassword);

router.post('/notification/', validateCreateNotification, createNotification);
router.post('/notification/:id', resendNotification);
router.delete('/notification/:id', deleteNotification);
router.get('/notification/', getNotifications);
router.get('/analytics', getAnalytics);

export default router;
