import { PostStatus } from '@prisma/client';
import config from '../config/config';
import prisma from '../loaders/db-connecion';
import { BareResponse, ResponseWithData } from '../types/api';
import {
  CreateAdminDto,
  DeleteAdminDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInDto,
  UpdateAdminStatusDto,
  UpdateUserStatusDto,
  VerifyResetOtpDto,
} from '../types/dto/auth.dto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import generateOTP from '../utils/generatePassword';

class ApiService {
  static async getPosts(round: number = 1): Promise<ResponseWithData> {
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
  static async getPostsByStatus(round: number = 1, status: PostStatus): Promise<ResponseWithData> {
    const resultsPerPage = parseInt(config.number_of_result || '5');
    const skip = (round - 1) * resultsPerPage;
    const postCount = await prisma.post.count({
      where: {
        status: status as PostStatus,
      },
    });

    try {
      const posts = await prisma.post.findMany({
        where: {
          status: status as PostStatus,
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
        take: resultsPerPage,
      });

      return {
        status: 'success',
        message: 'Posts fetched successfully',
        data: {
          posts,
          nextRound: posts.length === postCount ? round : round + 1,
          total: postCount,
        },
      };
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      return {
        status: 'fail',
        message: error?.message,
        data: null,
      };
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
            include: {
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
    console.log(createAdminDto);

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

      return {
        status: 'success',
        message: 'Admin created Successfully',
        data: { first_name, last_name, email, role, id: admin.id },
      };
    } catch (error) {
      return {
        data: null,
        status: 'fail',
        message: (error as Error).message,
      };
    }
  }
  static async crateDefaultAdmin(): Promise<ResponseWithData> {
    const admin = await prisma.admin.findMany({});
    if (!admin || admin.length == 0) {
      return await this.createAdmin({
        first_name: config.super_admin_firstname as string,
        last_name: config.super_admin_firstname as string,
        email: config.super_admin_email as string,
        password: config.super_admin_password as string,
        role: 'SUPER_ADMIN',
      });
    } else
      return {
        status: 'fail',
        message: '---admin exists---',
        data: null,
      };
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
      if (admin.status == 'INACTIVE') {
        return {
          status: 'fail',
          message: 'Your are currently Deactivated',
          data: null,
        };
      }

      // create a token
      const token = await jwt.sign({ id: admin.id, role: admin?.role }, config.jwt.secret as string, {
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

  static async createOTP(forgotPasswordDto: ForgotPasswordDto): Promise<ResponseWithData> {
    const email = config.super_admin_email;

    if (!email) {
      return {
        status: 'fail',
        message: 'Please provide all required fields',
        data: null,
      };
    }

    try {
      const admin = await prisma.admin.findUnique({
        where: {
          email,
        },
      });

      if (!admin) {
        return {
          status: 'fail',
          message: 'Admin not found',
          data: null,
        };
      }

      const otp = generateOTP();
      const hashedOTP = await bcrypt.hash(otp, 10);

      await prisma.otp.upsert({
        where: {
          admin_id: admin.id,
        },
        update: {
          otp: hashedOTP,
          otp_expires: new Date(Date.now() + 600000), // 10 minutes
        },
        create: {
          admin_id: admin.id,
          otp: hashedOTP,
          otp_expires: new Date(Date.now() + 600000), // 10 minutes
        },
      });

      // send email

      return {
        status: 'success',
        message: 'OTP sent to your email',
        data: otp,
      };
    } catch (error) {
      return {
        status: 'fail',
        message: (error as Error).message as string,
        data: null,
      };
    }
  }

  static async updateAdminStatus(updateAdminStatus: UpdateAdminStatusDto): Promise<BareResponse> {
    try {
      const { adminId, status } = updateAdminStatus;

      const admin = await prisma.admin.findFirst({
        where: {
          id: adminId,
          role: 'ADMIN',
        },
      });

      if (!admin) {
        return {
          status: 'fail',
          message: 'Admin not foundl',
        };
      }

      await prisma.admin.update({
        where: {
          id: adminId,
        },
        data: {
          status: status,
        },
      });

      return {
        status: 'fail',
        message: `Admin status updated to ${status}`,
      };
    } catch (error: any) {
      console.log(error);
      return {
        status: 'fail',
        message: error.message,
      };
    }
  }
  static async updateUserStatus(updateAdminStatus: UpdateUserStatusDto): Promise<BareResponse> {
    try {
      const { userId, status, reason } = updateAdminStatus;

      const admin = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!admin) {
        return {
          status: 'fail',
          message: 'user  not found',
        };
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          status,
          inactive_reason: reason || '',
        },
      });

      return {
        status: 'fail',
        message: `User  status updated to ${status}`,
      };
    } catch (error: any) {
      console.log(error);
      return {
        status: 'fail',
        message: error.message,
      };
    }
  }

  static async deleteAdminById(deleteAdminDto: DeleteAdminDto): Promise<BareResponse> {
    try {
      const { adminId } = deleteAdminDto;

      const admin = await prisma.admin.findFirst({
        where: {
          id: adminId,
          role: 'ADMIN',
        },
      });

      if (!admin) {
        return {
          status: 'fail',
          message: 'Admin not found',
        };
      }

      await prisma.admin.delete({
        where: {
          id: adminId,
        },
      });

      return {
        status: 'success',
        message: 'Admin successfully deleted',
      };
    } catch (error: any) {
      console.log(error);
      return {
        status: 'fail',
        message: error.message,
      };
    }
  }

  static async verifyResetOtp({ email, otp }: VerifyResetOtpDto): Promise<BareResponse> {
    try {
      const otpInfo = await prisma.otp.findFirst({
        where: {
          admin: {
            email,
          },
        },
      });

      if (!otpInfo) {
        return {
          status: 'fail',
          message: 'OTP not found',
        };
      }

      if (new Date() > otpInfo.otp_expires) {
        return {
          status: 'fail',
          message: 'OTP has expired. Please request a new one',
        };
      }

      const isOtpValid = await bcrypt.compare(otp, otpInfo.otp);
      if (!isOtpValid) {
        return {
          status: 'fail',
          message: 'Invalid OTP',
        };
      }

      await prisma.otp.update({
        where: {
          id: otpInfo.id,
        },
        data: {
          isVerified: true,
        },
      });

      return {
        status: 'success',
        message: 'OTP verified',
      };
    } catch (error: any) {
      return {
        status: 'fail',
        message: error.message,
      };
    }
  }

  static async resetPassword({ email, password, confirmPassword }: ResetPasswordDto): Promise<BareResponse> {
    if (password !== confirmPassword) {
      return {
        status: 'fail',
        message: 'Passwords do not match',
      };
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await prisma.admin.findUnique({
        where: { email },
      });

      if (!admin) {
        return {
          status: 'fail',
          message: 'Admin not found',
        };
      }

      await prisma.admin.update({
        where: { email },
        data: { password: hashedPassword },
      });

      // Delete the OTP
      await prisma.otp.deleteMany({
        where: { admin_id: admin.id },
      });

      return {
        status: 'success',
        message: 'Password reset successful. Please login',
      };
    } catch (error: any) {
      return {
        status: 'fail',
        message: error.message,
      };
    }
  }
}

export default ApiService;
