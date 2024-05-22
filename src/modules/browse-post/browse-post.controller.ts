// BrowsePostScene

import { deleteMessageWithCallback } from '../../utils/helpers/chat';
import PostService from '../post/post.service';
import BrowsePostFormatter from './browse-post.formatter';
const browsePostFormatter = new BrowsePostFormatter();

const postService = new PostService();

class BrowsePostController {
  constructor() {}

  async displayPost(ctx: any) {
    // default state
    ctx.wizard.state.filterBy = {
      category: 'all',
      status: 'all',
      timeframe: 'all',
    };

    // const posts = await postService.geAlltPosts(1);
    const posts = await postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);

    if (!posts || posts.posts.length == 0) {
      return ctx.reply(browsePostFormatter.messages.noPostError);
    }

    ctx.replyWithHTML(
      ...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total),
      {
        parse_mode: 'HTML',
      },
    );

    return ctx.wizard.next();
  }

  async handleFilters(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      return ctx.reply(...browsePostFormatter.messages.useButtonError);
    }

    // Filter by status
    if (callbackQuery.data.startsWith('filterByStatus')) {
      const status = callbackQuery.data.split('_')[1];
      ctx.wizard.state.filterBy = {
        ...ctx.wizard.state.filterBy,
        status: status,
      };

      // fetch post with status
      const posts = await postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);

      await deleteMessageWithCallback(ctx);

      if (!posts || posts.posts.length == 0) {
        return ctx.reply(browsePostFormatter.messages.noPostError);
      }

      return await ctx.replyWithHTML(
        ...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total),
        {
          parse_mode: 'HTML',
        },
      );
    }

    // Filter by category
    if (callbackQuery.data.startsWith('filterByCategory')) {
      const category = callbackQuery.data.split('_')[1];
      await deleteMessageWithCallback(ctx);
      await ctx.reply(...browsePostFormatter.filterByCategoryDisplay(category));
      return ctx.wizard.next();
    }

    // Filter by timeframe
    if (callbackQuery.data.startsWith('filterByTimeframe')) {
      const timeframeFilter = ctx.callbackQuery.data.split('_')[1];

      await deleteMessageWithCallback(ctx);
      await ctx.reply(...browsePostFormatter.filterByTimeframeDisplay(timeframeFilter));
      return ctx.wizard.selectStep(3);
    }

    // Pagination
    if (callbackQuery.data.startsWith('goToPage')) {
      console.log(callbackQuery.data);

      const page = Number(callbackQuery.data.split('_')[1]);
      console.log(page);

      const posts = await postService.getAllPostsWithQuery(ctx.wizard.state.filterBy, page);
      console.log(posts);
      await deleteMessageWithCallback(ctx);
      await ctx.replyWithHTML(
        ...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, page, posts.total),
        {
          parse_mode: 'HTML',
        },
      );
    }
  }

  async handleFilterByCategory(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      return ctx.reply(...browsePostFormatter.messages.useButtonError);
    }

    if (callbackQuery.data.startsWith('filterByCategory')) {
      const categoryFilter = ctx.callbackQuery.data.split('_')[1];

      // Get posts by the selected category
      ctx.wizard.state.filterBy = {
        ...ctx.wizard.state.filterBy,
        category: categoryFilter,
      };

      const posts = await postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
      console.log(posts);

      if (!posts || posts.posts.length == 0) {
        return ctx.reply(browsePostFormatter.messages.noPostError);
      }

      await deleteMessageWithCallback(ctx);
      ctx.replyWithHTML(
        ...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total),
        {
          parse_mode: 'HTML',
        },
      );

      return ctx.wizard.selectStep(1);
    }
  }

  async handleFilterByTimeframe(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    console.log(callbackQuery.data);
    if (!callbackQuery) {
      return ctx.reply(...browsePostFormatter.messages.useButtonError);
    }

    if (callbackQuery.data.startsWith('filterByTimeframe')) {
      const timeframeFilter = ctx.callbackQuery.data.split('_')[1];
      console.log(timeframeFilter);

      // update the state
      ctx.wizard.state.filterBy = {
        ...ctx.wizard.state.filterBy,
        timeframe: timeframeFilter,
      };

      // Get posts by the selected category
      const posts = await postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);

      await deleteMessageWithCallback(ctx);

      if (!posts || posts.posts.length == 0) {
        return ctx.reply(browsePostFormatter.messages.noPostError);
      }

      ctx.replyWithHTML(
        ...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total),
        {
          parse_mode: 'HTML',
        },
      );

      return ctx.wizard.selectStep(1);
    }
  }
}

export default BrowsePostController;
