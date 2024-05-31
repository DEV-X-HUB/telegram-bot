import prisma from '../../loaders/db-connecion';
import { v4 as UID } from 'uuid';

class ChatService {
  constructor() {}

  async fetchReceivedMessage(user_id: string) {
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
  async fetchSendMessage(user_id: string) {
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
  async createMessage(user_id: string, receiver_id: string, message: string, type?: string) {
    try {
      const newUser = await prisma.message.create({
        data: { id: UID(), content: message, sender_id: user_id, receiver_id, type: type || 'message' },
      });
      return { success: true, data: newUser, message: 'user created' };
    } catch (error: any) {
      console.log(error);
      return { success: false, data: null, message: error?.message };
    }
  }
}

export default ChatService;
