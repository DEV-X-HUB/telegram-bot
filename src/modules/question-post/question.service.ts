import Question from '../../models/question';
import User from '../../models/user';
import CreateQuestionPostDto from '../../types/dto/create-question-post.dto';

class QuestionService {
  constructor() {}
  static async createQuestionPost(questionPost: CreateQuestionPostDto, tg_id: string) {
    console.log('question post');
    console.log(questionPost);
    try {
      const user = await User.findOne({ tg_id: tg_id });
      console.log(user);
      if (!user) return { success: false, data: null, message: 'User not found' };

      // const {
      //   ar_br = 'ar',
      //   bi_di = 'bi',
      //   location = 'Kirkos, Addis Ababa',
      //   woreda = 'woreda1',
      //   last_digit = '11111',
      //   description = 'description...',
      //   photo = [],
      // } = questionPost;
      const { ar_br, bi_di = 'bi', location, woreda, last_digit, description, photo } = questionPost;
      console.log(questionPost);

      const newQuestionPost = await Question.create({
        ar_br,
        bi_di,
        location,
        woreda,
        last_digit,
        description,
        photo,
        user: user._id,
      });
      console.log(newQuestionPost);
      return {
        success: true,
        data: newQuestionPost,
        message: 'New question created',
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error?.message || 'Error creating question',
      };
    }
  }
}

export default QuestionService;
