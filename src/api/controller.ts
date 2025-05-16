import { Request, Response } from 'express';
import { Telegraf } from 'telegraf';
import config from '../config/config';
import Bot from '../loaders/bot';
import PostController from '../modules/post/post.controller';
import { PageQuery, PostQuery, UserPostQuery, UserQuery } from '../types/api';
import sendEmail from '../utils/helpers/sendEmail';
import { formatAccountCreationEmailMsg, formatResetOptEmailMsg } from '../utils/helpers/string';
import ApiService from './service';
import { CreateNotificationDto } from '../types/dto/notification.dto';

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

export const getPhotoUrls = async (req: Request, res: Response) => {
  try {
    const bot = new Telegraf(config.bot_token as string);

    const fileIds = Object.entries(req.query);

    const fileLinks = [];

    for (const [key, fileId] of fileIds) {
      try {
        const fileLink = await (bot as any).telegram?.getFileLink(fileId);
        fileLinks.push({ fileId, url: fileLink.href, success: true, key });
      } catch (error) {
        console.log(error);
        fileLinks.push({ fileId, success: false, message: 'Error fetching image' });
      }
    }

    res.json({ success: true, files: fileLinks });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  const { status: postStatus, category, page, itemsPerPage } = req.query;
  const { status, data, message } = await ApiService.getPosts({
    status: postStatus,
    category,
    page: page || 1,
    itemsPerPage: itemsPerPage || 10,
  } as PostQuery);
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

export const getUsers = async (req: Request, res: Response) => {
  const { status: userStatus, page, itemsPerPage } = req.query;
  try {
    const { status, data, message } = await ApiService.getUsers({
      status: userStatus,
      page: page || 1,
      itemsPerPage: itemsPerPage || 10,
    } as UserQuery);
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

export const getAdmins = async (req: Request, res: Response) => {
  const { status: userStatus, page, itemsPerPage } = req.query;
  try {
    const { status, data, message } = await ApiService.getAdmins({
      status: userStatus,
      page: page || 1,
      itemsPerPage: itemsPerPage || 10,
    } as UserQuery);
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
export const getUserDetail = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const { status, data, message } = await ApiService.getUser(id);
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

export const getUserPosts = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { status: postStatus, category, page, itemsPerPage } = req.query;

  try {
    const { status, data, message } = await ApiService.getUserPosts({
      status: postStatus,
      category,
      page: page || 1,
      itemsPerPage: itemsPerPage || 10,
      userId,
    } as UserPostQuery);
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
    await PostController.postToChannel(bot, config.channel_id, data);
  }
  await PostController.notifiyUser(bot, data, postStatus);

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
    console.log(req.body);
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
export async function createNotification(req: Request, res: Response) {
  const { title, message, image, users, send_to_all } = req.body as CreateNotificationDto;
  try {
    const {
      status,
      message: responseMessage,
      data,
    } = await ApiService.createNotification({
      title,
      message,
      image,
      users,
      send_to_all,
    });

    if (status === 'fail') {
      return res.status(400).json({
        status,
        message: responseMessage,
      });
    }

    return res.status(200).json({
      data,
      status,
      message: responseMessage,
    });
  } catch (error: any) {
    return res.status(400).json({
      data: null,
      status: 'fail',
      message: error.message,
    });
  }
}

export async function resendNotification(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const { status, message } = await ApiService.reSendNotification(id);

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

export async function getNotifications(req: Request, res: Response) {
  try {
    const { page, itemsPerPage } = req.query;
    const { status, data, message } = await ApiService.getNotifications({
      page: page || 1,
      itemsPerPage: itemsPerPage || 10,
    } as PageQuery);

    if (status === 'fail') {
      return res.status(400).json({
        data,
        status,
        message,
      });
    }

    return res.status(200).json({
      data,
      status,
      message,
    });
  } catch (error: any) {
    return res.status(400).json({
      data: [],
      status: 'fail',
      message: error.message,
    });
  }
}
