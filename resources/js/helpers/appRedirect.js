/**
 * Role-based app redirect for micro-frontend
 * Maps user role to the correct app dashboard URL
 */

import { ROLES } from "../common/roles";

const APP_BASE = {
  admin: "/admin",
  seller: "/seller",
  driver: "/driver",
  customer: "/",
};

/**
 * Returns the dashboard URL for a given role (full path for cross-app navigation)
 */
export function getDashboardPathForRole(role) {
  switch (role) {
    case ROLES.ADMIN:
      return `${APP_BASE.admin}/dashboard`;
    case ROLES.SELLER:
    case ROLES.MANAGER:
      return `${APP_BASE.seller}/dashboard`;
    case ROLES.DELIVERY_HERO:
      return `${APP_BASE.driver}`;
    case ROLES.CUSTOMER:
    case ROLES.TRADE_CUSTOMER:
    default:
      return "/dashboard";
  }
}

/**
 * Returns the login URL for a given role (where to redirect after logout)
 */
export function getLoginPathForRole(role) {
  switch (role) {
    case ROLES.ADMIN:
      return `${APP_BASE.admin}/login`;
    case ROLES.SELLER:
    case ROLES.MANAGER:
      return `${APP_BASE.seller}/login`;
    case ROLES.DELIVERY_HERO:
      return `${APP_BASE.driver}/login`;
    default:
      return "/login";
  }
}
