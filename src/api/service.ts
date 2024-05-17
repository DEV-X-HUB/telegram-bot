import prisma from '../loaders/db-connecion';

class ApiService {
  static async getPosts() {
    try {
      const posts = await prisma.post.findMany();
      if (!posts || posts.length === 0) {
        return {
          status: 'fail',
          message: 'No posts found',
        };
      }

      return {
        status: 'success',
        data: posts,
      };
    } catch (error: any) {
      return {
        status: 'fail',
        message: error.message,
      };
    }
  }
}
