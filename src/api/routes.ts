import express from 'express';
import { roleGuard } from '../middleware/admin-auth';
import { validateCreateNotification } from '../utils/validator/notification.validator';
import {
  createAdmin,
  createNotification,
  deleteAdmin,
  deletePost,
  deleteUserPosts,
  forgotPassword,
  getAdmins,
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

// router.use(authGuard);

// post routes
router.get('/posts/', getPosts);
router.get('/posts/:id', getPostDetail);
router.get('/posts/user/:userId', getUserPosts);
router.put('/posts', updatePostStatus);
router.delete('/posts/user:id', deleteUserPosts);

router.get('/users', getUsers);
router.get('/users/:id', getUserDetail);
router.delete('/posts/:id', deletePost);
router.put('/users/status', updateUserStatus);

// admin auth routes
router.post('/auth/login', loginAdmin);
router.get('/admins', getAdmins);
router.get('/photos', getPhotoUrls);
router.post('/auth/create-admin', roleGuard(['SUPER_ADMIN']), createAdmin);
router.put('/auth/update-admin-status', roleGuard(['SUPER_ADMIN']), updateAdminStatus);
router.delete('/auth/delete-admin/:id', roleGuard(['SUPER_ADMIN']), deleteAdmin);

router.post('/auth/forgot', forgotPassword);
router.post('/auth/verify', verifyResetOtp);
router.post('/auth/reset', resetPassword);

router.post('/notification/', validateCreateNotification, createNotification);
router.post('/notification/:id', resendNotification);
router.get('/notification/', getNotifications);

export default router;
