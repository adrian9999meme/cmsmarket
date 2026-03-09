# API Domain Structure

Routes are organized by domain for a modern marketplace + logistics platform. Controllers remain in existing locations.

## Route Files

| File | Domain | Description |
|------|--------|--------------|
| `routes/api/auth.php` | Auth | Login, register, OTP, password reset |
| `routes/api/consumer.php` | Consumer | Profile, addresses, notifications, reviews, wallet, chat, blog reviews |
| `routes/api/consumer_cms.php` | Consumer CMS | Customers, trade discount requests (admin) |
| `routes/api/marketplace.php` | Marketplace | Sellers, stores, products, categories, shops, cart, wishlist |
| `routes/api/logistics.php` | Logistics | Orders (CMS), drivers |
| `routes/api/platform.php` | Platform | Config, home, campaigns, blog, video, pages, user orders, payment |

## Controller Mapping

### Auth
- `Auth\AuthController` – login, register, OTP, forgot password
- `Auth\UserController` – profile (in consumer.php)

### Consumer
- `Auth\UserController` – profile, update-profile, change-password, delete-account, my-wallet, recharge
- `Api\V100\ShippingController` – shipping addresses
- `Api\V100\NotificationController` – notifications
- `Api\V100\ReviewController` – product reviews
- `Api\V100\RewardSystemController` – rewards, digital products
- `Api\V100\ChatSystemController` – chat
- `Api\V100\BlogController` – blog comments/replies

### Consumer CMS (Admin)
- `Admin\CustomerController` – customers, trade approve/reject
- `Admin\TradeDiscountRequestController` – trade discount requests

### Marketplace
- `Admin\SellerController` – sellers (admin)
- `Admin\StoreController` – stores (admin + seller)
- `Admin\Product\ProductController` – products CMS
- `Api\V100\ProductController` – public product listing, search
- `Api\V100\ShopController` – shops, followed shops, coupons
- `Api\V100\CategoryController` – categories
- `Api\V100\BrandController` – brands
- `Api\V100\CartController` – cart, coupons
- `Api\V100\WishlistController` – wishlist
- `Site\FrontendController` – home/store-categories, home/sellers

### Logistics
- `Admin\OrderController` – orders fetch (CMS)
- `Admin\DeliveryHero\DeliveryHeroController` – drivers

### Platform
- `Api\V100\APIController` – configs, page, import-db
- `Api\V100\HomeController` – home-screen
- `Api\V100\CampaignController` – campaigns
- `Api\V100\BlogController` – blog posts
- `Api\V100\ShippingController` – countries, states, cities
- `Api\V100\VideoShoppingController` – video shopping
- `Admin\OrderController` – user orders, track, confirm, payment, invoice

## Payment Callbacks (outside v1)

These stay at `/api/...` for payment gateway redirects:

- `POST/GET /api/complete-order` – order payment callback
- `GET/POST /api/complete-recharge` – wallet recharge callback
- `GET /api/payment-success` – payment success redirect

## Middleware

- `jwt.verify` – authenticated users
- `adminCheck` – admin role
- `sellerOrAdminStore` – admin or seller (store-scoped)

## Other API Route Files

- `routes/delivery-hero-api.php` – driver app
- `routes/seller-api.php` – seller CMS
- `routes/web-api-only.php` – minimal web (root, health)
