/**
 * RoleAwareDataFetcher - Wrapper that provides role-aware fetch context to children
 * Use when a shared component needs to fetch data with role-specific params.
 *
 * Usage:
 *   <RoleAwareDataFetcher entity="orders">
 *     {({ buildQuery, role }) => <OrdersBreakdown buildQuery={buildQuery} />}
 *   </RoleAwareDataFetcher>
 *
 * Or use useRoleAwareFetch() directly in the component.
 */

import React from "react";
import { useRoleAwareFetch } from "../../hooks/useRoleAwareFetch";

const RoleAwareDataFetcher = ({ entity, children }) => {
  const { buildQuery, canAccess, role, user } = useRoleAwareFetch();

  if (typeof children === "function") {
    return children({
      buildQuery: (override) => buildQuery(entity, override),
      canAccess: () => canAccess(entity),
      role,
      user,
    });
  }

  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        buildQuery: (override) => buildQuery(entity, override),
        canAccess: () => canAccess(entity),
        role,
        user,
      });
    }
    return child;
  });
};

export default RoleAwareDataFetcher;
