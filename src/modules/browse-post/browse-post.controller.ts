// BrowsePostScene
import { Context } from 'telegraf';
import { deleteMessageWithCallback, findSender } from '../../utils/helpers/chat';
import PostService from '../post/post.service';
import BrowsePostFormatter from './browse-post.formatter';
import config from '../../config/config';
import { getCountryCodeByName } from '../../utils/helpers/country-list';
import RegistrationService from '../registration/restgration.service';
const browsePostFormatter = new BrowsePostFormatter();

const registrationService = new RegistrationService();
const postService = new PostService();

class BrowsePostController {
  constructor() {}

  async displayPost(ctx: any) {
    // default state

    ctx.wizard.state.filterBy = {
      category: 'all',
      status: 'all',
      timeframe: 'all',
      fields: {
        ar_br: 'all',
        // main_category: 'main_1',
        main_category: 'all',
        // sub_category: '#SubA_1',
        sub_category: 'all',
        birth_or_marital: 'all',
        service_type: 'all',
        city: {
          cityName: 'all',
          currentRound: 0,
        },
        last_digit: 'all',
      },
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

    // Filter by city
    if (callbackQuery.data.startsWith('filterByCity')) {
      // const cityFilter = `city_${ctx.callbackQuery.data.split('_')[1]}` || 'all';

      const sender = findSender(ctx);
      const userCountry = await registrationService.getUserCountry(sender.id);
      const countryCode = getCountryCodeByName(userCountry as string);

      // const residenceCity = await registrationService.getUserCity(sender.id);

      ctx.wizard.state.filterBy.fields.city = {
        ...ctx.wizard.state.filterBy.fields.city,
        countryCode: countryCode,
        // cityName : 'All',
        currentRound: 0,
      };
      await deleteMessageWithCallback(ctx);

      await ctx.reply(
        ...browsePostFormatter.chooseCityFormatter(
          countryCode as string,
          ctx.wizard.state.filterBy.fields.city.currentRound,
          ctx.wizard.state.filterBy.fields.city?.cityName,
        ),
      );
      return ctx.wizard.selectStep(11);
    }

    // filter by last digit
    if (callbackQuery.data.startsWith('filterByLastDigit')) {
      const lastDigitFilter = ctx.callbackQuery.data.split('_')[1];

      await deleteMessageWithCallback(ctx);
      await ctx.reply(...browsePostFormatter.filterByLastDigitBiDiDisplay(lastDigitFilter));
      return ctx.wizard.selectStep(12);
    }

    // Pagination
    if (callbackQuery.data.startsWith('goToPage')) {
      console.log(callbackQuery.data);

      const page = Number(callbackQuery.data.split('_')[1]);
      console.log('qqqqqqqq');
      console.log(page);

      const posts = await postService.getAllPostsWithQuery(ctx.wizard.state.filterBy, page);
      console.log(posts);
      await deleteMessageWithCallback(ctx);

      return await ctx.replyWithHTML(
        ...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, page, posts.total),
      );
    }
  }

