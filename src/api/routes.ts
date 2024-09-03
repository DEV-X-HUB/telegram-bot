import express from 'express';
import {
  createAdmin,
  deleteAdmin,
  deletePost,
  deleteUserPosts,
  forgotPassword,
  getPostDetail,
  getPosts,
  getPostsByCategory,
  getPostsByStatus,
  getUserDetail,
  getUserPosts,
  getUsers,
  loginAdmin,
  resetPassword,
  updateAdminStatus,
  updatePostStatus,
  updateUserStatus,
  verifyResetOtp,
} from './controller';
import { authGuard, roleGuard } from '../middleware/admin-auth';
const router = express.Router();

router.use(authGuard);

// post routes
router.get('/posts/', getPosts);
router.get('/posts/status/:status', getPostsByStatus);
router.get('/posts/category/:category', getPostsByCategory);
router.get('/posts/:id', getPostDetail);
router.get('/posts/user/:userId', getUserPosts);
router.put('/posts', updatePostStatus);
router.get('/users/?round', getUsers);
router.get('/user/?id', getUserDetail);
router.delete('/posts/:id', deletePost);
router.delete('/posts/user:id', deleteUserPosts);

// admin auth routes
router.put('/user/update-status', updateUserStatus);
router.post('/auth/login', loginAdmin);
router.post('/auth/create-admin', roleGuard(['SUPER_ADMIN']), createAdmin);
router.put('/auth/update-admin-status', roleGuard(['SUPER_ADMIN']), updateAdminStatus);
router.delete('/auth/delete-admin', roleGuard(['SUPER_ADMIN']), deleteAdmin);

router.post('/auth/forgot', forgotPassword);
router.post('/auth/verify', verifyResetOtp);
router.post('/auth/reset', resetPassword);

export default router;
