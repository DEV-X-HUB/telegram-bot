import { PostStatus } from '@prisma/client';
import config from '../config/config';
import prisma from '../loaders/db-connecion';
import { BareResponse, ResponseWithData } from '../types/api';
import { CreateAdminDto, SignInDto } from '../types/dto/auth.dto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail';

class ApiService {
  static async getPosts(round: number): Promise<ResponseWithData> {
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
        status: 'success',
        message: 'post fetched successfully',
        data: { posts: posts, nextRound: posts.length == postCount ? round : round + 1, total: postCount },
      };
    } catch (error: any) {
      console.error('Error searching questions:', error);
      return { status: 'fail', message: error?.message, data: null };
    }
  }
  static async getUserPosts(userId: string, round: number): Promise<ResponseWithData> {
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
        status: 'success',
        message: 'post fetched successfully',
        data: { posts: posts, nextRound: posts.length == postCount ? round : round + 1, total: postCount },
      };
    } catch (error: any) {
      console.error('Error searching questions:', error);
      return { status: 'fail', message: error?.message, data: null };
    }
  }

  static async getPostById(postId: string): Promise<ResponseWithData> {
    try {
      const post = await prisma.post.findFirst({
        where: { id: postId },
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
        data: post,
        message: 'success',
      };
    } catch (error: any) {
      console.error('Error searching questions:', error);
      return { status: 'fail', message: error?.message, data: null };
    }
  }
  static async updatePostStatus(postId: string, status: PostStatus): Promise<ResponseWithData> {
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
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        status: status,
      },
      select: {},
    });
  }
  static async deletePostById(postId: string): Promise<BareResponse> {
    try {
      await prisma.post.delete({ where: { id: postId } });
      return { status: 'success', message: 'post deleted successfully' };
    } catch (error: any) {
      console.log(error);
      return { status: 'fail', message: error?.message };
    }
  }
  static async deleteUserPosts(userId: string): Promise<BareResponse> {
    try {
      await prisma.post.deleteMany({ where: { user_id: userId } });
      return { status: 'success', message: 'post deleted successfully' };
    } catch (error: any) {
      console.log(error);
      return { status: 'fail', message: error?.message };
    }
  }
  static async createAdmin(createAdminDto: CreateAdminDto): Promise<ResponseWithData> {
    const { first_name, last_name, email, password, role } = createAdminDto;

    if (!first_name || !last_name || !email || !password) {
      return {
        data: null,
        status: 'fail',
        message: 'Please provide all required fields',
      };
    }

    const adminExists = await prisma.admin.findUnique({
      where: {
        email,
      },
    });
    if (adminExists) {
      return {
        data: null,
        status: 'fail',
        message: 'Admin already exists',
      };
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await prisma.admin.create({
        data: {
          first_name,
          last_name,
          email,
          role,
          password: hashedPassword,
        },
      });

      await sendEmail(
        email,
        'Account Created',
        `<h1> Your admin account have been created successfuly .usee this password to sign in: ${password}</h1>`,
      );

      return {
        status: 'success',
        message: 'Admin created Successfully',
        data: { first_name, last_name, email, role },
      };
    } catch (error) {
      return {
        data: null,
        status: 'fail',
        message: (error as Error).message,
      };
    }
  }
  static async crateDefaulAdmin() {
    const admin = await prisma.admin.findMany({});
    if (!admin || admin.length == 0) {
      await this.createAdmin({
        first_name: config.super_admin_firstname as string,
        last_name: config.super_admin_firstname as string,
        email: config.super_admin_firstname as string,
        password: config.super_admin_firstname as string,
        role: 'SUPER_ADMIN',
      });
    }
  }

  static async loginAdmin(signInDto: SignInDto): Promise<ResponseWithData> {
    const { email, password } = signInDto;

    if (!email || !password) {
      return {
        data: null,
        status: 'fail',
        message: 'Please provide all required fields',
      };
    }

    try {
      const admin = await prisma.admin.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,

          password: true, // Add password field to the select statement
        },
      });

      if (!admin) {
        return {
          status: 'fail',
          message: 'Email or password is incorrect',
          data: null,
        };
      }

      const isPasswordCorrect = await bcrypt.compare(password, admin.password);

      if (!isPasswordCorrect) {
        return {
          status: 'fail',
          message: 'Email or password is incorrect',
          data: null,
        };
      }

      // create a token
      const token = await jwt.sign({ id: admin.id }, config.jwt.secret as string, {
        expiresIn: config.jwt.expires_in,
      });

      return {
        status: 'success',
        message: 'Admin logged in',
        data: {
          user: { id: admin.id, first_name: admin.first_name, last_name: admin.last_name, email: admin.email },
          token,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'fail',
        message: (error as Error).message,
        data: null,
      };
    }
  }
}

export default ApiService;
