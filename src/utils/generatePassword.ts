import { count } from 'console';

export default function generateOTP(digits: number = 5) {
  // Generate a random otp of specified length
  const otp = Math.random().toString().slice(-digits);
  return otp;
}
