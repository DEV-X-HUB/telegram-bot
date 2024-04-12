import ProfileController from '../modules/profile/profile.controller';
import QuestionController from '../modules/question/question.controller';
const profileController = new ProfileController();
// Middleware to check if user entered command and redirect to its scene
export function checkCallBacks() {
  return async (ctx: any, next: any) => {
    const callbackQuery = ctx?.callbackQuery;
    if (!callbackQuery) return next();
    const query = callbackQuery.data;

    switch (true) {
      case query.startsWith('show_all_questions'): {
        const [_, round] = query.split(':');
        return QuestionController.listAllQuestions(ctx, round);
      }

      case query.startsWith('answer'):
        return QuestionController.handleAnswerQuery(ctx, query);

      case query.startsWith('browse'):
        return QuestionController.handleBrowseQuery(ctx, query);

      case query.startsWith('subscribe'):
        return QuestionController.handleSubscribeQuery(ctx, query);
    }

    return next();
  };
}

export function checkQueries(ctx: any, query: string, next: any) {
  console.log(query);
  switch (true) {
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
