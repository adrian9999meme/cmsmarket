/**
 * Role-based fetch configuration
 * Defines default query params per role per entity for shared components.
 * Backend applies additional filters based on JWT user.
 */

import { ROLES } from "../common/roles";

/**
 * Default subdomain/params per role for each entity
 * subdomain values: all, live, today, store, pending, active, blocked, trade, trade-pending, available, completed
 */
export const ROLE_FETCH_CONFIG = {
  [ROLES.ADMIN]: {
    orders: { subdomain: "all" },
    sellers: { subdomain: "all" },
    stores: { subdomain: "all" },
    products: { subdomain: "all" },
    customers: { subdomain: "all" },
    drivers: { subdomain: "all" },
    payments: { subdomain: "today" },
  },
  [ROLES.MANAGER]: {
    orders: { subdomain: "today" },
    stores: { subdomain: "my" },
    products: { subdomain: "all" },
    payments: { subdomain: "store" },
  },
  [ROLES.SELLER]: {
    orders: { subdomain: "today" },
    stores: { subdomain: "my" },
    products: { subdomain: "all" },
  },
  [ROLES.DELIVERY_HERO]: {
    orders: { subdomain: "available" },
  },
  [ROLES.CUSTOMER]: {
    orders: { subdomain: "history" },
    products: { subdomain: "" },
  },
  [ROLES.TRADE_CUSTOMER]: {
    orders: { subdomain: "history" },
    products: { subdomain: "" },
  },
};

/**
 * Which entities each role can access
 */
export const ROLE_ENTITY_ACCESS = {
  [ROLES.ADMIN]: ["orders", "sellers", "stores", "products", "customers", "drivers", "payments"],
  [ROLES.MANAGER]: ["orders", "stores", "products", "payments"],
  [ROLES.SELLER]: ["orders", "stores", "products"],
  [ROLES.DELIVERY_HERO]: ["orders"],
  [ROLES.CUSTOMER]: ["orders", "products"],
  [ROLES.TRADE_CUSTOMER]: ["orders", "products"],
};

/**
 * Normalize role from user (API may use user_type or role)
 */
export function normalizeRole(user) {
  const r = user?.role || user?.user_type || "";
  return typeof r === "string" ? r.toLowerCase() : "";
}

/**
 * Build fetch query for entity, merging role defaults with override params
 * Override params (from URL subdomain, filters) take precedence
 */
export function buildRoleQuery(role, entity, overrideParams = {}, user = null) {
  const r = normalizeRole(user) || role;
  const config = ROLE_FETCH_CONFIG[r]?.[entity] || {};
  const base = { ...config };

  if (user?.storeProfile?.id && (r === ROLES.MANAGER || r === ROLES.SELLER)) {
    base.store_id = user.storeProfile.id;
  }
  if (user?.id && r === ROLES.SELLER) {
    base.seller_id = user.id;
  }

  return { ...base, ...overrideParams };
}
