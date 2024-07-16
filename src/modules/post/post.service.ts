import prisma from '../../loaders/db-connecion';
import { v4 as UUID } from 'uuid';

import {
  CreateCategoryPostDto,
  CreatePostDto,
  CreatePostService1ADto,
  CreatePostService1BDto,
  CreatePostService1CDto,
  CreatePostService2Dto,
  CreatePostService3Dto,
  CreatePostService4ChickenFarmDto,
  CreatePostService4ConstructionDto,
  CreatePostService4ManufactureDto,
} from '../../types/dto/create-question-post.dto';
import { PostCategory } from '../../types/params';
import { PostStatus, ResponseWithData } from '../../types/api';
import config from '../../config/config';

class PostService {
  constructor() {}

  static async createpost(post: any, tg_id: string) {
    try {
      // Find user with tg_id
      const user = await prisma.user.findUnique({
        where: {
          tg_id: tg_id.toString(),
        },
      });

      if (!user) {
        return {
          success: false,
          data: null,
          message: 'User not found',
        };
      }

      // Create question and store it
      const question = await prisma.post.create({
        data: {
          id: UUID(),
          ...post,
          user_id: user.id,
          status: 'pending',
        },
      });

      return {
        success: true,
        data: question,
        message: 'Question created successfully',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        data: null,
        message: 'An error occurred while creating the question',
      };
    }
  }
  static async createPost(postDto: CreatePostDto, tg_id: string) {
    try {
      // Find user with tg_id
      const user = await prisma.user.findUnique({
        where: {
          tg_id: tg_id.toString(),
        },
      });

      if (!user) {
        return {
          success: false,
          post: null,
          message: 'User not found',
        };
      }

      // Create question and store it
      const post = await prisma.post.create({
        data: {
          ...postDto,
          status: 'pending',
          user_id: user.id,
        },
      });

      return {
        success: true,
        post: post,
        message: 'post created',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        post: null,
        message: 'An error occurred while creating the post',
      };
    }
  }

