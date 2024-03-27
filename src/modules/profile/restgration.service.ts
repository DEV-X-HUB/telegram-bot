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

  async isUserRegisteredWithTGId(tgId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          tg_id: tgId.toString(),
        },
      });
      return Boolean(user);
    } catch (error) {
      console.error(error);
      return false;
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
