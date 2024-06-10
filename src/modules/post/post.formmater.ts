import { Post, User } from '@prisma/client';
import config from '../../config/config';
import { TableInlineKeyboardButtons } from '../../types/ui';
import { InlineKeyboardButtons } from '../../ui/button';
import { formatDateFromIsoString } from '../../utils/helpers/date';
import { capitalize, areEqaul, getSectionName } from '../../utils/helpers/string';
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
import { timeStamp } from 'console';
import { getCitiesOfCountry, iterateCities } from '../../utils/helpers/country-list';

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
    selectCategoryMessage: 'Select category...',
    selectTimeStampMessage: 'Select timeframe...',
    chooseCityPrompt: 'Please choose your city',
  };

  constructor() {}

  // Buttons to filter by status
  filterByStatusButtons(status: any) {
    const buttons = [
      { text: 'All', cbString: `filterByStatus_all` },
      { text: 'Open', cbString: `filterByStatus_open` },
      { text: 'Closed', cbString: `filterByStatus_closed` },
    ];

    return buttons.map((button) => ({
      ...button,
      text: `${status === button.cbString.split('_')[1] ? '✅' : ''} ${button.text}`,
    }));
  }

  // Button to display categories for filtering
  filterByCategoryButton(category: string) {
    return [
      {
        text: `Category - ${category}`,
        cbString: `filterByCategory`,
      },
    ];
  }

  // List of categories button to filter
  filterByCategoryChooseButtons(category: any) {
    const categories = [
      'all',
      'Section 1A',
      'Section 1B',
      'Section 1C',
      'Section 2',
      'Section 3',
      'Chicken Farm',
      'Section4Manufacture',
      'Section4Construction',
    ];

    return categories.map((cat) => ({
      text: `${category === cat ? '✅' : ''} ${cat}`,
      cbString: `filterByCategory_${cat}`,
    }));
  }

  // Button to display timeframes for filtering
  filterByTimeframeButton(timeframe: string) {
    const timeFrameDisplay = {
      all: 'All Time',
      today: 'Today',
      last7: 'Last 7 days',
      last30: 'Last 30 days',
    } as any;

    return [
      {
        text: `Timeframe - ${timeFrameDisplay[timeframe]}`,
        cbString: `filterByTimeframe_${timeframe}`,
      },
    ];
  }

  // List of timeframes button to filter
  filterByTimeframeChooseButtons(timeframe: any) {
    const timeFrameDisplay = {
      all: 'All Time',
      today: 'Today',
      last7: 'Last 7 days',
      last30: 'Last 30 days',
    };
    return Object.entries(timeFrameDisplay).map(([key, value]) => ({
      text: `${timeframe === key ? '✅' : ''} ${value}`,
      cbString: `filterByTimeframe_${key}`,
    }));
  }

  browsePostDisplay(post: any) {
    return [
      // 'hello',
      this.getPostsPreview(post),
      InlineKeyboardButtons([
        this.filterByStatusButtons('open'),
        this.filterByCategoryButton('All'),
        this.filterByTimeframeButton('all'),
      ]),

      // this.filterByCategoryChooseButtons(post.category),
      // this.filterByStatusButtons(post.status),
      // this.filterByTimeframeChooseButtons('all'),
    ];
  }

  filterByStatusOptionDisplay(status: string) {
    return [
      `Filter by status`,
      InlineKeyboardButtons([
        [
          { text: `${status == 'all' ? '✅' : ''} All`, cbString: `filterByStatus_all` },
          { text: `${status == 'open' ? '✅' : ''} Open`, cbString: `filterByStatus_open` },
          { text: `${status == 'closed' ? '✅' : ''} Closed`, cbString: `filterByStatus_closed` },
        ],
      ]),
    ];
  }

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
        { text: `Detail`, url: `${config.bot_url}?start=postDetail_${questionId}` },
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
        message_text: this.getPostsPreview(post) as string,
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
            { text: `Make a post`, url: `${config.bot_url}?start` },
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
        ? InlineKeyboardButtons([[{ text: 'Show More', cbString: `searchedPosts_${searchString}_${round + 1}` }]])
        : InlineKeyboardButtons([[{ text: 'Show More', cbString: `showAllPosts_${round + 1}` }]]),
    ];
  };
  formatSingleQuestion(question: any, forAnswer?: boolean) {
    return [
      `#${question.category}\n\n${question.description}\n\nBy: <a href="${config.bot_url}?start=userProfile_${question.user.id}">${question.user.display_name}</a>\n${formatDateFromIsoString(question.created_at)}`,
      this.questionOptionsButtons(question.id, !forAnswer),
    ];
  }
  // getFormattedQuestionPreview(question: any) {
  //   switch (true) {
  //     case areEqaul(question.category, 'Section 1A', true): {
  //       return `#${question.category.replace(/ /g, '_')}\n________________\n\n${question.ar_br?.toLocaleUpperCase()}\n\nWoreda: ${question.woreda} \n\nLast digit: ${question.last_digit}\n\nBy: <a href="${config.bot_url}?start=userProfile_${question.user.id}">${question.user.display_name != null ? question.user.display_name : 'Anonymous '}</a>`;
  //     }
  //   }
  // }
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
        return post1AFormatter.getDetailData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      case 'Section 1B':
        return post1BFormatter.getDetailData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      case 'Section 1C':
        return post1CFormatter.getDetailData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      case 'Section 2': {
        return post2Formatter.getDetailData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      }

      case 'Section 3': {
        return section3Formatter.getDetailData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created,
          user: post.user,
          ...post[sectionName],
        });
      }

      case 'Chicken Farm':
        return chickenFarmFormatter.getDetailData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      case 'Section4Manufacture':
        return manufactureFormatter.getDetailData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      case 'Section4Construction':
        return constructionFormatter.getDetailData({
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
  getFormattedQuestionPreview(post: any) {
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
  }

  getPostsPreview(post: any) {
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
  }

  // getBrowsePreview(post: any) {
  //   return [
  //     this.getPostsPreview(post),
  //     this.filterByCategoryChooseButtons(post.category),
  //     this.filterByStatusButtons(post.status),
  //     this.filterByTimeframeChooseButtons('all'),
  //   ];
  // }

  // getFormattedPostPreview(post: Post) {
  //   const sectionName = getSectionName(post.category) as PostCategory;
  //   switch (post.category) {
  //     case 'Section 1A':
  //       return post1AFormatter.getPreviewData(post);
  //     case 'Section 1B':
  //       return post1BFormatter.getPreviewData(post);
  //     case 'Section 1C':
  //       return post1CFormatter.getPreviewData(post);
  //     case 'Section 2': {
  //       return post2Formatter.getPreviewData(post);
  //     }

  //     case 'Section 3': {
  //       return section3Formatter.getPreviewData(post);
  //     }

  //     case 'Chicken Farm':
  //       return chickenFarmFormatter.getPreviewData(post);
  //     case 'Section4Manufacture':
  //       return manufactureFormatter.getPreviewData(post);
  //     case 'Section4Construction':
  //       return constructionFormatter.getPreviewData(post);
  //   }
  // }

  // choose city based on the selected country
  async chooseCityFormatter(countryCode: string, currentRound: any) {
    let cities: any[] = [];
    const citiesExtracted = await getCitiesOfCountry(countryCode);
    if (citiesExtracted) cities = citiesExtracted;
    const { cityList, lastRound } = iterateCities(cities, 30, parseInt(currentRound));

    if (cityList)
      return [
        this.messages.chooseCityPrompt,
        InlineKeyboardButtons(
          // map the country list to the buttons
          [
            ...cityList.map((city) => [{ text: city.name, cbString: city.name }]),

            [{ text: 'Other', cbString: 'Other' }],
            !lastRound ? [{ text: '➡️ Next', cbString: 'next' }] : [],
            [{ text: '⬅️ Back', cbString: 'back' }],
          ],
        ),
        InlineKeyboardButtons(
          // map the country list to the buttons
          [[{ text: 'Other', cbString: 'Other' }]],
        ),
      ];

    return [
      'Unable to find cities',
      InlineKeyboardButtons(
        // map the country list to the buttons
        [[{ text: 'Back', cbString: 'back' }], [{ text: 'Other', cbString: 'Other' }]],
      ),
    ];
  }
}

export default PostFormatter;
