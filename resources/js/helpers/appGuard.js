/**
 * App guard - ensures user is in the correct app for their role
 * Used in micro-frontend to redirect users who land in wrong app
 * Supports route prefix (e.g. /cms96501/admin in production)
 */

import { ROLES, ROLE_APP_BASE } from "../common/roles";
import { getBasePath } from "../config/routeConfig";

/**
 * Returns true if the current path matches the user's role app
 * Uses includes() to support prefix: /cms96501/admin/... or /admin/...
 */
export function isUserInCorrectApp(pathname, role) {
  const base = ROLE_APP_BASE[role] || "/";
  if (base === "/") {
    return !pathname.includes("/admin") && !pathname.includes("/seller") && !pathname.includes("/driver");
  }
  return pathname.includes(base);
}

/**
 * Returns the redirect URL if user is in wrong app, null otherwise
 */
export function getAppRedirectIfWrong(pathname, role) {
  if (!role) return null;
  if (isUserInCorrectApp(pathname, role)) return null;
  const base = ROLE_APP_BASE[role] || "/";
  return base === "/" ? getBasePath("/dashboard") : getBasePath(`${base}/dashboard`);
}
