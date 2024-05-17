import express from 'express';
import {
  createAdmin,
  deletePostById,
  getPostById,
  getPosts,
  getUserPosts,
  loginAdmin,
  updatePostStatus,
} from './controller';
const router = express.Router();

// post routes
router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.get('/posts/user/:userId', getUserPosts);
router.put('/posts/:id', updatePostStatus);
router.delete('/posts/:id', deletePostById);

// admin routes
router.post('/admin/login', loginAdmin);
router.post('/admin/signup', createAdmin);

export default router;
