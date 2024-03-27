import CreateUserDto from '../../types/dto/create-user.dto';
import prisma from '../../loaders/db-connecion';
import { v4 as UID } from 'uuid';
class RegistrationService {
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

  async getProfileDataWithTgId(tgId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          tg_id: tgId.toString(),
        },
        include: {
          questions: true,
          followers: true,
          followings: true,
          answers: true,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      return null;
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
        },
      });
      return await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          questions: true,
          followers: true,
          followings: true,
          answers: true,
        },
      });
    } catch (error: any) {
      return null;
      throw new Error(`Error updating profile: ${error.message}`);
    }
  }

  async getFollowersByUserId(userId: string) {
    try {
      const followers = await prisma.follows.findMany({
        where: {
          following_id: userId,
        },
        include: {
          follower: true,
        },
      });

      return followers.map((entry) => entry.follower);
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
          follower: true,
        },
      });

      return followings.map((entry) => entry.follower);
    } catch (error: any) {
      throw new Error(`Error fetching followers: ${error.message}`);
    }
  }

  async registerUser(state: any, tgId: string) {
    try {
      const doesUserExist = await this.isUserRegisteredWithPhone(state.phone_number);
      if (doesUserExist) return { success: false, message: 'user exists', data: null };

      const createUserDto: CreateUserDto = {
        tg_id: tgId.toString(),
        username: state.username,
        first_name: state.first_name,
        last_name: state.last_name,
        phone_number: state.phone_number,
        email: state.email,
        country: state.country,
        city: state.city,
        gender: state.gender,
        age: parseInt(state.age),
        display_name: null,
      };

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
}

export default RegistrationService;
