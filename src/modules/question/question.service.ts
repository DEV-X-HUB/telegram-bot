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
        },
      });
      return {
        status: 'success',
        questions: questions.concat(questions).concat(questions).concat(questions).concat(questions),
        // questions,
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return { status: 'fail', questions: [] };
    }
  }
}

export default QuestionService;
