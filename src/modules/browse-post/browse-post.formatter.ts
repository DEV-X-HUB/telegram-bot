import config from '../../config/config';
import { PostCategory } from '../../types/params';
import { InlineKeyboardButtons } from '../../ui/button';
import { areEqaul, getSectionName } from '../../utils/constants/string';
import Post1AFormatter from '../post/section-1/section-1a/section-a.formatter';
import Post1BFormatter from '../post/section-1/section-1b/section-b.formatter';
import Post1CFormatter from '../post/section-1/section-1c/section1c.formatter';
import Post2Formatter from '../post/section-2/section-2.formatter';
import Section3Formatter from '../post/section-3/section-3.formatter';
import ChickenFarmFormatter from '../post/section-4/chicken-farm/chicken-farm.formatter';
import ConstructionFormatter from '../post/section-4/construction/construction.formatter';
import ManufactureFormatter from '../post/section-4/manufacture/manufacture.formatter';

const post1AFormatter = new Post1AFormatter();
const post1BFormatter = new Post1BFormatter();
const post1CFormatter = new Post1CFormatter();
const post2Formatter = new Post2Formatter();
const section3Formatter = new Section3Formatter();

const manufactureFormatter = new ManufactureFormatter();
const chickenFarmFormatter = new ChickenFarmFormatter();
const constructionFormatter = new ConstructionFormatter();

const PAGE_SIZE = 1;

