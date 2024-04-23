import { create } from 'domain';
import prisma from '../../../../loaders/db-connecion';
import { CreatePostDto, CreatePostService4ChickenFarmDto } from '../../../../types/dto/create-question-post.dto';

import { v4 as UUID } from 'uuid';

class Section4ChickenFarmService {
  constructor() {}

  static async findUserWithTgId(tg_id: string) {
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
          user: null,
          message: 'User not found',
        };
      }

      return {
        success: true,
        user: user,
        message: 'User found',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        user: null,
        message: 'An error occurred while finding the user',
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
          user_id: user.id,
          status: 'pending',
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

  static async createChickenFarmPost(postData: CreatePostService4ChickenFarmDto, tg_id: string) {
    try {
      // Find user with tg_id

      console.log(postData);

      const newPost = await this.createPost(
        {
          description: postData.description,
          category: postData.category,
          notify_option: postData.notify_option,
        },
        tg_id,
      );

      if (!newPost.success || !newPost.post)
        return {
          success: false,
          data: null,
          message: newPost.message,
        };

      const { description, category, notify_option, ...chickenFarmData } = postData;

      // Create chicken farm post and store it
      const newChickenFarm = await prisma.service4ChickenFarm.create({
        data: {
          id: UUID(),
          post_id: newPost.post.id,
          ...chickenFarmData,
        },
      });

      return {
        success: true,
        data: newChickenFarm,
        message: 'Post created successfully',
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

  static async getPostsOfUser(tg_id: string) {
    try {
      // Find user with tg_id
      const user = await this.findUserWithTgId(tg_id);

      if (!user.success || !user.user)
        return {
          success: false,
          posts: null,
          message: user.message,
        };

      // Get posts of user
      const posts = await prisma.post.findMany({
        where: {
          user_id: user.user.id,
        },
        // include: {
        //   Service1A: true,
        //   Service1B: true,
        //   Service1C: true,
        //   Service2: true,
        //   Service3: true,
        //   Service4ChickenFarm: true,
        //   Service4Construction: true,
        //   Service4Manufacture: true,
        // },
      });
      console.log(posts);

      return {
        success: true,
        posts: posts,
        message: 'Posts found',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        posts: null,
        message: 'An error occurred while getting the posts',
      };
    }
  }
}

export default Section4ChickenFarmService;
