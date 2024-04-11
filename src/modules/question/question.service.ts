import prisma from '../../loaders/db-connecion';

class QuestionService {
  constructor() {}

  async getQuestionsByDescription(searchText: string) {
    try {
      const questions = await prisma.question.findMany({
        where: {
          description: {
            contains: searchText,
          },
        },
        include: {
          Answer: true,
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
  async geAlltQuestions() {
    try {
      const questions = await prisma.question.findMany({
        include: {
          Answer: true,
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
}

export default QuestionService;
