/**
 * Role-based app redirect for micro-frontend
 * Maps user role to the correct app dashboard URL
 * Uses route prefix when APP_ENV=production (e.g. /cms96501/admin)
 */

import { ROLES } from "../common/roles";
import { getBasePath } from "../config/routeConfig";

const APP_BASE = {
  get admin() {
    return getBasePath("/admin");
  },
  get seller() {
    return getBasePath("/seller");
  },
  get driver() {
    return getBasePath("/driver");
  },
  get customer() {
    return getBasePath("");
  },
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
      return `${APP_BASE.customer ? APP_BASE.customer + "/" : "/"}dashboard`;
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
      return `${APP_BASE.customer ? APP_BASE.customer + "/" : "/"}login`;
  }
}
