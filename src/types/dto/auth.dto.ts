interface CreateAdminDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}
interface SignInDto {
  email: string;
  password: string;
}
interface ForgotPasswordDto {
  email: string;
}

export { CreateAdminDto, SignInDto, ForgotPasswordDto };
