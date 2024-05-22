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
    switch (true) {
      case query.startsWith('searchedPosts'): {
        const [_, round] = query.split(':');
        return PostController.listAllPosts(ctx, round);
      }
      case query.startsWith('post_detail'): {
        const [_, postId] = query.split(':');
        return PostController.getPostnDetail(ctx, postId);
      }

      case query.startsWith('openPost'): {
        const [_, postId] = query.split(':');
        return profileController.handleOpenPost(ctx, postId);
      }
      case query.startsWith('closePost'): {
        const [_, postId] = query.split(':');
        return profileController.handleClosePost(ctx, postId);
      }
      case query.startsWith('cancelPost'): {
        const [_, postId] = query.split(':');
        return profileController.handleCancelPost(ctx, postId);
      }

      case query.startsWith('answer'):
        return PostController.handleAnswerQuery(ctx, query);

      case query.startsWith('browse'):
        return PostController.handleBrowseQuery(ctx, query);

      case query.startsWith('follow'):
        return profileController.handleFollow(ctx, query);

      case query.startsWith('unfollow'):
        return profileController.handlUnfollow(ctx, query);

      case query.startsWith('unblock'):
        return profileController.handlUnblock(ctx, query);

      case query.startsWith('asktoBlock'):
        return profileController.askToBlock(ctx, query);

      case query.startsWith('blockUser'):
        return profileController.handleBlock(ctx, query);
      case query.startsWith('cancelBlock'):
        return profileController.cancelBlock(ctx, query);

      case query.startsWith('sendMessage_'):
        return console.log(ctx.scene.enter('chat'));
      case query.startsWith('replyMessage_'):
        return console.log(ctx.scene.enter('chat'));
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
  switch (true) {
    case query.startsWith('searchedPosts'): {
      const [_, searachText, round] = query.split('_');
      return PostController.listAllPosts(ctx, parseInt(round), searachText);
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

    case query.startsWith('postDetail'): {
      const [_, postId] = query.split('_');
      return PostController.getPostnDetail(ctx, postId);
    }

    default:
      return next();
  }
}
