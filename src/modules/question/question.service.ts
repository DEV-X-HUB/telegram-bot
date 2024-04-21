import prisma from '../../loaders/db-connecion';

class QuestionService {
  constructor() {}

  async getPostsByDescription(searchText: string) {
    try {
      const questions = await prisma.post.findMany({
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
          user: true,
        },
      });
      return {
        status: 'success',
        questions: questions.concat(questions),
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return { status: 'fail', questions: [] };
    }
  }

  async geAlltPosts() {
    try {
      const questions = await prisma.post.findMany({
        include: {
          user: true,
        },
      });
      return {
        status: 'success',
        questions: questions.concat(questions),
        // questions,
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return { status: 'fail', questions: [] };
    }
  }
  async getPostById(questionId: string) {
    try {
      const question = await prisma.post.findFirst({
        where: { id: questionId },
        include: {
          user: true,
        },
      });
      return {
        status: 'success',
        question,
        // questions,
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return { status: 'fail', question: null };
    }
  }
}

export default QuestionService;
