import CreateUserDto from '../../types/dto/create-user.dto';
import prisma from '../../loaders/db-connecion';
import { v4 as UID } from 'uuid';
import { NotifyOption } from '../../types/params';
import PostService from '../post/post.service';
import { PostStatus, ResponseWithData } from '../../types/api';

const postService = new PostService();
class ProfileService {
  constructor() {}

  async isUserRegisteredWithPhone(phoneNumber: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          phone_number: phoneNumber,
        },
      });
      return Boolean(user);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getProfileByTgId(tgId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          tg_id: tgId.toString(),
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async getProfileById(user_id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: user_id.toString(),
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async getProfileDataWithTgId(tgId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          tg_id: tgId.toString(),
        },
        include: {
          posts: true,
          followers: true,
          followings: true,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async getProfileDataWithId(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId.toString(),
        },
        include: {
          posts: true,
          followers: true,
          followings: true,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async updateNotifySettingByTgId(tg_id: string, notify_option: NotifyOption) {
    try {
      await prisma.user.update({
        where: {
          tg_id: tg_id as string,
        },
        data: {
          notify_option,
        },
      });
      return { success: true, message: 'success' };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'unable to update notify setting ' };
    }
  }

  async updateProfile(userId: string, newData: any) {
    try {
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          gender: newData.gender,
          bio: newData.bio,
          display_name: newData.display_name,
          age: newData.age,
          email: newData.email,
          country: newData.country,
          city: newData.city,
        },
      });
      return await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          posts: true,
          followers: true,
          followings: true,
        },
      });
    } catch (error: any) {
      console.log(error);
      return null;
      throw new Error(`Error updating profile: ${error.message}`);
    }
  }
  async updateDiplayNameByTgId(tg_id: string, display_name: string) {
    try {
      await prisma.user.update({
        where: {
          tg_id: tg_id,
        },
        data: {
          display_name: display_name,
        },
      });

      return { status: 'success', message: 'success' };
    } catch (error: any) {
      console.log(`: ${error.message}`);
      return { status: 'success', message: 'Error while updating display name' };
    }
  }

  async getFollowersByUserId(userId: string) {
    try {
      const followers = await prisma.follows.findMany({
        where: {
          following_id: userId,
        },
        include: {
          following: {
            select: {
              display_name: true,
              id: true,
              tg_id: true,
            },
          },
        },
      });

      return followers.map((entry) => entry.following);
    } catch (error: any) {
      throw new Error(`Error fetching followers: ${error.message}`);
    }
  }
  async getFollowingsByUserId(userId: string) {
    try {
      const followings = await prisma.follows.findMany({
        where: {
          follower_id: userId,
        },
        include: {
          follower: {
            select: {
              display_name: true,
              id: true,
              tg_id: true,
            },
          },
        },
      });

      return followings.map((entry) => entry.follower);
    } catch (error: any) {
      throw new Error(`Error fetching followers: ${error.message}`);
    }
  }

  async registerUser(createUserDto: CreateUserDto) {
    try {
      const doesUserExist = await this.isUserRegisteredWithPhone(createUserDto.phone_number);
      if (doesUserExist) return { success: false, message: 'user exists', data: null };

      const createUserResult = await this.createUser(createUserDto);
      return createUserResult;
    } catch (error) {
      console.error(error);
      return { success: false, message: 'unknown error', data: null };
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const newUser = await prisma.user.create({
        data: { id: UID(), ...createUserDto },
      });
      return { success: true, data: newUser, message: 'user created' };
    } catch (error: any) {
      console.log(error);
      return { success: false, data: null, message: error?.message };
    }
  }

  async getUserPosts(user_id: string) {
    return PostService.getUserPosts(user_id);
  }
  async getPostById(post_id: string) {
    return PostService.getPostById(post_id);
  }
  async getUserPostsTgId(tg_id: string) {
    return PostService.getUserPostsByTgId(tg_id);
  }

  async followUser(followerId: string, followingId: string) {
    try {
      await prisma.follows.create({
        data: {
          follower_id: followerId,
          following_id: followingId,
        },
      });
      return { status: 'success', message: `You followed user with ID ${followingId}.` };
    } catch (error) {
      console.error('Error following user:', error);
      return { status: 'fail', message: `unable to make operation` };
    }
  }

  async unfollowUser(followerId: string, followingId: string) {
    try {
      await prisma.follows.deleteMany({
        where: {
          follower_id: followerId,
          following_id: followingId,
        },
      });
      return { status: 'success', message: `You Unfollowed user with ID ${followingId}.` };
    } catch (error) {
      console.error('Error unfollowing user:', error);

      return { status: 'fail', message: `unable to make operation` };
    }
  }

  async isBlockedBy(currentUserId: string, userId: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: currentUserId,
        },
        select: {
          blocked_users: true,
        },
      });
      if (!user) return { status: 'success', isBlocked: false };
      const isBlocked = user?.blocked_users.find((blocked_user) => blocked_user == userId);

      return { status: 'success', isBlocked: isBlocked ? true : false };
    } catch (error) {
      console.error('Error checking if user is following:', error);
      return { status: 'fail', message: `unable to make operation`, isBlocked: false };
    }
  }

  async unblockUser(currentUserId: string, userId: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: currentUserId,
        },
        select: {
          blocked_users: true,
        },
      });

      if (!user) return { status: 'fail', message: `success` };

      const filteredBlocks = user?.blocked_users.filter((blocked_user) => blocked_user != userId);

      await prisma.user.update({
        where: {
          id: currentUserId,
        },
        data: {
          blocked_users: filteredBlocks,
        },
      });
      return { status: 'success', message: `success` };
    } catch (error) {
      console.error('Error checking if user is following:', error);
      return { status: 'fail', message: `unable to make operation` };
    }
  }

  async blockUser(currentUserId: string, userId: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: currentUserId,
        },
        select: {
          blocked_users: true,
        },
      });
      if (!user) return { status: 'fail', message: `success` };
      const filteredBlocks = user?.blocked_users;
      await prisma.user.update({
        where: {
          id: currentUserId,
        },
        data: {
          blocked_users: [...filteredBlocks, userId],
        },
      });
      return { status: 'success', message: `success` };
    } catch (error) {
      console.error('Error checking if user is following:', error);
      return { status: 'fail', message: `unable to make operation` };
    }
  }
  async isFollowing(currentUserId: string, userId: string) {
    try {
      const follow = await prisma.follows.findFirst({
        where: {
          follower_id: currentUserId,
          following_id: userId,
        },
      });
      return { status: 'success', isFollowing: !!follow };
    } catch (error) {
      console.error('Error checking if user is following:', error);
      return { status: 'fail', message: `unable to make operation`, isFollowing: false };
    }
  }
  async isDisplayNameTaken(display_name: string) {
    try {
      const follow = await prisma.user.findFirst({
        where: {
          display_name,
        },
      });
      return { status: 'success', isDisplayNameTaken: !!follow };
    } catch (error) {
      console.error('Error checking if user is following:', error);
      return { status: 'fail', message: `unable to make operation`, isDisplayNameTaken: false };
    }
  }

  static async fetchReceivedMessage(user_id: string) {
    try {
      const messages = await prisma.message.findMany({
        where: {
          receiver_id: user_id,
        },
        include: {
          sender: {
            select: {
              id: true,
              display_name: true,
              chat_id: true,
            },
          },
          receiver: {
            select: {
              id: true,
              display_name: true,
              chat_id: true,
            },
          },
        },
      });

      return { status: 'success', messages };
    } catch (error) {
      console.error('Error checking if user is following:', error);
      return { status: 'fail', message: `unable to make operation`, messages: [] };
    }
  }
  static async fetchSendMessage(user_id: string) {
    try {
      const messages = await prisma.message.findMany({
        where: {
          sender_id: user_id,
        },
        include: {
          sender: {
            select: {
              id: true,
              display_name: true,
              chat_id: true,
            },
          },
          receiver: {
            select: {
              id: true,
              display_name: true,
              chat_id: true,
            },
          },
        },
      });

      return { status: 'success', messages };
    } catch (error) {
      console.error('Error checking if user is following:', error);
      return { status: 'fail', message: `unable to make operation`, messages: [] };
    }
  }
  static async createMessage(user_id: string, receiver_id: string, message: string) {
    try {
      const newUser = await prisma.message.create({
        data: { id: UID(), content: message, sender_id: user_id, receiver_id },
      });
      return { success: true, data: newUser, message: 'user created' };
    } catch (error: any) {
      console.log(error);
      return { success: false, data: null, message: error?.message };
    }
  }

  async updatePostStatusByUser(postId: string, status: PostStatus): Promise<ResponseWithData> {
    return PostService.updatePostStatusByUser(postId, status);
  }
}

export default ProfileService;
