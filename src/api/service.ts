import config from '../config/config';
import prisma from '../loaders/db-connecion';
import { BareResponse, ResponseWithData } from '../types/api';
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

  static async deletePostById(postId: string): Promise<BareResponse> {
    try {
      await prisma.post.delete({ where: { id: postId } });
      return { status: 'success', message: 'post deleted successfully' };
    } catch (error: any) {
      console.log(error);
      return { status: 'fail', message: error?.message };
    }
  }
  static async getUserPosts(user_id: string): Promise<ResponseWithData> {
    try {
      const posts = await prisma.post.findMany({
        where: {
          user_id,
        },
        include: {
          user: {
            select: {
              id: true,
              display_name: true,
            },
          },
        },
      });

      return { status: 'success', message: 'user posts fetched successfully', data: posts };
    } catch (error: any) {
      console.log(error);
      return { status: 'fail', message: error?.message, data: null };
    }
  }

  static async geAlltPosts(round: number): Promise<ResponseWithData> {
    const skip = ((round - 1) * parseInt(config.number_of_result || '5')) as number;
    const postCount = await prisma.post.count();
    try {
      const posts = await prisma.post.findMany({
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
        skip,
        take: parseInt(config.number_of_result || '5'),
      });

      return {
        status: 'success',
        message: 'post fetched successfully',
        data: { posts: posts, nextRound: posts.length == postCount ? round : round + 1, total: postCount },
      };
    } catch (error: any) {
      console.error('Error searching questions:', error);
      return { status: 'fail', message: error?.message, data: null };
    }
  }

  static async getPostById(postId: string): Promise<ResponseWithData> {
    try {
      const post = await prisma.post.findFirst({
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
    } catch (error: any) {
      console.error('Error searching questions:', error);
      return { status: 'fail', message: error?.message, data: null };
    }
  }
}

export default ApiService;
