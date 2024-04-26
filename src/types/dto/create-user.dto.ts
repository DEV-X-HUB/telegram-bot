interface CreateUserDto {
  username: string;
  tg_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  city: string;
  age: number;
  gender: string;
  country: string;
  chat_id: string;
  display_name: null;
}

export default CreateUserDto;
