/**
 * Marketplace domain API endpoints
 * Sellers, stores, products, categories, shops, cart, wishlist
 */

const base = () => import.meta.env.VITE_API_VERSION || '';

export const marketplaceEndpoints = {
  // Sellers (CMS)
  sellersFetch: () => base() + 'sellers/fetch',
  sellersCreate: () => base() + 'sellers/create',
  sellersEdit: (id) => base() + `sellers/edit/${id}`,
  sellersSetActive: (id) => base() + `sellers/setactive/${id}`,
  sellersDelete: (id) => base() + `sellers/delete/${id}`,

  // Stores (CMS)
  storesFetch: () => base() + 'stores/fetch',
  storesCreate: () => base() + 'stores/create',
  storesEdit: (id) => base() + `stores/edit/${id}`,
  storesSetActive: (id) => base() + `stores/setactive/${id}`,
  storesDelete: (id) => base() + `stores/delete/${id}`,

  // Products (CMS)
  productsFetch: () => base() + 'products/fetch',
  productShow: (id) => base() + `products/${id}`,
  productCategories: () => base() + 'products/categories/list',
  productsCreate: () => base() + 'products/create',
  productsEdit: (id) => base() + `products/edit/${id}`,
  productsDelete: (id) => base() + `products/delete/${id}`,

  // Public marketplace
  homeStoreCategories: () => base() + 'home/store-categories',
  homeSellers: () => base() + 'home/sellers',
  getProducts: () => base() + 'get-products',
  productDetails: (id) => base() + `product-details/${id}`,
  search: () => base() + 'search',

  // Cart
  carts: () => base() + 'carts',
  cartStore: () => base() + 'cart-store',
  cartUpdate: (id) => base() + `cart-update/${id}`,
  cartDelete: (id) => base() + `cart-delete/${id}`,
  coupons: () => base() + 'coupons',
  applyCoupon: () => base() + 'apply-coupon',
  appliedCoupons: () => base() + 'applied-coupons',
  findShippingCost: () => base() + 'find/shipping-cost',

  // Wishlist
  favouriteProducts: () => base() + 'favourite-products',
  favourite: (productId) => base() + `favourite/${productId}`,
  followedShop: () => base() + 'followed-shop',
  followUnfollowShop: (sellerId) => base() + `followed-shop/${sellerId}`,
  deleteCoupon: () => base() + 'delete-coupon',
};
