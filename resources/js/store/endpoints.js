/**
 * API endpoints - backward-compatible re-exports
 * New code can use: import { marketplaceEndpoints } from '@/services/api';
 * See resources/js/services/api/ for domain-based structure.
 */

import {
  authEndpoints,
  consumerEndpoints,
  consumerCmsEndpoints,
  marketplaceEndpoints,
  logisticsEndpoints,
  platformEndpoints,
} from '../services/api';

const API_VERSION = import.meta.env.VITE_API_VERSION;

// Auth
export const LOGIN_API = API_VERSION + 'auth/login';
export const REGISTER_API = API_VERSION + 'auth/register';
export const GET_CURRENT_USER_API = API_VERSION + 'profile';
export const GET_CONFIG_API = API_VERSION + 'configs';

// Marketplace - sellers
export const GET_SELLERS_API = API_VERSION + 'sellers/fetch';
export const HOME_STORE_CATEGORIES_API = API_VERSION + 'home/store-categories';
export const ADD_NEW_SELLER_API = API_VERSION + 'sellers/create';
export const EDIT_SELLER_API = API_VERSION + 'sellers/edit/';
export const SET_ACTIVE_SELLER_API = API_VERSION + 'sellers/setactive/';
export const DELETE_SELLER_API = API_VERSION + 'sellers/delete/';

// Marketplace - stores
export const GET_STORES_API = API_VERSION + 'stores/fetch';
export const ADD_NEW_STORE_API = API_VERSION + 'stores/create';
export const EDIT_STORE_API = API_VERSION + 'stores/edit/';
export const SET_STORE_ACTIVE_API = API_VERSION + 'stores/setactive/';
export const DELETE_STORE_API = API_VERSION + 'stores/delete/';

// Consumer CMS - customers
export const GET_CUSTOMERS_API = API_VERSION + 'customers/fetch';
export const ADD_NEW_CUSTOMER_API = API_VERSION + 'customers/create';
export const EDIT_CUSTOMER_API = API_VERSION + 'customers/edit/';
export const DELETE_CUSTOMER_API = API_VERSION + 'customers/delete/';
export const SET_ACTIVE_CUSTOMER_API = API_VERSION + 'customers/setactive/';
export const SET_TRADE_APPROVED_API = API_VERSION + 'customers/trade-approve/';
export const SET_TRADE_REJECTED_API = API_VERSION + 'customers/trade-reject/';

// Logistics - orders
export const GET_ORDERS_API = API_VERSION + 'orders/fetch';

// Marketplace - products
export const GET_PRODUCTS_API = API_VERSION + 'products/fetch';
export const GET_PRODUCT_API = API_VERSION + 'products/';
export const GET_PRODUCT_CATEGORIES_API = API_VERSION + 'products/categories/list';
export const ADD_PRODUCT_API = API_VERSION + 'products/create';
export const EDIT_PRODUCT_API = API_VERSION + 'products/edit/';
export const DELETE_PRODUCT_API = API_VERSION + 'products/delete/';

// Logistics - drivers
export const GET_DRIVERS_API = API_VERSION + 'drivers/fetch';
export const ADD_NEW_DRIVER_API = API_VERSION + 'drivers/add';
export const EDIT_DRIVER_API = API_VERSION + 'drivers/edit/';
export const DELETE_DRIVER_API = API_VERSION + 'drivers/delete/';

// Domain exports for new code
export {
  authEndpoints,
  consumerEndpoints,
  consumerCmsEndpoints,
  marketplaceEndpoints,
  logisticsEndpoints,
  platformEndpoints,
};
