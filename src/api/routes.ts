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
  updatePostStatus,
  verifyResetOtp,
} from './controller';
import { roleGuard } from '../middleware/admin-auth';
const router = express.Router();

// post routes
router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.get('/posts/user/:userId', getUserPosts);
router.put('/posts/:id', updatePostStatus);
router.delete('/posts/:id', deletePostById);

// admin auth routes
router.post('/auth/login', loginAdmin);
router.post('/auth/create-admin', roleGuard('SUPER_ADMIN'), createAdmin);
router.put('/auth/update-admin-status', roleGuard('SUPER_ADMIN'), createAdmin);
router.delete('/auth/delete-admin', roleGuard('SUPER_ADMIN'), createAdmin);
router.get('/auth/forgot', forgotPassword);
router.post('/auth/verify', verifyResetOtp);
router.post('/auth/reset', resetPassword);

export default router;
