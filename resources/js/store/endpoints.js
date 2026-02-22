const API_VERSION = import.meta.env.VITE_API_VERSION;

export const LOGIN_API = API_VERSION + 'auth/login';
export const REGISTER_API = API_VERSION + 'auth/register';
export const GET_CURRENT_USER_API = API_VERSION + 'profile';