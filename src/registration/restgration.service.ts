import User from '../model/user';
import CreateUserDto from '../types/dto/create-user.dto';

class RegistrationService {
  constructor() {}

  async isUserRegistered(phoneNumber: string): Promise<boolean> {
    try {
      const user = await User.findOne({ phone_number: phoneNumber });
      if (user) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async registerUser(createUserDto: CreateUserDto) {
    try {
      const doesUserExist = await this.isUserRegistered(createUserDto.phone_number);
      if (doesUserExist) return { success: false, message: 'user exits', data: null };
      return await this.createUser(createUserDto);
    } catch (error) {}
    return { success: false, message: 'unkown error', data: null };
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const newUser = new User({
        ...createUserDto,
      });
      return { success: true, data: await newUser.save(), message: 'user created' };
    } catch (error: any) {
      return { success: false, data: null, message: error?.message };
    }
  }
}

export default RegistrationService;
