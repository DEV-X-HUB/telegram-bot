import MainMenuController from '../modules/mainmenu/mainmenu.controller';
import ProfileController from '../modules/profile/profile.controller';
import PostController from '../modules/post/post.controller';
const profileController = new ProfileController();
// Middleware to check if user entered command and redirect to its scene
export function checkCallBacks() {
  return async (ctx: any, next: any) => {
    const callbackQuery = ctx?.callbackQuery;
    if (!callbackQuery) return next();
    const query = callbackQuery.data;

    console.log(query, 'query from call back');

    switch (true) {
      case query.startsWith('show_all_questions'): {
        const [_, round] = query.split(':');
        return PostController.listAllQuestions(ctx, round);
      }
      case query.startsWith('question_detail'): {
        const [_, questionId] = query.split(':');
        return PostController.getQuestionDetail(ctx, questionId);
      }

      case query.startsWith('answer'):
        return PostController.handleAnswerQuery(ctx, query);

      case query.startsWith('browse'):
        return PostController.handleBrowseQuery(ctx, query);

      case query.startsWith('follow'):
        return profileController.handleFollow(ctx, query);
      case query.startsWith('unfollow'):
        return profileController.handlUnfollow(ctx, query);
    }

    return next();
  };
}
export function checkMenuOptions() {
  const mainMenus = ['Service 1', 'Service 2', 'Service 3', 'Service 4', '🔍 Search Questions', 'Profile'];
  return async (ctx: any, next: any) => {
    const message = ctx?.message?.text;
    if (message && mainMenus.includes(message)) return MainMenuController.chooseOption(ctx);
    return next();
  };
}

export function checkQueries(ctx: any, query: string, next: any) {
  console.log(query, 'query from string');
  switch (true) {
    case query.startsWith('searchedQuestions'): {
      const [_, searachText, round] = query.split('_');
      return PostController.listAllQuestions(ctx, parseInt(round), searachText);
    }
    case query.startsWith('answer'): {
      return PostController.handleAnswerQuery(ctx, query);
    }

    case query.startsWith('browse'): {
      return PostController.handleBrowseQuery(ctx, query);
    }

    case query.startsWith('userProfile'):
      const [_, userId] = query.split('_');
      return profileController.viewProfileByThirdParty(ctx, userId);
    default:
      return next();
  }
}