class BrowsePostFormatter {
  messages = {
    useButtonError: 'Please use buttons to select',
    selectCategoryMessage: 'Select category...',
    selectTimeStampMessage: 'Select timeframe...',
    noPostError: 'No post found',
  };
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
        text: `Category - ${category || 'All Topics'}`,
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
      'Manufacture',
      'Construction',
    ];

    return categories.map((cat) => [
      {
        text: `${category === cat ? '✅' : ''} ${cat}`,
        cbString: `filterByCategory_${cat}`,
      },
    ]);
  }

  // Button to display timeframes for filtering
  filterByTimeframeButton(timeframe: string) {
    const timeFrameDisplay = {
      all: 'All Time',
      today: 'Today',
      last7: 'Last 7 days',
      last30: 'Last 30 days',
    } as any;

    // let timeFrameToDisplay;
    // switch (timeframe) {
    //   case 'all':
    //     timeFrameToDisplay = 'All Time';
    //   case 'today':
    //     timeFrameToDisplay = 'Today';
    //   case 'last7':
    //     timeFrameToDisplay = 'Last 7 days';
    //   case 'last30':
    //     timeFrameToDisplay = 'Last 30 days';
    //   default:
    //     timeFrameToDisplay = 'All Time';
    // }

    return [
      {
        text: `Timeframe - ${timeFrameDisplay[timeframe] || 'All Time'}`,
        cbString: `filterByTimeframe_${timeframe}`,
      },
    ];
  }

  // List of timeframes button to filter
  filterByTimeframeChooseButtons(timeframe?: any) {
    const timeFrameDisplay = {
      all: 'All Time',
      today: 'Today',
      last7: 'Last 7 days',
      last30: 'Last 30 days',
    };

    // let timeFrameToDisplay;
    // switch (timeframe) {
    //   case 'all':
    //     timeFrameToDisplay = 'All Time';
    //   case 'today':
    //     timeFrameToDisplay = 'Today';
    //   case 'last7':
    //     timeFrameToDisplay = 'Last 7 days';
    //   case 'last30':
    //     timeFrameToDisplay = 'Last 30 days';
    //   default:
    //     timeFrameToDisplay = 'All Time';
    // }

    // return [
    //   {
    //     text: `a`,
    //     cbString: `a`,
    //   },
    // ];
    return Object.entries(timeFrameDisplay).map(([key, value]) => [
      {
        text: `${timeframe === key ? '✅' : ''} ${value}`,
        cbString: `filterByTimeframe_${key}`,
      },
    ]);
  }

  filterByCategoryDisplay(category: any) {
    return [this.messages.selectCategoryMessage, InlineKeyboardButtons(this.filterByCategoryChooseButtons(category))];
  }

  filterByTimeframeDisplay(timestamp?: any) {
    return [
      this.messages.selectTimeStampMessage,
      InlineKeyboardButtons(this.filterByTimeframeChooseButtons(timestamp)),
    ];
  }

  browsePostDisplay(post: any, filter?: any, currentPage?: number, totalPages?: number) {
    return [
      this.getPostsPreview(post),
      InlineKeyboardButtons([
        this.filterByStatusButtons(filter?.status || 'all'),
        this.filterByCategoryButton(filter?.category || 'all'),
        this.filterByTimeframeButton(filter?.timeframe || 'all'),
        this.paginationButtons(currentPage as number, totalPages as number),
      ]),

      // this.filterByCategoryChooseButtons(post.category),
      // this.filterByStatusButtons(post.status),
      // this.filterByTimeframeChooseButtons('all'),
    ];
  }

  // paginationButtons(page: number, totalPages: number) {
  //   const buttons = [];

  //   // Add button to go to first page
  //   buttons.push({ text: '<<', cbString: `goToPage_1` });

  //   // Add button to go to previous page
  //   if (page > 1) {
  //     buttons.push({ text: `<${page - 1}`, cbString: `goToPage_${page - 1}` });
  //   }

  //   // Add current page button
  //   buttons.push({ text: `${page}(current)`, cbString: `goToPage_${page}` });

  //   // Add button to go to next page
  //   if (page < totalPages) {
  //     buttons.push({ text: `${page + 1}>`, cbString: `goToPage_${page + 1}` });
  //   }

  //   // Add button to go to last page
  //   buttons.push({ text: `>>${totalPages}`, cbString: `goToPage_${totalPages}` });

  //   return buttons;
  // }
  paginationButtons(page: number, totalPages: number) {
    const buttons = [];
    const currentPage = page;

    // Add buttons for the current page and its immediate neighbors
    const neighborCount = 1;
    let start = Math.max(1, page - neighborCount);
    let end = Math.min(totalPages, page + neighborCount);

    if (start > 1) {
      buttons.push({ text: `${currentPage == 1 ? '1' : '⏮ 1'}`, cbString: `goToPage_1` });
      if (start > 2) {
        // buttons.push({ text: '...', cbString: `goToPage_${start - 1}` });
      }
    }

    for (let i = start; i <= end; i++) {
      buttons.push({
        text: `${currentPage === i ? `${i}` : `${currentPage > i ? '◀️ ' : ''}${currentPage < i ? '▶️ ' : ''}${i}`}`,

        cbString: `goToPage_${i}`,
      });
    }

    if (end < totalPages) {
      // if (end < totalPages - 1) {
      //   buttons.push({ text: '...', cbString: `goToPage_${end + 1}` });
      // }
      buttons.push({
        text: `${currentPage == totalPages ? '' : '⏭'} ${totalPages}`,
        cbString: `goToPage_${totalPages}`,
      });
    }

    return buttons;
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

    switch (true) {
      case areEqaul(post.category, 'Section 1A', true): {
        return `#${post.category.replace(/ /g, '_')}\n________________\n\n${post.ar_br.toLocaleUpperCase()}\n\nWoreda: ${post.woreda} \n\nLast digit: ${post.last_digit} ${post.bi_di.toLocaleUpperCase()} \n\nSp. Locaton: ${post.location} \n\nDescription: ${post.description}\n\nBy: <a href="${config.bot_url}?start=userProfile_${post.user.id}">${post.user.display_name != null ? post.user.display_name : 'Anonymous '}</a>\n\nStatus : ${post.status}`;
        ``;
      }
    }
  }
}
export default BrowsePostFormatter;
