export interface CreateAdminDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}
export interface SignInDto {
  email: string;
  password: string;
}
export interface ForgotPasswordDto {
  email: string;
}

export type UpdateAdminStatusDto = {
  adminId: string;
  status: 'ACTIVE' | 'INACTIVE';
};
export type UpdateUserStatusDto = {
  userId: string;
  status: 'ACTIVE' | 'INACTIVE';
  reason?: string;
};

export interface DeleteAdminDto {
  adminId: string;
}

export interface VerifyResetOtpDto {
  email: string;
  otp: string;
}

export interface ResetPasswordDto {
  email: string;
  password: string;
  confirmPassword: string;
}
