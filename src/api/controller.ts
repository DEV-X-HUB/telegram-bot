import { Request, Response } from 'express';
import config from '../config/config';
import ApiService from './service';
import Bot from '../loaders/bot';
import PostController from '../modules/post/post.controller';
import sendEmail from '../utils/helpers/sendEmail';
import { formatAccountCreationEmailMsg, formatResetOptEmailMsg } from '../utils/helpers/string';
import { PostStatus } from '@prisma/client';
import { PostCategory } from '../types/params';

(async () => {
  const { status, message } = await ApiService.crateDefaultAdmin();

  if (status == 'success') {
    await sendEmail(
      config.super_admin_email as string,
      'Admin Account Created',
      formatAccountCreationEmailMsg(config.super_admin_password as string),
    );
  }
})();

// express function to handle the request
export const getPosts = async (req: Request, res: Response) => {
  const { status, data, message } = await ApiService.getPosts();
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

export const getPostsByStatus = async (req: Request, res: Response) => {
  const { status } = req.params;

  if (!status) {
    return res.status(400).json({
      status: 'fail',
      message: 'Status parameter is required',
    });
  }

  const { status: fetchStatus, data, message } = await ApiService.getPostsByStatus(status as PostStatus);

  if (fetchStatus === 'fail') {
    return res.status(500).json({
      status: fetchStatus,
      message,
    });
  }

  return res.status(200).json({
    status: fetchStatus,
    data,
  });
};

export const getPostsByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;

  if (!category) {
    return res.status(400).json({
      status: 'fail',
      message: 'Status parameter is required',
    });
  }

  const { status: fetchStatus, data, message } = await ApiService.getPostsByCategory(category as PostCategory);

  if (fetchStatus === 'fail') {
    return res.status(500).json({
      status: fetchStatus,
      message,
    });
  }

  return res.status(200).json({
    status: fetchStatus,
    data,
  });
};

export const getPostDetail = async (req: Request, res: Response) => {
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
      return res.status(500).json({
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
  const { postId, status: postStatus } = req.body;
  const { data, status, message } = await ApiService.updatePostStatus(postId, postStatus);
  if (status == 'fail')
    return res.status(500).json({
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
    const { status, message } = await PostController.sendPostToUser(bot, data);
    await PostController.postToChannel(bot, config.channel_id, data);
  }
  return res.status(200).json({
    status: 'success',
    message: 'Post status updated',
    data: 'post',
  });
};

export const deletePost = async (req: Request, res: Response) => {
  const post_id = req.params.id;
  try {
    const { status, message } = await ApiService.deletePostById(post_id);
    if (status == 'fail') {
      return res.status(500).json({
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
      return res.status(500).json({
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
  try {
    const { first_name, last_name, email, password } = req.body;
    const { status, message, data } = await ApiService.createAdmin({
      first_name,
      last_name,
      email,
      password,
      role: 'ADMIN',
    });

    if (status == 'fail') {
      return res.status(400).json({
        status,
        message,
        data: null,
      });
    }

    await sendEmail(email as string, 'Admin Account Created', formatAccountCreationEmailMsg(password as string));

    return res.status(200).json({
      status,
      message,
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
      data: null,
    });
  }
}
export async function updateAdminStatus(req: Request, res: Response) {
  try {
    const { adminId, status: adminStatus } = req.body;
    const { status, message } = await ApiService.updateAdminStatus({
      adminId,
      status: adminStatus,
    });

    if (status == 'fail') {
      return res.status(400).json({
        status,
        message,
        data: null,
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
}
export async function updateUserStatus(req: Request, res: Response) {
  try {
    const { userId, status: userStatus, reason } = req.body;
    const { status, message } = await ApiService.updateUserStatus({
      userId,
      status: userStatus,
      reason,
    });

    if (status == 'fail') {
      return res.status(400).json({
        status,
        message,
        data: null,
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
}

export async function deleteAdmin(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, message } = await ApiService.deleteAdminById({ adminId: id });

    if (status === 'fail') {
      return res.status(400).json({
        status,
        message,
        data: null,
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
}

export async function loginAdmin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { status, message, data } = await ApiService.loginAdmin({ email, password });
    if (status == 'fail') {
      return res.status(400).json({
        status,
        message,
        data: null,
      });
    }

    return res.status(200).json({
      status,
      message,
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: (error as Error).message,
      data: null,
    });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const { status, message, data: otp } = await ApiService.createOTP({ email });
    if (status == 'fail') {
      return res.status(400).json({
        status,
        message,
      });
    }

    await sendEmail(email, 'Reset your password', formatResetOptEmailMsg(otp as string));

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
}

export async function verifyResetOtp(req: Request, res: Response) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide all required fields',
    });
  }

  try {
    const { status, message } = await ApiService.verifyResetOtp({ email, otp });

    if (status === 'fail') {
      return res.status(400).json({
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
}
export async function resetPassword(req: Request, res: Response) {
  const { email, password, confirmPassword } = req.body;

  try {
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide all required fields',
      });
    }

    const { status, message } = await ApiService.resetPassword({ email, password, confirmPassword });

    if (status === 'fail') {
      return res.status(400).json({
        status,
        message,
      });
    }

    return res.status(200).json({
      status,
      message,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
}
