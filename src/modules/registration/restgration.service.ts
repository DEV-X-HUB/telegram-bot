import User from '../../models/user';
import CreateUserDto from '../../types/dto/create-user.dto';

class RegistrationService {
  constructor() {}

  async isUserRegisteredWithPhone(phoneNumber: string): Promise<boolean> {
    try {
      const user = await User.findOne({ phone_number: phoneNumber });
      if (user) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async isUserRegisteredWithTGId(tgId: string): Promise<boolean> {
    try {
      const user = await User.findOne({ tg_id: tgId });
      if (user) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async registerUser(state: any, tg_id: string) {
    try {
      const doesUserExist = await this.isUserRegisteredWithPhone(state.phone_number);
      if (doesUserExist) return { success: false, message: 'user exits', data: null };
      const createUserDto: CreateUserDto = {
        tg_id: tg_id,
        first_name: state.first_name,
        last_name: state.last_name,
        phone_number: state.phone_number,
        email: state.email,
        country: state.CreateUserDto,
        city: state.city,
        gender: state.gender,
        age: parseInt(state.age),
      };

      return this.createUser(createUserDto);
    } catch (error) {}
    return { success: false, message: 'unkown error', data: null };
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const newUser = new User({
        ...createUserDto,
      });
      console.log(newUser);
      return { success: true, data: await newUser.save(), message: 'user created' };
    } catch (error: any) {
      return { success: false, data: null, message: error?.message };
    }
  }
}

export default RegistrationService;
