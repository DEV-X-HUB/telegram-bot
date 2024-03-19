import User from '../model/user';

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

  async registerUser(phoneNumber: string, userData: any) {
    try {
      const doesUserExist = await this.isUserRegistered(phoneNumber);
      if (doesUserExist) return { success: false, message: 'user exits', data: null };
      return await this.createUser(userData);
    } catch (error) {}
    return { success: false, message: 'unkown error', data: null };
  }

  async createUser(userData: any) {
    try {
      const newUser = new User({
        ...userData,
      });
      return { success: true, data: await newUser.save(), message: 'user created' };
    } catch (error: any) {
      return { success: false, data: null, message: error?.message };
    }
  }
}

export default RegistrationService;
