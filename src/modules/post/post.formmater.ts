import { Post, User } from '@prisma/client';
import config from '../../config/config';
import { TableInlineKeyboardButtons } from '../../types/components';
import { InlineKeyboardButtons } from '../../ui/button';
import { formatDateFromIsoString } from '../../utils/constants/date';
import { capitalize, areEqaul, getSectionName } from '../../utils/constants/string';
import Post1AFormatter from './section-1/section-1a/section-a.formatter';
import Post1BFormatter from './section-1/section-1b/section-b.formatter';
import Post1CFormatter from './section-1/section-1c/section1c.formatter';

import { PostCategory } from '../../types/params';
import Section4Formatter from './section-4/section-4.formatter';
import ManufactureFormatter from './section-4/manufacture/manufacture.formatter';
import ChickenFarmFormatter from './section-4/chicken-farm/chicken-farm.formatter';
import ConstructionFormatter from './section-4/construction/construction.formatter';
import Post2Formatter from './section-2/section-2.formatter';
import Section3Formatter from './section-3/section-3.formatter';

const post1AFormatter = new Post1AFormatter();
const post1BFormatter = new Post1BFormatter();
const post1CFormatter = new Post1CFormatter();
const post2Formatter = new Post2Formatter();
const section3Formatter = new Section3Formatter();

const manufactureFormatter = new ManufactureFormatter();
const chickenFarmFormatter = new ChickenFarmFormatter();
const constructionFormatter = new ConstructionFormatter();

class PostFormatter {
  answerOptions: TableInlineKeyboardButtons = [
    [
      { text: '✏️ Edit', cbString: 'edit_answer' },
      { text: 'cancel', cbString: 'cancel_answer' },
    ],
    [{ text: '✅ Post', cbString: 'post_answer' }],
  ];
  messages = {
    noQuestionTitle: '**No question found mathcing your query**',
    noQuestionDesc: 'Click here to ask a question',
    NoQuestionMessageText: 'Click the button below  to ask ',
    allQuestionsMsg: 'Click the button below  to list the questions ',
    useButtonError: 'use buttons to select  ',
  };

  constructor() {}

  seachQuestionTopBar(questionsNumber: number = 0, searchString: string) {
    return {
      text: `${questionsNumber} Questions: Show All`,
      start_parameter: `searchedPosts_${searchString}_${1}`,
    };
  }

  questionOptionsButtons(questionId: string, withUrl?: boolean) {
    if (withUrl)
      return [
        // navigate to the bot and start the bot with the command 'answer'
        { text: `Answer`, url: `${config.bot_url}?start=answer_${questionId}` },
        // { text: `Browse`, url: `${config.bot_url}?start=browse_${questionId}` },
      ];
    else
      return InlineKeyboardButtons([
        [
          { text: 'Browse', cbString: `browse_${questionId}` },
          { text: 'Subscribe', cbString: `subscribe_${questionId}` },
        ],
      ]);
  }

  formatSearchQuestions(posts: any[]) {
    return posts.map((post, index) => ({
      type: 'article',
      id: `${post.id}_${index}`,
      title: post.description,
      input_message_content: {
        message_text: `#${post.category}\n\n${post.description}\n\nBy: <a href="${config.bot_url}?start=userProfile_${post.user.id}">${post.user.display_name}</a>\n${formatDateFromIsoString(post.created_at)}`,
        parse_mode: 'HTML',
        entities: [
          {
            type: 'bold',
            offset: 0,
            length: 10,
          },
        ],
      },
      reply_markup: {
        inline_keyboard: [this.questionOptionsButtons(post.id.toString(), true)],
      },
      description: `Posted ${formatDateFromIsoString(post?.created_at)},  ${capitalize(post.status)}`,
    }));
  }
  formatNoQuestionsErrorMessage() {
    return [
      {
        type: 'article',
        id: `_${1111}`,
        title: this.messages.noQuestionTitle,
        description: this.messages.noQuestionDesc,
        input_message_content: {
          message_text: this.messages.NoQuestionMessageText,
          parse_mode: 'Markdown',
          entities: [
            {
              type: 'bold',
              offset: 0,
              length: 10,
            },
          ],
        },
        reply_markup: {
          inline_keyboard: [
            // navigate to the bot and start the bot with the command 'answer'
            { text: `Ask a question`, url: `${config.bot_url}?start` },
          ],
        },
      },
    ];
  }

  nextRoundSeachedPostsPrompDisplay = (round: number, totalCount: number, searchString?: string) => {
    const resultPerPage = parseInt(config.number_of_result || '5');
    return [
      `Showed ${round * resultPerPage} of ${totalCount} `,
      searchString
        ? InlineKeyboardButtons([[{ text: 'Show More', cbString: `searchedPosts_${searchString}_${round}` }]])
        : InlineKeyboardButtons([[{ text: 'Show More', cbString: `showAllPosts$_${round}` }]]),
    ];
  };
  formatSingleQuestion(question: any, forAnswer?: boolean) {
    return [
      `#${question.category}\n\n${question.description}\n\nBy: <a href="${config.bot_url}?start=userProfile_${question.user.id}">${question.user.display_name}</a>\n${formatDateFromIsoString(question.created_at)}`,
      this.questionOptionsButtons(question.id, !forAnswer),
    ];
  }
  getFormattedQuestionPreview(question: any) {
    switch (true) {
      case areEqaul(question.category, 'Section 1A', true): {
        return `#${question.category.replace(/ /g, '_')}\n________________\n\n${question.ar_br.toLocaleUpperCase()}\n\nWoreda: ${question.woreda} \n\nLast digit: ${question.last_digit}\n\nBy: <a href="${config.bot_url}?start=userProfile_${question.user.id}">${question.user.display_name != null ? question.user.display_name : 'Anonymous '}</a>`;
      }
    }
  }
  formatQuestionDetail(post: any, forAnswer?: boolean) {
    return [this.getformattedQuestionDetail(post)];
  }
  formatAnswerPreview(answer: string, sender: User) {
    return [
      `${answer}\n\n\nBy: <a href="${config.bot_url}?start=userProfile_${sender.id}">${sender.display_name || 'Anonymous'}</a>\n${formatDateFromIsoString(new Date().toISOString())}`,
      InlineKeyboardButtons(this.answerOptions),
    ];
  }

  getformattedQuestionDetail(post: any) {
    const sectionName = getSectionName(post.category) as PostCategory;
    switch (post.category) {
      case 'Section 1A':
        return post1AFormatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      case 'Section 1B':
        return post1BFormatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      case 'Section 1C':
        return post1CFormatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      case 'Section 2': {
        return post2Formatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      }

      case 'Section 3': {
        return section3Formatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created,
          user: post.user,
          ...post[sectionName],
        });
      }

      case 'Chicken Farm':
        return chickenFarmFormatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      case 'Section4Manufacture':
        return manufactureFormatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      case 'Section4Construction':
        return constructionFormatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
    }

    switch (true) {
      case areEqaul(post.category, 'Section 1A', true): {
        return `#${post.category.replace(/ /g, '_')}\n________________\n\n${post.ar_br.toLocaleUpperCase()}\n\nWoreda: ${post.woreda} \n\nLast digit: ${post.last_digit} ${post.bi_di.toLocaleUpperCase()} \n\nSp. Locaton: ${post.location} \n\nDescription: ${post.description}\n\nBy: <a href="${config.bot_url}?start=userProfile_${post.user.id}">${post.user.display_name != null ? post.user.display_name : 'Anonymous '}</a>\n\nStatus : ${post.status}`;
        ``;
      }
    }
  }
}

export default PostFormatter;
