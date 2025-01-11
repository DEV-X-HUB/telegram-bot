import MainMenuController from '../modules/mainmenu/mainmenu.controller';
import ProfileController from '../modules/profile/profile.controller';
import PostController from '../modules/post/post.controller';

const profileController = new ProfileController();
// Middleware to check if user entered command and redirect to its scene

export const checkVoice = (ctx: any) => {
  if (ctx.message?.voice) return ctx.replyWithHTML('<b>Voice is not allowed input currenlty ! </b> ');
};
export const checTextOnly = async (ctx: any): Promise<boolean> => {
  const text = ctx.message?.text;
  if (!text) {
    ctx.replyWithHTML('<b>Only Text is allowed input is alowed currently! </b> ');
    return false;
  }
  return true;
};
export function checkCallBacks() {
  return async (ctx: any, next: any) => {
    try {
      checkVoice(ctx);
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
          return PostController.getPostDetail(ctx, postId);
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
          return ctx.scene.enter('chat');
        case query.startsWith('replyMessage_'):
          return ctx.scene.enter('chat');
      }

      return next();
    } catch (error) {
      throw error;
    }
  };
}

export function checkQueries(ctx: any, query: string, next: any) {
  try {
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
        return PostController.getPostDetail(ctx, postId);
      }

      default:
        return next();
    }
  } catch (error) {
    throw error;
  }
}
