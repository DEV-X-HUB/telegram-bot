import CreateQuestionPostDto from '../../types/dto/create-question-post.dto';
import prisma from '../../loaders/db-connecion';
import { v4 as UUID } from 'uuid';

class QuestionService {
  constructor() {}

  static async createQuestionPost(questionPost: CreateQuestionPostDto, tg_id: string) {
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
      const question = await prisma.question.create({
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
}

export default QuestionService;
