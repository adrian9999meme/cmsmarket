/**
 * Auth domain API endpoints
 * Login, register, OTP, password reset
 */

const base = () => import.meta.env.VITE_API_VERSION || '';

export const authEndpoints = {
  login: () => base() + 'auth/login',
  register: () => base() + 'auth/register',
  registerByPhone: () => base() + 'auth/register-by-phone',
  verifyRegistrationOtp: () => base() + 'auth/verify-registration-otp',
  getLoginOtp: () => base() + 'auth/get-login-otp',
  verifyLoginOtp: () => base() + 'auth/verify-login-otp',
  socialLogin: () => base() + 'auth/social-login',
  forgotPassword: () => base() + 'auth/get-verification-link',
  verifyOtp: () => base() + 'auth/verify-otp',
  createPassword: () => base() + 'auth/create-password',
};
