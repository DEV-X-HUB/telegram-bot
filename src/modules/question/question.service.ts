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
          status: {
            not: {
              // equals: 'pending',
            },
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
  async getQuestionById(questionId: string) {
    try {
      const question = await prisma.question.findFirst({
        where: { id: questionId },
        include: {
          Answer: true,
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
