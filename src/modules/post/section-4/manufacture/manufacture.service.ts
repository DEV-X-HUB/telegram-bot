import { create } from 'domain';
import prisma from '../../../../loaders/db-connecion';
import { CreatePostDto, CreatePostService4ManufactureDto } from '../../../../types/dto/create-question-post.dto';

import { v4 as UUID } from 'uuid';

class Section4ManufactureService {
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
    // try {
    //   // Find user with tg_id
    //   const user = await prisma.user.findUnique({
    //     where: {
    //       tg_id: tg_id.toString(),
    //     },
    //   });
    //   if (!user) {
    //     return {
    //       success: false,
    //       data: null,
    //       message: 'User not found',
    //     };
    //   }
    //   const newPost = await this.createPost(
    //     {
    //       description: postData.description,
    //       category: 'Service4Manufacture',
    //       user_id: user.id,
    //     },
    //     tg_id,
    //   );
    //   if (!newPost.success || !newPost.post)
    //     return {
    //       success: false,
    //       data: null,
    //       message: newPost.message,
    //     };
    //   // Create manufacture post and store it
    //   const newManufacturePost = await prisma.service4Manufacture.create({
    //     data: {
    //       id: UUID(),
    //       post_id: newPost.post.id,
    //       ...postData,
    //     },
    //   });
    //   return {
    //     success: true,
    //     data: newManufacturePost,
    //     message: 'Post created successfully',
    //   };
    // } catch (error) {
    //   console.error(error);
    //   return {
    //     success: false,
    //     data: null,
    //     message: 'An error occurred while creating the question',
    //   };
    // }
  }
}

export default Section4ManufactureService;
