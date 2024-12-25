import config from '../../config/config';
import { PostCategory } from '../../types/params';
import {
  deleteMessageWithCallback,
  findSender,
  messagePostPreviewWithBot,
  sendMediaGroup,
  sendMediaGroupToChannel,
  sendMediaGroupToUser,
  replyDetailWithContext,
  messagePostPreview,
} from '../../utils/helpers/chat';
import { areEqaul, extractElements, getSectionName } from '../../utils/helpers/string';
import MainMenuController from '../mainmenu/mainmenu.controller';
import ProfileService from '../profile/profile.service';
import PostFormmatter from './post.formmater';
import QuestionService from './post.service';
const questionService = new QuestionService();
const profileService = new ProfileService();
const postFormmatter = new PostFormmatter();
const roundSize = 10;
import { Context, Markup } from 'telegraf';
class PostController {
  constructor() {
    postFormmatter.chooseCityFormatter('et', 1);
  }

  static async handleSearch(ctx: any) {
    const query = ctx?.update?.inline_query?.query;

    if (!query || query.trim() == '') return;
    const { success, posts } = await questionService.getAllPostsByDescription(query);
    if (!success) return await ctx.reply('unable to make search');
    if (posts.length == 0)
      return await ctx.answerInlineQuery([...postFormmatter.formatNoQuestionsErrorMessage()], {
        button: postFormmatter.seachQuestionTopBar(0, query),
      });
    return await ctx.answerInlineQuery([...postFormmatter.formatSearchQuestions(posts)], {
      button: postFormmatter.seachQuestionTopBar(posts.length, query),
      cache_time: 0,
    });
  }
  static async handleAnswerBrowseQuery(ctx: any, query: string) {
    if (query.startsWith('answer')) {
      const [_, postId] = query.split('_');

      // get question data from the answerinlinequery
      const questionData = {
        postId: '0',
        question: 'Hello guys here is my question 3',
        questionText: '#tech\n\nWhat is the best programming language for beginners? \n\nBy: @username',
        description: 'Asked 1 month ago, 2 Answers',
      };
      await ctx.reply(`${questionData.questionText}`, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Browse', callback_data: 'browse' },
              { text: 'Subscribe', callback_data: 'subscribe' },
            ],
          ],
        },
      });
      return await ctx.reply(
        // add copy sticker
        'Send me your answer   \n\n`Note that you can send your answer through voice, or you could send your answer with media(photo, video, audio)`',
        {
          reply_markup: {
            keyboard: [[{ text: 'Back' }]],
            resize_keyboard: true,
          },
          parse_mode: 'Markdown',
        },
      );
    }
    if (query.startsWith('browse')) {
      return await ctx.reply('Browse');
    }
  }
  static async handleAnswerQuery(ctx: any, query: string) {
    const sender = findSender(ctx);
    const [_, postId] = query.split('_');
    const { success, post } = await questionService.getPostById(postId);
    if (!success || !post) return ctx.reply('error while');

    // const mediaGroup = question.photo.map((image) => ({
    //   media: image,
    //   type: 'photo',
    //   caption: 'Images uploaded with the Question',
    // }));
    // await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);
    // await ctx.replyWithHTML(...postFormmatter.formatSingleQuestion(question, true));
    // await ctx.reply(
    //   // add copy sticker
    //   'Send me your answer   \n\n`Note that you can send your answer through voice, or you could send your answer with media(photo, video, audio)`',
    //   {
    //     reply_markup: {
    //       keyboard: [[{ text: 'cancel' }]],
    //       resize_keyboard: true,
    //     },
    //     parse_mode: 'Markdown',
    //   },
    // );

    ctx.replyWithMarkdown(' selected ');
    ctx.scene.enter('answer_scene');
    ctx.session.usersSession = {
      [sender.id]: { postId },
    };
  }
  static async AnswerQuestion(ctx: any) {
    const sender = findSender(ctx);
    const userSesion = ctx.session.usersSession[sender.id];
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'cancel', true)) {
      ctx.scene.leave();
      return MainMenuController.onStart(ctx);
    }
    const postId = userSesion.postId;
    if (!postId) {
      ctx.replyWithMarkdown('No question selected ');
      ctx.replyWithMarkdown('No question selected ');
      ctx.scene.leave();
    }
    if (message.startsWith('/start')) return;
    const answer = message;
    ctx.wizard.state.answer = answer;
    const user = await profileService.getProfileByTgId(sender.id);
    if (user) ctx.replyWithHTML(...postFormmatter.formatAnswerPreview(answer, user), { parse_mode: 'HTML' });
    return ctx.wizard.next();
  }
  static async AnswerQuestionPreview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    const message = ctx.message.text;

    if (message && areEqaul(message, 'cancel', true)) {
      return ctx.reply('canceled ');
    }
    if (!callbackQuery) return ctx.reply(postFormmatter.messages.useButtonError);

    switch (callbackQuery.data) {
      case 'edit_answer': {
        return await ctx.reply(
          // add copy sticker
          'Send me your answer   \n\n`Note that you can send your answer through voice, or you could send your answer with media(photo, video, audio)`',
          {
            reply_markup: {
              keyboard: [[{ text: 'cancel' }]],
              resize_keyboard: true,
            },
            parse_mode: 'Markdown',
          },
        );
      }
      case 'cancel_answer': {
        deleteMessageWithCallback(ctx);
        ctx.scene.leave();
        return MainMenuController.onStart(ctx);
      }
      case 'post_answer': {
        deleteMessageWithCallback(ctx);
        ctx.reply('answered');
        ctx.scene.leave();
        return MainMenuController.onStart(ctx);
      }
    }
  }
  static async handleBrowseQuery(ctx: any, query: string) {
    if (query) {
      if (query.startsWith('answer')) {
        const [_, postId] = query.split('_');
        // get question data from the answerinlinequery
        const questionData = {
          postId: '0',
          question: 'Hello guys here is my question 3',
          questionText: '#tech\n\nWhat is the best programming language for beginners? \n\nBy: @username',
          description: 'Asked 1 month ago, 2 Answers',
        };

        return await ctx.reply(
          // add copy sticker
          'Send me your answer   \n\n`Note that you can send your answer through voice, or you could send your answer with media(photo, video, audio)`',
          {
            reply_markup: {
              keyboard: [[{ text: 'Back' }]],
              resize_keyboard: true,
            },
            parse_mode: 'Markdown',
          },
        );
      }
      if (query === 'browse') {
        return await ctx.reply('Browse');
      }
    }
  }

  static async listAllPosts(ctx: any, round: number = 1, searchString?: string) {
    const { success, posts, nextRound, total } = searchString
      ? await questionService.geAlltPostsByDescription(searchString, round)
      : await questionService.geAlltPosts(round);
    if (!success) return ctx.reply('error while');
    for (const post of posts as any[]) {
      const sectionName = getSectionName(post.category) as PostCategory;

      if (post[sectionName].photo && post[sectionName].photo[0])
        await ctx.replyWithPhoto(post[sectionName].photo[0] as any, {
          caption: postFormmatter.getformattedQuestionDetail(post),
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[{ text: 'View Detail', callback_data: `post_detail:${post.id}` }]],
          },
        });
      else
        await ctx.replyWithHTML(postFormmatter.getformattedQuestionDetail(post), {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[{ text: 'View Detail', callback_data: `post_detail:${post.id}` }]],
          },
        });
    }
    if (nextRound != round) {
      await ctx.reply(...postFormmatter.nextRoundSeachedPostsPrompDisplay(round, total, searchString));
    }
  }
  static async getPostDetail(ctx: any, postId: string) {
    const { success, post } = await questionService.getPostById(postId);

    if (!success || !post) return ctx.reply('error while');
    const sectionName = getSectionName(post.category) as PostCategory;

    if ((post as any)[sectionName]?.photo && (post as any)[sectionName]?.photo[0]) {
      const elements = extractElements<string>((post as any)[sectionName].photo);
      if (elements) {
        // if array of elelement has many photos
        await sendMediaGroup(ctx, elements.firstNMinusOne, 'Images Uploaded with post');

        await replyDetailWithContext({
          ctx,
          photoURl: elements.lastElement,
          caption: postFormmatter.getformattedQuestionDetail(post) as string,
        });
      } else {
        // if array of  has one  photo
        await replyDetailWithContext({
          ctx,
          photoURl: (post as any)[sectionName].photo[0],
          caption: postFormmatter.getformattedQuestionDetail(post) as string,
        });
      }
    } else return await ctx.replyWithHTML(...postFormmatter.formatQuestionDetail(post)); // if post has no photo
  }

  static async searchByTitle() {
    const { success, posts } = await questionService.geAlltPosts(1);
  }

  static async postToChannel(bot: any, channelId: any, post: any) {
    const sectionName = getSectionName(post.category) as PostCategory;

    if ((post as any)[sectionName].photo && (post as any)[sectionName].photo[0]) {
      // // if phost has image
      // await sendMediaGroupToChannel(bot, [(post as any)[sectionName].photo[0]], '');

      await messagePostPreviewWithBot({
        bot,
        post_id: post.id,
        chat_id: config.channel_id as string,
        photoURl: (post as any)[sectionName].photo[0],
        caption: postFormmatter.getFormattedQuestionPreview(post) as string,
      });
    } else await messagePostPreview(bot, config.channel_id, postFormmatter.getPostsPreview(post) as string, post.id);
  }
  static async sendPostToUser(bot: any, post: any) {
    const recipientsIds: string[] = [];
    const followerings = post?.user.followings;
    const followers = post?.user.followers;

    if (post?.notify_option == 'friend') {
      if (followerings && followerings?.length > 0 && followers && followers?.length > 0) {
        followers.forEach((follower: any) => {
          followerings.forEach((followering: any) => {
            if (follower.follower_id == followering.following_id) {
              recipientsIds.push(follower.follower_id);
            }
          });
        });
      }
    }

    if (post?.notify_option == 'follower') {
      if (followers && followers.length > 0) {
        followers.forEach((follower: any) => {
          recipientsIds.push(follower.follower_id);
        });
      }
    }

    if (recipientsIds.length > 0) {
      const { status, recipientChatIds } = await questionService.getFilteredRecipients(recipientsIds, post.user.id);

      if (status == 'fail')
        return { status: 'fail', message: 'message not send to user , unable to find recipients chat id' };

      if (recipientChatIds.length < 0)
        return { status: 'fail', message: 'message not send to user, all recipients have blocked the user' };

      const sectionName = getSectionName(post.category) as PostCategory;
      for (const chatId of recipientChatIds) {
        if ((post as any)[sectionName].photo && (post as any)[sectionName].photo[0]) {
          await messagePostPreviewWithBot({
            bot,
            post_id: post.id,
            chat_id: chatId.chat_id,
            photoURl: (post as any)[sectionName].photo[0],
            caption: postFormmatter.getFormattedQuestionPreview(post) as string,
          });
        }
      }

      return { status: 'success', message: 'message sent to user ' };
    } else return { status: 'success', message: 'no  recipients ' };
  }
}

export default PostController;
