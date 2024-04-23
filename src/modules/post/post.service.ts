import prisma from '../../loaders/db-connecion';
import { v4 as UUID } from 'uuid';
import {
  CreateCategoryPostDto,
  CreatePostDto,
  CreatePostService1ADto,
  CreatePostService1BDto,
  CreatePostService1CDto,
  CreatePostService4ChickenFarmDto,
  CreatePostService4ConstructionDto,
  CreatePostService4ManufactureDto,
} from '../../types/dto/create-question-post.dto';
import { PostCategory } from '../../types/params';

class PostService {
  constructor() {}

  static async createQuestionPost(questionPost: any, tg_id: string) {
    try {
      // Find user with tg_id
      const user = await prisma.user.findUnique({
        where: {
          tg_id: tg_id.toString(),
        },
      });

      if (!user) {
        return {
          success: false,
          data: null,
          message: 'User not found',
        };
      }

      // Create question and store it
      const question = await prisma.post.create({
        data: {
          id: UUID(),
          ...questionPost,
          user_id: user.id,
          status: 'pending',
        },
      });

      return {
        success: true,
        data: question,
        message: 'Question created successfully',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        data: null,
        message: 'An error occurred while creating the question',
      };
    }
  }
  static async createPost(postDto: CreatePostDto, tg_id: string) {
    try {
      // Find user with tg_id
      const user = await prisma.user.findUnique({
        where: {
          tg_id: tg_id.toString(),
        },
      });

      if (!user) {
        return {
          success: false,
          post: null,
          message: 'User not found',
        };
      }

      // Create question and store it
      const post = await prisma.post.create({
        data: {
          ...postDto,
          status: 'pending',
          user_id: user.id,
        },
      });

      return {
        success: true,
        post: post,
        message: 'post created',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        post: null,
        message: 'An error occurred while creating the post',
      };
    }
  }

  static async createCategoryPost(postDto: CreateCategoryPostDto, tg_id: string) {
    try {
      const { description, category, notify_option, previous_post_id } = postDto;
      const postData = await this.createPost(
        {
          description,
          category,
          notify_option,
          previous_post_id,
        },
        tg_id,
      );

      if (!postData.success || !postData.post)
        return {
          success: false,
          data: null,
          message: postData.message,
        };

      let post = null;
      switch (category as PostCategory) {
        case 'Section 1A': {
          const { description, category, notify_option, previous_post_id, ...createCategoryPostDto } =
            postDto as CreatePostService1ADto;
          post = await prisma.service1A.create({
            data: {
              post_id: postData.post.id,
              ...createCategoryPostDto,
            },
          });
          break;
        }
        case 'Section 1B': {
          const { description, category, notify_option, previous_post_id, ...createCategoryPostDto } =
            postDto as CreatePostService1BDto;
          post = await prisma.service1B.create({
            data: {
              post_id: postData.post.id,
              ...createCategoryPostDto,
            },
          });
          break;
        }
        case 'Section 1C': {
          const { description, category, notify_option, previous_post_id, ...createCategoryPostDto } =
            postDto as CreatePostService1CDto;
          post = await prisma.service1C.create({
            data: {
              post_id: postData.post.id,
              ...createCategoryPostDto,
            },
          });
          break;
        }
        case 'Chicken Farm': {
          const { description, category, notify_option, ...createCategoryPostDto } =
            postDto as CreatePostService4ChickenFarmDto;
          post = await prisma.service4ChickenFarm.create({
            data: {
              post_id: postData.post.id,
              ...createCategoryPostDto,
            },
          });
        }
        case 'Service4Construction': {
          const { description, category, notify_option, ...createCategoryPostDto } =
            postDto as CreatePostService4ConstructionDto;
          post = await prisma.service4Construction.create({
            data: {
              post_id: postData.post.id,
              ...createCategoryPostDto,
            },
          });
        }
        case 'Service4Manufacture': {
          const { description, category, notify_option, ...createCategoryPostDto } =
            postDto as CreatePostService4ManufactureDto;
          post = await prisma.service4Manufacture.create({
            data: {
              post_id: postData.post.id,
              ...createCategoryPostDto,
            },
          });
        }
      }

      return {
        success: true,
        data: { ...post, post_id: postData.post.id },
        message: 'Post created successfully',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        data: null,
        message: 'An error occurred while creating the post',
      };
    }
  }

  static async deletePostById(postId: string, category: PostCategory): Promise<boolean> {
    try {
      switch (category) {
        case 'Section 1A':
          await prisma.post.delete({ where: { id: postId } });
          break;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  static async getUserPosts(user_id: string) {
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

      return { success: true, posts: posts, message: 'success' };
    } catch (error: any) {
      console.log(error);
      return { success: false, posts: null, message: error?.message };
    }
  }
  static async getUserPostsByTgId(tg_id: string) {
    const user = await prisma.user.findUnique({
      where: {
        tg_id: tg_id.toString(),
      },
    });
    if (!user) return { success: false, posts: null, message: `No user found with telegram Id ${tg_id}` };
    try {
      const posts = await prisma.post.findMany({
        where: {
          user_id: user.id,
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

      return { success: true, posts: posts, message: 'success' };
    } catch (error: any) {
      console.log(error);
      return { success: false, posts: null, message: error?.message };
    }
  }

  async getPostsByDescription(searchText: string) {
    try {
      const posts = await prisma.post.findMany({
        where: {
          description: {
            contains: searchText,
          },
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
        },
      });
      return {
        success: true,
        posts: posts,
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return { success: false, posts: [] };
    }
  }

  async geAlltPosts() {
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
          user: true,
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
        success: true,
        posts: posts,
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return { success: true, posts: [] };
    }
  }
  async getPostById(questionId: string) {
    try {
      const post = await prisma.post.findFirst({
        where: { id: questionId },
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
        success: true,
        post,
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return { success: true, post: null };
    }
  }
}

export default PostService;
