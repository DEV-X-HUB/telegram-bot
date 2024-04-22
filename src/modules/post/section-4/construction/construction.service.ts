import { create } from 'domain';
import prisma from '../../../../loaders/db-connecion';
import { CreatePostDto, CreatePostService4ConstructionDto } from '../../../../types/dto/create-question-post.dto';

import { v4 as UUID } from 'uuid';

class Section4ConstructionService {
  constructor() {}

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

  static async createConstructionPost(postData: CreatePostService4ConstructionDto, tg_id: string) {
    try {
      const newPost = await this.createPost(
        {
          description: postData.description,
          category: postData.category,
        },
        tg_id,
      );

      if (!newPost.success || !newPost.post)
        return {
          success: false,
          data: null,
          message: newPost.message,
        };

      const { description, category, ...constructionData } = postData;

      // Create constuction post and store it
      const newConstructionePost = await prisma.service4Construction.create({
        data: {
          id: UUID(),
          post_id: newPost.post.id,
          ...constructionData,
        },
      });

      return {
        success: true,
        data: newConstructionePost,
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

export default Section4ConstructionService;
