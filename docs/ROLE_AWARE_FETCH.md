# Role-Aware Data Fetching

Shared components fetch data with role-specific defaults. The same component (e.g. OrdersBreakdown) behaves differently per role.

## Parts

### 1. `helpers/roleFetchConfig.js`

- **ROLE_FETCH_CONFIG** – Default query params per role per entity (orders, sellers, stores, products, customers, drivers, payments)
- **ROLE_ENTITY_ACCESS** – Which entities each role can access
- **buildRoleQuery(role, entity, overrideParams, user)** – Merges role defaults with overrides

### 2. `hooks/useRoleAwareFetch.js`

Returns:

- `role` – Current user role
- `user` – Current user
- `buildQuery(entity, overrideParams)` – Builds query with role defaults + overrides
- `canAccess(entity)` – Whether the role can access the entity

### 3. `components/RoleAwareDataFetcher/index.jsx`

Optional wrapper for render props:

```jsx
<RoleAwareDataFetcher entity="orders">
  {({ buildQuery, canAccess }) => <OrdersBreakdown buildQuery={buildQuery} />}
</RoleAwareDataFetcher>
```

### 4. Usage in shared components

```jsx
const OrdersBreakdown = () => {
  const { buildQuery } = useRoleAwareFetch();
  const { subdomain } = useParams();

  useEffect(() => {
    const roleQuery = buildQuery("orders", {
      subdomain,
      sellerId: filters.sellerId,
      deliveryStatus: filters.deliveryStatus,
      // ... other filters
    });
    dispatch(getOrders(roleQuery));
  }, [dispatch, filters, subdomain, buildQuery]);
  // ...
};
```

## Role defaults (ROLE_FETCH_CONFIG)

| Role | Orders | Sellers | Stores | Products | Customers | Drivers | Payments |
|------|--------|---------|--------|----------|-----------|---------|----------|
| admin | all | all | all | all | all | all | today |
| manager | today | - | my | all | - | - | store |
| seller | today | - | my | all | - | - | - |
| delivery_hero | available | - | - | - | - | - | - |
| customer | history | - | - | - | - | - | - |
| trade_customer | history | - | - | - | - | - | - |

## Flow

1. Component calls `buildQuery(entity, overrideParams)`.
2. `buildRoleQuery` loads role defaults for that entity.
3. Adds user-specific params (e.g. `store_id` for manager).
4. Merges with `overrideParams` (URL, filters).
5. Returns final query for the saga/API.
