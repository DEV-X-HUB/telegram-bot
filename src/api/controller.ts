import { RequestHandler, Request, Response, NextFunction } from 'express';
import prisma from '../loaders/db-connecion';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config';
<<<<<<< HEAD
import sendEmail from '../utils/sendEmail';
import { check } from 'prettier';
import generateOTP from '../generatePassword';
=======
import ApiService from './service';
import Bot from '../loaders/bot';
import PostController from '../modules/post/post.controller';
>>>>>>> 39d8abc39556e9b63e1a962d7e0edbcd714569bc

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
  const { first_name, last_name, email, phone_number, password } = req.body;

  if (!first_name || !last_name || !email || !phone_number || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide all required fields',
    });
  }

  // check if email or p already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: {
      email,
    },
  });
  if (existingAdmin) {
    return res.status(400).json({
      status: 'fail',
      message: 'Email already exists. Please use different email',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // generate otp
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    console.log(otp);

    const admin = await prisma.admin.create({
      data: {
        first_name,
        last_name,
        email,
        phone_number,
        password: hashedPassword,
        otp: hashedOTP,
        otp_expires: new Date(Date.now() + 600000),
      },
    });

    // send email to the admin with otp for verification
    const emailInfo = await sendEmail(email, 'Verify your email', `<h1>Use this OTP to verify your email: ${otp}</h1>`);

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
        phone_number: true,
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
        phone_number: admin.phone_number,
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
export const resetAdminPassword = async (req: Request, res: Response, next: NextFunction) => {
  checkAdmin: async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide an email',
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

      req.body.admin = admin;
      next();
    } catch (error) {
      res.status(500).json({
        status: 'fail',
        message: (error as Error).message,
      });
    }
  };
};
