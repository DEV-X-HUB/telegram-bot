import prisma from '../../loaders/db-connecion';
import { v4 as UUID } from 'uuid';
import { CreatePostDto, CreatePostService1ADto } from '../../types/dto/create-question-post.dto';

type PostCategory = 'Section 1A';
class QuestionService {
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
  static async createServie1Post(postDto: CreatePostService1ADto, tg_id: string) {
    try {
      const postData = await this.createPost(
        {
          description: postDto.description,
          category: postDto.category,
        },
        tg_id,
      );

      if (!postData.success || !postData.post)
        return {
          success: false,
          data: null,
          message: postData.message,
        };

      const { description, category, ...createPostService1ADto } = postDto;
      const post = await prisma.service1A.create({
        data: {
          post_id: postData.post.id,
          ...createPostService1ADto,
        },
      });

      return {
        success: true,
        data: post,
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
          await prisma.service1A.delete({ where: { id: postId } });
          break;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default QuestionService;
