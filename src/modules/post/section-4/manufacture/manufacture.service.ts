import { create } from 'domain';
import prisma from '../../../../loaders/db-connecion';
import { CreatePostDto, CreatePostService4ManufactureDto } from '../../../../types/dto/create-question-post.dto';

import { v4 as UUID } from 'uuid';

class ManufactureService {
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

  static async createManufacturePost(postData: CreatePostService4ManufactureDto, tg_id: string) {
    try {
      // Find user with tg_id
      const user = await this.findUserWithTgId(tg_id);

      if (!user) {
        return {
          success: false,
          data: null,
          message: 'User not found',
        };
      }

      const newPost = await this.createPost(
        {
          description: postData.description,
          category: 'Service4Manufacture',
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

      const { description, category, notify_option, ...manufacturePostData } = postData;

      // Create manufacture post and store it
      const newManufacturePost = await prisma.service4Manufacture.create({
        data: {
          id: UUID(),
          post_id: newPost.post.id,
          ...manufacturePostData,
        },
      });

      return {
        success: true,
        data: newManufacturePost,
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
}

export default ManufactureService;
