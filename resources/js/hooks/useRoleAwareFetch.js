/**
 * useRoleAwareFetch - Hook for role-based data fetching in shared components
 * Provides role, user, and query builder that merges role defaults with component overrides.
 */

import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { buildRoleQuery } from "../helpers/roleFetchConfig";
import { ROLE_ENTITY_ACCESS } from "../helpers/roleFetchConfig";

const userSelector = createSelector(
  (state) => state.Login?.user,
  (state) => state.Login?.token,
  (user, token) => ({ user, isAuthenticated: !!token })
);

/**
 * @returns {{
 *   role: string,
 *   user: object,
 *   isAuthenticated: boolean,
 *   buildQuery: (entity, overrideParams) => object,
 *   canAccess: (entity) => boolean,
 * }}
 */
export function useRoleAwareFetch() {
  const { user, isAuthenticated } = useSelector(userSelector);
  const role = (user?.role || user?.user_type || "").toLowerCase();

  const buildQuery = useCallback(
    (entity, overrideParams = {}) => {
      return buildRoleQuery(role, entity, overrideParams, user);
    },
    [role, user]
  );

  const canAccess = useCallback(
    (entity) => {
      const allowed = ROLE_ENTITY_ACCESS[role];
      return Array.isArray(allowed) && allowed.includes(entity);
    },
    [role]
  );

  return useMemo(
    () => ({
      role,
      user,
      isAuthenticated,
      buildQuery,
      canAccess,
    }),
    [role, user, isAuthenticated, buildQuery, canAccess]
  );
}
