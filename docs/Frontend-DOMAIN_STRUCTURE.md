# Frontend Domain Structure

The frontend mirrors the backend domain structure for consistency across the marketplace + logistics platform.

## API Services (`resources/js/services/api/`)

| File | Domain | Endpoints |
|------|--------|-----------|
| `auth.js` | Auth | login, register, OTP, password reset |
| `consumer.js` | Consumer | profile, addresses, notifications, wallet, chat |
| `consumerCms.js` | Consumer CMS | customers, trade discount requests |
| `marketplace.js` | Marketplace | sellers, stores, products, cart, wishlist |
| `logistics.js` | Logistics | orders (CMS), drivers |
| `platform.js` | Platform | config, home, user orders, payment |

### Usage

```javascript
// New code - domain-based
import api from "../store/api";
import { marketplaceEndpoints, logisticsEndpoints } from "../store/endpoints";

api.get(marketplaceEndpoints.sellersFetch());
api.get(logisticsEndpoints.ordersFetch());
```

```javascript
// Existing code - backward compatible
import { GET_SELLERS_API, GET_ORDERS_API } from "../store/endpoints";

api.get(GET_SELLERS_API);
api.get(GET_ORDERS_API);
```

## Route Groups (`resources/js/routes/allRoutes.jsx`)

Protected routes are grouped by domain:

- **Platform** – Dashboard
- **Marketplace** – Sellers, Stores, Products
- **Consumer CMS** – Customers
- **Logistics** – Orders, Drivers

## Page Mapping

| Domain | Pages |
|--------|-------|
| Platform | Dashboard |
| Marketplace | SellersBreakdown, StoresBreakdown, ProductsBreakdown |
| Consumer CMS | CustomersBreakdown |
| Logistics | OrdersBreakdown, DriversBreakdown |

## Store Structure

Redux store slices align with domains:

- `auth` – Auth domain
- `ecommerce` – Marketplace (sellers, stores, products, orders)
- `drivers` – Logistics
- `config` – Platform

## Menu Config

`resources/js/common/menu.config.js` defines sidebar menu by domain:

- Orders (Logistics)
- Sellers, Stores, Products (Marketplace)
- Customers, Trade Discounts (Consumer CMS)
- Drivers (Logistics)
- Payments (Finance – uses Orders subdomain)
