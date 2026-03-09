/**
 * App guard - ensures user is in the correct app for their role
 * Used in micro-frontend to redirect users who land in wrong app
 */

import { ROLES, ROLE_APP_BASE } from "../common/roles";

/**
 * Returns true if the current path matches the user's role app
 */
export function isUserInCorrectApp(pathname, role) {
  const base = ROLE_APP_BASE[role] || "/";
  if (base === "/") return !pathname.startsWith("/admin") && !pathname.startsWith("/seller") && !pathname.startsWith("/driver");
  return pathname.startsWith(base);
}

/**
 * Returns the redirect URL if user is in wrong app, null otherwise
 */
export function getAppRedirectIfWrong(pathname, role) {
  if (!role) return null;
  if (isUserInCorrectApp(pathname, role)) return null;
  const base = ROLE_APP_BASE[role] || "/";
  return base === "/" ? "/dashboard" : `${base}/dashboard`;
}