  async handleFilterByCategory(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    console.log(callbackQuery.data);
    if (!callbackQuery) {
      return ctx.reply(...browsePostFormatter.messages.useButtonError);
    }

    if (callbackQuery.data.startsWith('filterByCategory')) {
      const categoryFilter = ctx.callbackQuery.data.split('_')[1];

      ctx.wizard.state.filterBy = {
        ...ctx.wizard.state.filterBy,
        category: categoryFilter,
      };

      if (categoryFilter === 'all') {
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
      } else if (categoryFilter === 'Section 1A') {
        await deleteMessageWithCallback(ctx);
        await ctx.reply(...browsePostFormatter.filterBySection1AWithArBrDisplay(categoryFilter));
        // jump to handler
        return ctx.wizard.selectStep(4);
      } else if (categoryFilter === 'Section 1B') {
        await deleteMessageWithCallback(ctx);
        await ctx.reply(...browsePostFormatter.filterBySection1BMainCategoryDisplay(categoryFilter));
        // jump to handler
        return ctx.wizard.selectStep(5);
      } else if (categoryFilter === 'Section 1C') {
        await deleteMessageWithCallback(ctx);
        await ctx.reply(...browsePostFormatter.filterBySection1CWithArBrDisplay(categoryFilter));
        // jump to handler
        return ctx.wizard.selectStep(7);
      } else if (categoryFilter === 'Section 2') {
        await deleteMessageWithCallback(ctx);
        await ctx.reply(...browsePostFormatter.filterBySection1CWithArBrDisplay(categoryFilter));
        // jump to handler
        return ctx.wizard.selectStep(8);
      } else if (categoryFilter === 'Section 3') {
        await deleteMessageWithCallback(ctx);
        await ctx.reply(...browsePostFormatter.filterBySection3BirthMaritalDisplay(categoryFilter));
        // jump to handler
        return ctx.wizard.selectStep(9);
      } else if (categoryFilter === 'Section 4') {
        await deleteMessageWithCallback(ctx);
        await ctx.reply(...browsePostFormatter.filterBySection4TypeDisplay(categoryFilter));
        // jump to handler
        return ctx.wizard.selectStep(10);
      } else {
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

      // // Get posts by the selected category
      // ctx.wizard.state.filterBy = {
      //   ...ctx.wizard.state.filterBy,
      //   category: categoryFilter,
      // };

      // const posts = await postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
      // console.log(posts);

      // if (!posts || posts.posts.length == 0) {
      //   return ctx.reply(browsePostFormatter.messages.noPostError);
      // }

      // await deleteMessageWithCallback(ctx);
      // ctx.replyWithHTML(
      //   ...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total),
      //   {
      //     parse_mode: 'HTML',
      //   },
      // );

      // return ctx.wizard.selectStep(1);
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
  async handleFilterSection1AWithARBR(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    console.log(`cb: ${callbackQuery.data}`);
    if (!callbackQuery) {
      return ctx.reply(...browsePostFormatter.messages.useButtonError);
    }

    if (callbackQuery.data.startsWith('filterSection1AWithARBR')) {
      const section1AWithARBRFilter = ctx.callbackQuery.data.split('_')[1];
      console.log(section1AWithARBRFilter);

      ctx.wizard.state.filterBy = {
        ...ctx.wizard.state.filterBy,
        fields: {
          ...ctx.wizard.state.filterBy.fields,
          ar_br: String(section1AWithARBRFilter).toLowerCase(),
        },
      };

      // Get posts by the selected category
      const posts = await postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
      console.log(posts);

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

  async handleFilterBySection1BMain(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    console.log(callbackQuery.data);
    if (!callbackQuery) {
      return ctx.reply(...browsePostFormatter.messages.useButtonError);
    }

    if (callbackQuery.data.startsWith('filterBySection1BMain')) {
      //append the value of main
      const section1BMainFilter = `main_${ctx.callbackQuery.data.split('_')[2]}`;
      console.log(`filterrr ${section1BMainFilter}`);

      if (section1BMainFilter === 'all') {
        ctx.wizard.state.filterBy = {
          ...ctx.wizard.state.filterBy,
          fields: {
            ...ctx.wizard.state.filterBy.fields,
            main_category: section1BMainFilter,
          },
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
      } else {
        ctx.wizard.state.filterBy = {
          ...ctx.wizard.state.filterBy,
          fields: {
            ...ctx.wizard.state.filterBy.fields,
            main_category: section1BMainFilter,
          },
        };
        await deleteMessageWithCallback(ctx);
        await ctx.reply(...browsePostFormatter.filterBySection1BSubCategoryDisplay(section1BMainFilter));
        return ctx.wizard.next();
      }
    }
  }

  async handleFilterBySection1BSub(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    console.log(callbackQuery.data);
    if (!callbackQuery) {
      return ctx.reply(...browsePostFormatter.messages.useButtonError);
    }

    if (callbackQuery.data.startsWith('filterBySection1BSub')) {
      // append the second and third array element
      const section1BSubFilter = `${ctx.callbackQuery.data.split('_')[1]}_${ctx.callbackQuery.data.split('_')[2]}`;
      console.log(section1BSubFilter);

      ctx.wizard.state.filterBy = {
        ...ctx.wizard.state.filterBy,
        fields: {
          ...ctx.wizard.state.filterBy.fields,
          sub_category: section1BSubFilter,
        },
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

  async handleFilterSection1CWithARBR(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    console.log(callbackQuery.data);
    if (!callbackQuery) {
      return ctx.reply(...browsePostFormatter.messages.useButtonError);
    }

    if (callbackQuery.data.startsWith('filterSection1CWithARBR')) {
      const section1CWithARBRFilter = ctx.callbackQuery.data.split('_')[1];

      ctx.wizard.state.filterBy = {
        ...ctx.wizard.state.filterBy,
        fields: {
          ...ctx.wizard.state.filterBy.fields,
          ar_br: String(section1CWithARBRFilter).toLowerCase(),
        },
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

  async handleFilterSection2Type(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    console.log(callbackQuery.data);
    if (!callbackQuery) {
      return ctx.reply(...browsePostFormatter.messages.useButtonError);
    }

    if (callbackQuery.data.startsWith('filterBySection2Type')) {
      const section2TypeFilter = ctx.callbackQuery.data.split('_')[1];

      ctx.wizard.state.filterBy = {
        ...ctx.wizard.state.filterBy,
        fields: {
          ...ctx.wizard.state.filterBy.fields,
          service_type: section2TypeFilter,
        },
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

  async handleFilterSection3BirthMarital(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      return ctx.reply(...browsePostFormatter.messages.useButtonError);
    }

    if (callbackQuery.data.startsWith('filterBySection3BirthMarital')) {
      const section3BirthMaritalFilter = ctx.callbackQuery.data.split('_')[1];
      console.log(`Maritalll: ${section3BirthMaritalFilter}`);

      ctx.wizard.state.filterBy.fields = {
        ...ctx.wizard.state.filterBy.fields,
        birth_or_marital: section3BirthMaritalFilter,
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
  async handleFilterSection4Type(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    console.log(callbackQuery.data);
    if (!callbackQuery) {
      return ctx.reply(...browsePostFormatter.messages.useButtonError);
    }

    if (callbackQuery.data.startsWith('filterBySection4Type')) {
      const section4WithTypeFilter = ctx.callbackQuery.data.split('_')[1];

      ctx.wizard.state.filterBy = {
        ...ctx.wizard.state.filterBy,
        category: section4WithTypeFilter,
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

  async handleFilterByCity(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(browsePostFormatter.messages.useButtonError);

    deleteMessageWithCallback(ctx);
    switch (callbackQuery.data) {
      case 'back': {
        if (ctx.wizard.state.filterBy.fields.city.currentRound == 0) {
          return ctx.wizard.selectStep(0);
        }

        ctx.wizard.state.filterBy.fields.city.currentRound = ctx.wizard.state.filterBy.fields.city.currentRound - 1;
        return ctx.reply(
          ...browsePostFormatter.chooseCityFormatter(
            ctx.wizard.state.filterBy.fields.city.countryCode,
            ctx.wizard.state.filterBy.fields.city.currentRound,
          ),
        );
      }

      case 'next': {
        ctx.wizard.state.filterBy.fields.city.currentRound = ctx.wizard.state.filterBy.fields.city.currentRound + 1;
        return ctx.reply(
          ...browsePostFormatter.chooseCityFormatter(
            ctx.wizard.state.filterBy.fields.city.countryCode,
            ctx.wizard.state.filterBy.fields.city.currentRound,
          ),
        );
      }

      default:
        ctx.wizard.state.filterBy.fields.city.currentRound = 0;
        ctx.wizard.state.filterBy.fields.city.cityName = callbackQuery.data;
        // fetch post with city
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

        return ctx.wizard.selectStep(1);
    }
  }

  async handleFilterByLastDigit(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    console.log(callbackQuery.data);
    if (!callbackQuery) {
      return ctx.reply(...browsePostFormatter.messages.useButtonError);
    }

    if (callbackQuery.data.startsWith('filterByLastDigitBiDi')) {
      const lastDigitFilter = ctx.callbackQuery.data.split('_')[1];

      ctx.wizard.state.filterBy = {
        ...ctx.wizard.state.filterBy,
        fields: {
          ...ctx.wizard.state.filterBy.fields,
          last_digit: lastDigitFilter,
        },
      };

      if (lastDigitFilter == 'all' || lastDigitFilter == 'bi' || lastDigitFilter == 'di') {
        await deleteMessageWithCallback(ctx);
        await ctx.reply(
          ...browsePostFormatter.chooseBiDiButtonsDisplay(lastDigitFilter, ctx.wizard.state.filterBy.fields.last_digit),
        );
        return ctx.wizard.selectStep(13);
      }
    }
  }

  async handlefilterByLastDigitBIDI(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    console.log(callbackQuery.data);
    if (!callbackQuery) {
      return ctx.reply(...browsePostFormatter.messages.useButtonError);
    }

    if (callbackQuery.data.startsWith('filterByLastDigitBiDiOptions')) {
      const lastDigitFilter = ctx.callbackQuery.data.split('_')[1];
      console.log('lastDigitFilter');

      ctx.wizard.state.filterBy = {
        ...ctx.wizard.state.filterBy,
        fields: {
          ...ctx.wizard.state.filterBy.fields,
          last_digit: lastDigitFilter,
        },
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

// function generateWoredaDisplayName(woreda: string) {
//   switch (woreda) {
//     case 'woreda_1':
//       return 'Woreda 1';

//     case 'woreda_2':
//       return 'Woreda 2';

//     case 'woreda_3':
//       return 'Woreda 3';
//     case 'woreda_4':
//       return 'Woreda 4';

//     case 'woreda_5':
//       return 'Woreda 5';
//     case 'woreda_6':
//       return 'Woreda 6';
//     case 'woreda_7':
//       return 'Woreda 7';
//     case 'woreda_8':
//       return 'Woreda 8';
//     case 'woreda_9':
//       return 'Woreda 9';
//     case 'woreda_10':
//       return 'Woreda 10';

//     default:
//       return 'all';
//   }
// }

export default BrowsePostController;
