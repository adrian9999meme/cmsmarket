/**
 * Browser route prefix - injected by Blade from config('app.route_prefix').
 * When APP_ENV=production and APP_ROUTE_PREFIX=cms96501, the app is at /cms96501/admin, etc.
 */

export function getRoutePrefix() {
  if (typeof document === "undefined") return "";
  const meta = document.querySelector('meta[name="app-route-prefix"]');
  return (meta?.getAttribute("content") || "").trim();
}

/**
 * Build full path with prefix, e.g. getBasePath('/admin') => '/cms96501/admin' or '/admin'
 * For basename: getBasePath('') returns '' (no prefix) or '/cms96501' (with prefix)
 */
export function getBasePath(path = "") {
  const prefix = getRoutePrefix();
  const cleanPath = (path || "").replace(/^\/+/, "");
  if (prefix) {
    const full = `/${prefix}/${cleanPath}`.replace(/\/+$/, "");
    return full === `/${prefix}` ? full : full || `/${prefix}`;
  }
  return path ? `/${cleanPath}` : "";
}
