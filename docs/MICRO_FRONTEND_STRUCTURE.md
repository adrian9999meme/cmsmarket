# Micro-Frontend Structure

The project uses a micro-frontend architecture with separate apps per user type.

## Apps

| App | Path | Users | Entry |
|-----|------|-------|-------|
| **Admin CMS** | `/admin`, `/admin/*` | Admin | `resources/js/apps/admin/main.jsx` |
| **Seller CMS** | `/seller`, `/seller/*` | Seller, Manager | `resources/js/apps/seller/main.jsx` |
| **Driver App** | `/driver`, `/driver/*` | Delivery Hero | `resources/js/apps/driver/main.jsx` |
| **Customer App** | `/`, `/*` | Customer, Trade Customer | `resources/js/apps/customer/main.jsx` |

## URL Structure

- **Admin**: `https://yoursite.com/admin`, `https://yoursite.com/admin/dashboard`, `https://yoursite.com/admin/sellers/all`
- **Seller**: `https://yoursite.com/seller`, `https://yoursite.com/seller/dashboard`, `https://yoursite.com/seller/orders/today`
- **Driver**: `https://yoursite.com/driver`, `https://yoursite.com/driver/orders/available`
- **Customer**: `https://yoursite.com/`, `https://yoursite.com/dashboard`, `https://yoursite.com/login`

## Shared Packages

| Package | Path | Purpose |
|---------|------|---------|
| `@cmsmarket/api-client` | `resources/js/packages/api-client/` | Axios client, API endpoints |
| `@cmsmarket/shared-ui` | `resources/js/packages/shared-ui/` | Shared UI components |

## Route Configuration

- **Admin**: `resources/js/apps/admin/routes.jsx` – Dashboard, Sellers, Stores, Products, Customers, Orders, Drivers, Payments, Trade Discounts
- **Seller**: `resources/js/apps/seller/routes.jsx` – Dashboard, Stores, Products, Orders, Payments
- **Driver**: `resources/js/apps/driver/routes.jsx` – Orders (available, completed), Earnings
- **Customer**: Uses existing `allRoutes.jsx` (full app)

## Blade Views

- `resources/views/apps/admin.blade.php` – Admin app shell
- `resources/views/apps/seller.blade.php` – Seller app shell
- `resources/views/apps/driver.blade.php` – Driver app shell
- `resources/views/apps/customer.blade.php` – Customer app shell

## Build

All apps are built together:

```bash
npm run build
```

Vite outputs separate chunks per app. Each Blade view loads only its app's entry.

## Post-Login Redirect

Implemented in `store/auth/login/saga.js`:

- Admin → `/admin/dashboard`
- Seller/Manager → `/seller/dashboard`
- Delivery Hero → `/driver`
- Customer/Trade Customer → `/dashboard` (customer app)

## App Guard

`helpers/appGuard.js` + `AuthProtected.jsx`: if a user lands in the wrong app (e.g. customer visits `/admin`), they are redirected to their role's app.

## 401 / Logout Redirect

- API 401 interceptor and logout saga redirect to app-specific login (`/admin/login`, `/seller/login`, `/driver/login`, or `/login`).
