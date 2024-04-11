import QuestionController from '../modules/question/question.controller';

// Middleware to check if user entered command and redirect to its scene
export function checkCallBacks() {
  return async (ctx: any, next: any) => {
    const callbackQuery = ctx?.callbackQuery;
    if (!callbackQuery) return next();
    const query = callbackQuery.data;

    switch (true) {
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