  static async createCategoryPost(postDto: CreateCategoryPostDto, tg_id: string) {
    try {
      const { description, category, notify_option, previous_post_id } = postDto;
      const postData = await this.createPost(
        {
          description,
          category,
          notify_option,
          previous_post_id,
        },
        tg_id,
      );

      if (!postData.success || !postData.post)
        return {
          success: false,
          data: null,
          message: postData.message,
        };

      let post = null;
      switch (category) {
        case 'Section 1A': {
          const { description, category, notify_option, previous_post_id, ...createCategoryPostDto } =
            postDto as CreatePostService1ADto;
          post = await prisma.service1A.create({
            data: {
              post_id: postData.post.id,
              ...createCategoryPostDto,
            },
          });
          break;
        }
        case 'Section 1B': {
          const { description, category, notify_option, previous_post_id, ...createCategoryPostDto } =
            postDto as CreatePostService1BDto;
          post = await prisma.service1B.create({
            data: {
              post_id: postData.post.id,
              ...createCategoryPostDto,
            },
          });
          break;
        }
        case 'Section 1C': {
          const { description, category, notify_option, previous_post_id, ...createCategoryPostDto } =
            postDto as CreatePostService1CDto;
          post = await prisma.service1C.create({
            data: {
              post_id: postData.post.id,
              ...createCategoryPostDto,
            },
          });
          break;
        }
        case 'Section 2': {
          const { description, category, notify_option, previous_post_id, ...createCategoryPostDto } =
            postDto as CreatePostService2Dto;
          post = await prisma.service2.create({
            data: {
              post_id: postData.post.id,
              ...createCategoryPostDto,
            },
          });
          break;
        }

        case 'Section 3': {
          const { description, category, notify_option, previous_post_id, ...createCategoryPostDto } =
            postDto as CreatePostService3Dto;
          post = await prisma.service3.create({
            data: {
              post_id: postData.post.id,
              ...createCategoryPostDto,
            },
          });
          break;
        }

        case 'Chicken Farm': {
          const { description, category, notify_option, previous_post_id, ...createCategoryPostDto } =
            postDto as CreatePostService4ChickenFarmDto;
          post = await prisma.service4ChickenFarm.create({
            data: {
              post_id: postData.post.id,
              ...createCategoryPostDto,
            },
          });
          break;
        }
        case 'Construction': {
          const { description, category, notify_option, previous_post_id, ...createCategoryPostDto } =
            postDto as CreatePostService4ConstructionDto;
          post = await prisma.service4Construction.create({
            data: {
              post_id: postData.post.id,
              ...createCategoryPostDto,
            },
          });
          break;
        }
        case 'Manufacture':
          {
            const { description, category, notify_option, previous_post_id, ...createCategoryPostDto } =
              postDto as CreatePostService4ManufactureDto;
            post = await prisma.service4Manufacture.create({
              data: {
                post_id: postData.post.id,
                ...createCategoryPostDto,
              },
            });
          }
          break;
      }
      if (post)
        return {
          success: true,
          data: { ...post, post_id: postData.post.id },
          message: 'Post created successfully',
        };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        data: null,
        message: 'An error occurred while creating the post',
      };
    }
  }

  static async deletePostById(postId: string, category?: PostCategory): Promise<Boolean> {
    try {
      await prisma.post.delete({ where: { id: postId } });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
    // try {
    //   switch (category) {
    //     case 'Section 1A':
    //       await prisma.post.delete({ where: { id: postId } });
    //       break;
    //     case 'Service4ChickenFarm':
    //       await prisma.post.delete({ where: { id: postId } });
    //     case 'Service4Construction':
    //       await prisma.post.delete({ where: { id: postId } });
    //     case 'Service4Manufacture':
    //       await prisma.post.delete({ where: { id: postId } });
    //   }
    //   return true;
    // } catch (error) {
    //   console.log(error);
    //   return false;
    // }
  }
  static async getUserPosts(user_id: string) {
    try {
      const posts = await prisma.post.findMany({
        where: {
          user_id,
        },
        include: {
          user: {
            select: {
              id: true,
              display_name: true,
            },
          },
        },
      });

      return { success: true, posts: posts, message: 'success' };
    } catch (error: any) {
      console.log(error);
      return { success: false, posts: null, message: error?.message };
    }
  }
  static async getUserPostsByTgId(tg_id: string) {
    const user = await prisma.user.findUnique({
      where: {
        tg_id: tg_id.toString(),
      },
    });
    if (!user) return { success: false, posts: null, message: `No user found with telegram Id ${tg_id}` };
    try {
      const posts = await prisma.post.findMany({
        where: {
          user_id: user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              display_name: true,
            },
          },
          Service1A: true,
          Service1B: true,
          Service1C: true,
          Service2: true,
          Service3: true,
          Service4ChickenFarm: true,
          Service4Manufacture: true,
          Service4Construction: true,
        },
      });

      return { success: true, posts: posts, message: 'success' };
    } catch (error: any) {
      console.log(error);
      return { success: false, posts: null, message: error?.message };
    }
  }
  static async getPostById(post_id: string) {
    try {
      const post = await prisma.post.findFirst({
        where: {
          id: post_id,
        },
        include: {
          user: {
            select: {
              id: true,
              display_name: true,
            },
          },
          Service1A: true,
          Service1B: true,
          Service1C: true,
          Service2: true,
          Service3: true,
          Service4ChickenFarm: true,
          Service4Manufacture: true,
          Service4Construction: true,
        },
      });

      return { success: true, post: post, message: 'success' };
    } catch (error: any) {
      console.log(error);
      return { success: false, post: null, message: error?.message };
    }
  }

  static async updatePostStatusByUser(postId: string, status: PostStatus): Promise<ResponseWithData> {
    try {
      const post = await prisma.post.update({
        where: { id: postId },
        data: {
          status: status,
        },
        include: {
          user: {
            select: {
              id: true,
              display_name: true,
            },
          },
          Service1A: true,
          Service1B: true,
          Service1C: true,
          Service2: true,
          Service3: true,
          Service4ChickenFarm: true,
          Service4Manufacture: true,
          Service4Construction: true,
        },
      });

      return {
        status: 'success',
        message: 'Post status updated',
        data: post,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'fail',
        message: 'Unable to update Post',
        data: null,
      };
    }
  }

  async getPostsByDescription(searchText: string) {
    try {
      const posts = await prisma.post.findMany({
        where: {
          description: {
            contains: searchText,
          },
          status: {
            not: {
              // equals: 'pending',
            },
          },
        },
        include: {
          user: {
            select: { id: true, display_name: true },
          },
        },
      });
      return {
        success: true,
        posts: posts,
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return { success: false, posts: [] };
    }
  }

  async geAlltPosts(round: number) {
    const skip = ((round - 1) * parseInt(config.number_of_result || '5')) as number;
    const postCount = await prisma.post.count();
    try {
      const posts = await prisma.post.findMany({
        where: {
          status: {
            not: {
              // equals: 'pending',
            },
          },
        },
        include: {
          user: {
            select: { id: true, display_name: true },
          },
          Service1A: true,
          Service1B: true,
          Service1C: true,
          Service2: true,
          Service3: true,
          Service4ChickenFarm: true,
          Service4Manufacture: true,
          Service4Construction: true,
        },
        skip,
        take: parseInt(config.number_of_result || '5'),
      });
      return {
        success: true,
        posts: posts,
        nextRound: posts.length == postCount ? round : round + 1,
        total: postCount,
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return { success: true, posts: [], nextRound: round, total: 0 };
    }
  }

  async geAlltPostsByDescription(searchText: string, round: number) {
    const postPerRound = parseInt(config.number_of_result || '5');
    const skip = (round - 1) * postPerRound;

    try {
      const postCount = await prisma.post.count({
        where: {
          description: {
            contains: searchText,
          },
        },
      });
      const posts = await prisma.post.findMany({
        skip: skip,
        take: postPerRound,
        where: {
          description: {
            contains: searchText,
          },
          status: {
            not: {
              // equals: 'pending',
            },
          },
        },
        include: {
          user: {
            select: { id: true, display_name: true },
          },
          Service1A: true,
          Service1B: true,
          Service1C: true,
          Service2: true,
          Service3: true,
          Service4ChickenFarm: true,
          Service4Manufacture: true,
          Service4Construction: true,
        },
      });
      return {
        success: true,
        posts: posts,
        nextRound: posts.length == postCount ? round : round + 1,
        total: postCount,
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return { success: true, posts: [], nextRound: round, total: 0 };
    }
  }
  async getPostById(postId: string) {
    try {
      const post = await prisma.post.findFirst({
        where: { id: postId },
        include: {
          user: {
            select: {
              id: true,
              display_name: true,
              followers: true,
              followings: true,
              blocked_users: true,
            },
          },
          Service1A: true,
          Service1B: true,
          Service1C: true,
          Service2: true,
          Service3: true,
          Service4ChickenFarm: true,
          Service4Manufacture: true,
          Service4Construction: true,
        },
      });
      return {
        success: true,
        post,
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return { success: true, post: null };
    }
  }

  async getFollowersChatId(postId: string) {
    try {
      const post = await prisma.post.findFirst({
        where: { id: postId },
        include: {
          user: {
            select: {
              id: true,
              display_name: true,
              followers: true,
              followings: true,
            },
          },
          Service1A: true,
          Service1B: true,
          Service1C: true,
          Service2: true,
          Service3: true,
          Service4ChickenFarm: true,
          Service4Manufacture: true,
          Service4Construction: true,
        },
      });
      return {
        success: true,
        post,
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return { success: true, post: null };
    }
  }

  async getChatIds(recipientsIds: string[]) {
    try {
      const chatIds = await prisma.user.findMany({
        where: {
          id: { in: recipientsIds },
        },
        select: {
          chat_id: true,
        },
      });
      return {
        success: true,
        chatIds,
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return { success: true, chatIds: [] };
    }
  }
  async getFilteredRecipients(recipientsIds: string[], posterId: string) {
    try {
      const recipientChatIds = await prisma.user.findMany({
        where: {
          id: {
            in: recipientsIds,
          },
        },
        select: {
          chat_id: true,
        },
      });

      return { status: 'success', recipientChatIds: recipientChatIds };
    } catch (error) {
      console.error('Error checking if user is following:', error);
      return { status: 'fail', recipientChatIds: [] };
    }
  }

  async getAllPostsByDescription(description: string) {
    try {
      const posts = await prisma.post.findMany({
        where: {
          description: {
            contains: description,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              display_name: true,
            },
          },
          Service1A: true,
          Service1B: true,
          Service1C: true,
          Service2: true,
          Service3: true,
          Service4ChickenFarm: true,
          Service4Manufacture: true,
          Service4Construction: true,
        },
      });
      return {
        success: true,
        posts,
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return { success: true, posts: [] };
    }
  }

  async getAllPostsWithQuery(query: any, page: number = 1) {
    // only one post per page
    const pageSize = 1;
    const { category, status, timeframe } = query;
    console.log(query.fields);

    let formattedTimeframe: any;

    let lastDigit;
    let lastDigitStartsFrom;
    let lastDigitUpTo;

    const cityName = query?.fields?.city?.cityName;
    const arBrValue = query?.fields?.ar_br;

    console.log(`LAST DIGIT ; ${query?.fields?.last_digit}`);

    if (String(query?.fields?.last_digit)?.startsWith('bi') || String(query?.fields?.last_digit)?.startsWith('di')) {
      lastDigit = query?.fields?.last_digit;
      lastDigitStartsFrom = Number(query?.fields?.last_digit?.split('-')[1]);
      lastDigitUpTo = Number(query?.fields?.last_digit?.split('-')[2]);
      console.log(`last digit ${typeof lastDigit} ${typeof lastDigitStartsFrom} ${typeof lastDigitUpTo}`);
    } else lastDigit = 'all';

    console.log('dddddddddddd');

    switch (timeframe) {
      case 'today': {
        formattedTimeframe = '1440';
        break;
      }
      case 'week': {
        formattedTimeframe = '10080';
        break;
      }

      case 'month': {
        formattedTimeframe = '43200';
        break;
      }
    }

    // column field query based on the category
    let columnSpecificWhereCondition = {};
    switch (category) {
      case 'Section 1A':
        columnSpecificWhereCondition = {
          Service1A: {
            arbr_value:
              !query?.fields?.ar_br || query?.fields?.ar_br == 'all' ? undefined : { equals: query?.fields?.ar_br },

            last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
          },
        };
        break;
      case 'Section 1B':
        columnSpecificWhereCondition = {
          Service1B: {
            // main_category:
            //   !query?.fields?.main_category || query?.fields?.main_category == 'all'
            //     ? undefined
            //     : { equals: query?.fields?.main_category },
            // sub_category:
            //   !query?.fields?.sub_category || query?.fields?.sub_category == 'all'
            //     ? undefined
            //     : { equals: query?.fields?.sub_category },
            woreda:
              !query?.fields?.woreda || query?.fields?.woreda == 'all' ? undefined : { equals: query?.fields?.woreda },

            last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
          },
        };
        break;

      case 'Section 1C':
        columnSpecificWhereCondition = {
          Service1C: {
            arbr_value:
              !query?.fields?.ar_br || query?.fields?.ar_br == 'all' ? undefined : { equals: query?.fields?.ar_br },
            last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
          },
        };
        break;

      case 'Section 3':
        columnSpecificWhereCondition = {
          Service3: {
            birth_or_marital:
              !query?.fields?.birth_or_marital || query?.fields?.birth_or_marital == 'all'
                ? undefined
                : { equals: query?.fields?.birth_or_marital },
            woreda:
              !query?.fields?.woreda || query?.fields?.woreda == 'all' ? undefined : { equals: query?.fields?.woreda },

            last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
          },
        };
        break;

      default:
        columnSpecificWhereCondition = {};
    }

    try {
      const totalCount = await prisma.post.count({
        where: {
          // filter by status if status is provided and not equals to 'all'
          status: status && status !== 'all' ? { equals: status } : undefined,
          category: category && category !== 'all' ? { equals: category } : undefined,
          created_at:
            timeframe && timeframe !== 'all'
              ? {
                  gte: new Date(new Date().getTime() - parseInt(formattedTimeframe) * 60000),
                }
              : undefined,
          OR: [
            {
              Service1A: {
                // conditionally check if ar_br is provided and not equals to 'all'
                // arbr_value:
                //   query?.fields?.ar_br == 'all' || !query?.fields?.ar_br ? undefined : { equals: query?.fields?.ar_br },

                id_first_option: { equals: query?.fields?.id_first_option },
                last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
                city: cityName == 'all' ? undefined : { equals: cityName },
                arbr_value: arBrValue == 'all' ? undefined : { equals: arBrValue },
              },
            },
            {
              Service1B: {
                id_first_option: { equals: query?.fields?.id_first_option },
                last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
                city: cityName == 'all' ? undefined : { equals: cityName },
              },
            },
            {
              Service1C: {
                // conditionally check if ar_br is provided and not equals to 'all'
                // arbr_value:
                //   query?.fields?.ar_br == 'all' || !query?.fields?.ar_br ? undefined : { equals: query?.fields?.ar_br },
                id_first_option: { equals: query?.fields?.id_first_option },
                last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
                city: cityName == 'all' ? undefined : { equals: cityName },
                arbr_value: arBrValue == 'all' ? undefined : { equals: arBrValue },
              },
            },
          ],
          // ...columnSpecificWhereCondition,
          // Service1A: {
          //   // conditionally check if ar_br is provided and not equals to 'all'
          //   // arbr_value:
          //   //   query?.fields?.ar_br == 'all' || !query?.fields?.ar_br ? undefined : { equals: query?.fields?.ar_br },

          //   last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
          // },

          // OR: [
          // {
          //   Service1A: {
          //     // conditionally check if ar_br is provided and not equals to 'all'
          //     // arbr_value:
          //     //   query?.fields?.ar_br == 'all' || !query?.fields?.ar_br ? undefined : { equals: query?.fields?.ar_br },

          //     last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
          //   },
          // },

          //   {
          //     Service1B: {
          //       last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
          //     },
          //   },
          // ],

          // Service1B: {
          //   last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
          // },

          // Service1C: {
          //   // conditionally check if ar_br is provided and not equals to 'all'
          //   // arbr_value:
          //   //   query?.fields?.ar_br == 'all' || !query?.fields?.ar_br ? undefined : { equals: query?.fields?.ar_br },
          //   last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
          // },
        },
      });

      const totalPages = Math.ceil(totalCount / pageSize);
      const skip = (page - 1) * pageSize;

      const posts = await prisma.post.findMany({
        where: {
          // filter by status if status is provided and not equals to 'all'
          status: status && status !== 'all' ? { equals: status } : undefined,
          category: category && category !== 'all' ? { equals: category } : undefined,
          created_at:
            timeframe && timeframe !== 'all'
              ? {
                  gte: new Date(new Date().getTime() - parseInt(formattedTimeframe) * 60000),
                }
              : undefined,

          // ...columnSpecificWhereCondition,
          // Service1A: {
          //   // conditionally check if ar_br is provided and not equals to 'all'
          //   // arbr_value:
          //   //   query?.fields?.ar_br == 'all' || !query?.fields?.ar_br ? undefined : { equals: query?.fields?.ar_br },

          //   last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
          // },

          OR: [
            {
              Service1A: {
                // conditionally check if ar_br is provided and not equals to 'all'
                // arbr_value:
                //   query?.fields?.ar_br == 'all' || !query?.fields?.ar_br ? undefined : { equals: query?.fields?.ar_br },

                id_first_option: { equals: query?.fields?.id_first_option },
                last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
                city: cityName == 'all' ? undefined : { equals: cityName },
                arbr_value: arBrValue == 'all' ? undefined : { equals: arBrValue },
              },
            },
            {
              Service1B: {
                id_first_option: { equals: query?.fields?.id_first_option },
                last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
                city: cityName == 'all' ? undefined : { equals: cityName },
              },
            },
            {
              Service1C: {
                // conditionally check if ar_br is provided and not equals to 'all'
                // arbr_value:
                //   query?.fields?.ar_br == 'all' || !query?.fields?.ar_br ? undefined : { equals: query?.fields?.ar_br },
                id_first_option: { equals: query?.fields?.id_first_option },
                last_digit: lastDigit == 'all' ? undefined : { gte: lastDigitStartsFrom, lte: lastDigitUpTo },
                city: cityName == 'all' ? undefined : { equals: cityName },
                arbr_value: arBrValue == 'all' ? undefined : { equals: arBrValue },
              },
            },
          ],

          // Service3: {
          //   birth_or_marital: {
          //     equals: 'all',
          //   },
          // },

          // Service1A: {
          // arbr_value:
          //   query?.fields?.ar_br || query?.fields?.ar_br != 'all' ? { equals: query?.fields?.ar_br } : undefined,
          // },

          // Service1B: {
          //   main_category:
          //     query?.fields?.main_category || query?.fields?.main_category != 'all'
          //       ? { equals: query?.fields?.main_category }
          //       : undefined,
          //   sub_category:
          //     query?.fields?.sub_category || query?.fields?.sub_category != 'all'
          //       ? { equals: query?.fields?.sub_category }
          //       : undefined,
          // },
          // Service3: {
          //   birth_or_marital:
          //     query?.fields?.birth_or_marital || query?.fields?.birth_or_marital != 'all'
          //       ? { equals: query?.fields?.birth_or_marital }
          //       : undefined,
          // },
        },
        include: {
          user: {
            select: {
              id: true,
              display_name: true,
            },
          },

          Service1A: true,
          Service1B: true,
          Service1C: true,
          Service2: true,
          Service3: true,
          Service4ChickenFarm: true,
          Service4Manufacture: true,
          Service4Construction: true,
        },
        skip,
        take: 1,
      });

      return {
        success: true,
        posts,
        total: totalCount,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return { success: true, posts: [] };
    }
  }
}

export default PostService;
