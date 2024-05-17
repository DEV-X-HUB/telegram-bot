import { RequestHandler, Request, Response } from 'express';
import prisma from '../loaders/db-connecion';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config';

// express function to handle the request
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany();
    if (!posts || posts.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No posts found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
    });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  const post_id = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id: post_id },
    });
    if (!post) {
      res.status(404).json({
        status: 'fail',
        message: 'No post found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
    });
  }
};

export const getPostsOfUser = async (req: Request, res: Response) => {
  const { user_id } = req.body;
  try {
    const posts = await prisma.post.findMany({
      where: {
        user_id,
      },
    });
    if (!posts) {
      return res.status(404).json({
        status: 'fail',
        message: 'No posts found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
    });
  }
};

export const updateStatusOfPost = async (req: Request, res: Response) => {
  const post_id = req.params.id;
  try {
    const post = await prisma.post.update({
      where: { id: post_id },
      data: {
        status: req.body.status,
      },
    });

    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'No post found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Post status updated',
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
    });
  }
};

export const deletePostById = async (req: Request, res: Response) => {
  const post_id = req.params.id;
  try {
    const post = await prisma.post.delete({
      where: { id: post_id },
    });

    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'No post found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Post deleted',
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
    });
  }
};

export const deleteAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.deleteMany();

    if (!posts) {
      return res.status(404).json({
        status: 'fail',
        message: 'No posts found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'All posts deleted',
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

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const admin = await prisma.admin.create({
      data: {
        first_name,
        last_name,
        email,
        phone_number,
        password: hashedPassword,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Admin created',
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
