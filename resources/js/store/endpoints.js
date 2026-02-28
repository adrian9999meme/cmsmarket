const API_VERSION = import.meta.env.VITE_API_VERSION;

export const LOGIN_API = API_VERSION + 'auth/login';
export const REGISTER_API = API_VERSION + 'auth/register';
export const GET_CURRENT_USER_API = API_VERSION + 'profile';

// sellers
export const GET_SELLERS_API = API_VERSION + 'sellers/fetch';
export const ADD_NEW_SELLER_API = API_VERSION + 'sellers/create';
export const EDIT_SELLER_API = API_VERSION + 'sellers/edit/';
export const DELETE_SELLER_API = API_VERSION + 'sellers/delete/';

// stores
export const GET_STORES_API = API_VERSION + 'stores/fetch';
export const ADD_NEW_STORE_API = API_VERSION + 'stores/create';
export const EDIT_STORE_API = API_VERSION + 'stores/edit/';
export const DELETE_STORE_API = API_VERSION + 'stores/delete/';

// customers
export const GET_CUSTOMERS_API = API_VERSION + 'customers/fetch';
export const ADD_NEW_CUSTOMER_API = API_VERSION + 'customers/create';
export const EDIT_CUSTOMER_API = API_VERSION + 'customers/edit/';
export const DELETE_CUSTOMER_API = API_VERSION + 'customers/delete/';
export const SET_ACTIVE_CUSTOMER_API = API_VERSION + 'customers/setactive/';

