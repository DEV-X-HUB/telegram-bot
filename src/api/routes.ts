import express from 'express';
import {
  createAdmin,
  deletePostById,
  forgotPassword,
  getPostById,
  getPosts,
  getUserPosts,
  loginAdmin,
  resetPassword,
  updateAdminStatus,
  updatePostStatus,
  verifyResetOtp,
} from './controller';
import { authGuard, roleGuard } from '../middleware/admin-auth';
const router = express.Router();

router.use(authGuard);

// post routes
router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.get('/posts/user/:userId', getUserPosts);
router.put('/posts/:id', updatePostStatus);
router.delete('/posts/:id', deletePostById);

// admin auth routes
router.post('/auth/login', loginAdmin);
router.post('/auth/create-admin', roleGuard('SUPER_ADMIN'), createAdmin);
router.put('/auth/update-admin-status', roleGuard('SUPER_ADMIN'), updateAdminStatus);
router.delete('/auth/delete-admin', roleGuard('SUPER_ADMIN'), createAdmin);
router.get('/auth/forgot', forgotPassword);
router.post('/auth/verify', verifyResetOtp);
router.post('/auth/reset', resetPassword);

export default router;
