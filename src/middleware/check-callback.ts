import ProfileController from '../modules/profile/profile.controller';
import QuestionController from '../modules/question/question.controller';
const profileController = new ProfileController();
// Middleware to check if user entered command and redirect to its scene
export function checkCallBacks() {
  return async (ctx: any, next: any) => {
    const callbackQuery = ctx?.callbackQuery;
    if (!callbackQuery) return next();
    const query = callbackQuery.data;

    console.log(query);

    switch (true) {
      case query.startsWith('show_all_questions'): {
        const [_, round] = query.split(':');
        return QuestionController.listAllQuestions(ctx, round);
      }
      case query.startsWith('question_detail'): {
        const [_, questionId] = query.split(':');
        return QuestionController.getQuestionDetail(ctx, questionId);
      }

      case query.startsWith('answer'):
        return QuestionController.handleAnswerQuery(ctx, query);

      case query.startsWith('browse'):
        return QuestionController.handleBrowseQuery(ctx, query);

      case query.startsWith('follow'):
        return profileController.handleFollow(ctx, query);
      case query.startsWith('unfollow'):
        return profileController.handlUnfollow(ctx, query);
    }

    return next();
  };
}

export function checkQueries(ctx: any, query: string, next: any) {
  switch (true) {
    case query.startsWith('all_questions'): {
      const [_, _s, searachText, round] = query.split(':');
      return QuestionController.listAllQuestions(ctx, parseInt(round));
    }
    case query.startsWith('answer'): {
      return QuestionController.handleAnswerQuery(ctx, query);
    }

    case query.startsWith('browse'): {
      return QuestionController.handleBrowseQuery(ctx, query);
    }

    case query.startsWith('userProfile'):
      const [_, userId] = query.split('_');
      return profileController.viewProfileByThirdParty(ctx, userId);
    default:
      return next();
  }
}
