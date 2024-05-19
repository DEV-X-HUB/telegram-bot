import { RequestHandler, Request, Response } from 'express';
import prisma from '../loaders/db-connecion';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import ApiService from './service';
import Bot from '../loaders/bot';
import PostController from '../modules/post/post.controller';
import generateOTP from '../utils/generatePassword';
import sendEmail from '../utils/sendEmail';

// express function to handle the request
export const getPosts = async (req: Request, res: Response) => {
  const round = req.params.round;
  const { status, data, message } = await ApiService.getPosts(parseInt(round));
  if (status == 'fail') {
    res.status(500).json({
      status,
      message,
    });
  }
  return res.status(200).json({
    status,
    data: data,
  });
};

export const getPostById = async (req: Request, res: Response) => {
  const post_id = req.params.id;
  try {
    const { status, data, message } = await ApiService.getPostById(post_id);
    if (status == 'fail') {
      res.status(500).json({
        status,
        message,
        data: null,
      });
    }
    return res.status(200).json({
      status,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
      data: null,
    });
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  const user_id = req.params.id;
  const round = req.params.round;
  try {
    const { status, data, message } = await ApiService.getUserPosts(user_id, parseInt(round));
    if (status == 'fail') {
      res.status(500).json({
        status,
        message,
        data: null,
      });
    }
    return res.status(200).json({
      status,
      message,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
      data: null,
    });
  }
};

export const updatePostStatus = async (req: Request, res: Response) => {
  const bot = Bot();
  const { postId, postStatus } = req.body;
  const { data, status, message } = await ApiService.updatePostStatus(postId, postStatus);
  if (status == 'fail')
    res.status(500).json({
      status: 'fail',
      message,
    });

  if (!data) {
    return res.status(404).json({
      status: 'fail',
      message: 'No post found',
    });
  }

  if (postStatus == 'open') {
    const { status, message } = await PostController.sendPostToUser(Bot, data);
    await PostController.postToChannel(bot, config.channel_id, data);
  }
  res.status(200).json({
    status: 'success',
    message: 'Post status updated',
    data: 'post',
  });
};

export const deletePostById = async (req: Request, res: Response) => {
  const post_id = req.params.id;
  try {
    const { status, message } = await ApiService.deletePostById(post_id);
    if (status == 'fail') {
      res.status(500).json({
        status,
        message,
      });
    }
    return res.status(200).json({
      status,
      message,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
    });
  }
};

export const deleteUserPosts = async (req: Request, res: Response) => {
  try {
    const user_id = req.params.id;
    const { status, message } = await ApiService.deletePostById(user_id);
    if (status == 'fail') {
      res.status(500).json({
        status,
        message,
      });
    }
    return res.status(200).json({
      status,
      message,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
    });
  }
};

export async function createAdmin(req: Request, res: Response) {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide all required fields',
    });
  }

  const adminExists = await prisma.admin.findUnique({
    where: {
      email,
    },
  });
  if (adminExists) {
    return res.status(400).json({
      status: 'fail',
      message: 'Admin already exists',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    const admin = await prisma.admin.create({
      data: {
        first_name,
        last_name,
        email,
        role: 'SUPER_ADMIN',
        password: hashedPassword,
      },
    });

    const emailInfo = await sendEmail(
      email,
      'Verify your email',
      `<h1>Thank you for signing up. Use this OTP to verify your email: ${otp}</h1>`,
    );

    return res.status(200).json({
      status: 'success',
      message: 'Thank you for signing up. Please verify your email via the OTP sent to your email',
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
    });
  }
}

export async function loginAdmin(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide all required fields',
    });
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
      return res.status(404).json({
        status: 'fail',
        message: 'Email or password is incorrect',
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email or password is incorrect',
      });
    }

    // create a token
    const token = await jwt.sign({ id: admin.id }, config.jwt.secret as string, {
      expiresIn: config.jwt.expires_in,
    });

    res.status(200).json({
      status: 'success',
      message: 'Admin logged in',
      data: {
        id: admin.id,
        first_name: admin.first_name,
        last_name: admin.last_name,
        email: admin.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
    });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide all required fields',
    });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return res.status(404).json({
        status: 'fail',
        message: 'Admin not found',
      });
    }

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    // store the otp and otp_expires in the database.
    // update if the otp exists or create a new one if it doesn't
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
    await sendEmail(email, 'Reset your password', `<h1>Use this OTP to reset your password: ${otp}</h1>`);

    return res.status(201).json({
      status: 'success',
      message: 'OTP sent to your email',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
    });
  }
}

export async function verifyResetOTP(req: Request, res: Response) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide all required fields',
    });
  }

  try {
    const otpInfo = await prisma.otp.findFirst({
      where: {
        admin: {
          email,
        },
      },
    });

    if (!otpInfo) {
      return res.status(404).json({
        status: 'fail',
        message: 'OTP not found',
      });
    }

    if (new Date(Date.now()) > (otpInfo?.otp_expires as any)) {
      return res.status(400).json({
        status: 'fail',
        message: 'OTP has expired. Please request a new one',
      });
    }

    const isOTPValid = await bcrypt.compare(otp, otpInfo.otp as any);
    if (!isOTPValid) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid OTP',
      });
    }

    await prisma.otp.update({
      where: {
        id: otpInfo.id,
      },
      data: {
        isVerified: true,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'OTP verified',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
    });
  }
}

export async function resetPassword(req: Request, res: Response) {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide all required fields',
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      status: 'fail',
      message: 'Passwords do not match',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return res.status(404).json({
        status: 'fail',
        message: 'Admin not found',
      });
    }

    await prisma.admin.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    // delete the otp
    await prisma.otp.delete({
      where: {
        admin_id: admin.id,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Password reset successful. Please login',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
    });
  }
}
