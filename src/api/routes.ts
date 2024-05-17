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
  verifyResetOTP,
} from './controller';
const router = express.Router();

// post routes
router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.get('/posts/user/:userId', getUserPosts);
router.put('/posts/:id', updatePostStatus);
router.delete('/posts/:id', deletePostById);

// admin auth routes
router.post('/auth/login', loginAdmin);
router.post('/auth/signup', createAdmin);
router.post('/auth/forgot', forgotPassword);
router.post('/auth/verify', verifyResetOTP);
router.post('/auth/reset', resetPassword);

export default router;
