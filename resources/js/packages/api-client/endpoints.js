/**
 * @cmsmarket/api-client - API endpoints by domain
 */

const base = () => (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_VERSION) || "";

export const authEndpoints = {
  login: () => base() + "auth/login",
  register: () => base() + "auth/register",
  profile: () => base() + "profile",
};

export const marketplaceEndpoints = {
  sellersFetch: () => base() + "sellers/fetch",
  sellersCreate: () => base() + "sellers/create",
  sellersEdit: (id) => base() + `sellers/edit/${id}`,
  sellersSetActive: (id) => base() + `sellers/setactive/${id}`,
  sellersDelete: (id) => base() + `sellers/delete/${id}`,
  storesFetch: () => base() + "stores/fetch",
  storesCreate: () => base() + "stores/create",
  storesEdit: (id) => base() + `stores/edit/${id}`,
  storesSetActive: (id) => base() + `stores/setactive/${id}`,
  storesDelete: (id) => base() + `stores/delete/${id}`,
  productsFetch: () => base() + "products/fetch",
  productShow: (id) => base() + `products/${id}`,
  productCategories: () => base() + "products/categories/list",
  productsCreate: () => base() + "products/create",
  productsEdit: (id) => base() + `products/edit/${id}`,
  productsDelete: (id) => base() + `products/delete/${id}`,
};

export const consumerCmsEndpoints = {
  customersFetch: () => base() + "customers/fetch",
  customersCreate: () => base() + "customers/create",
  customersEdit: (id) => base() + `customers/edit/${id}`,
  tradeApprove: (id) => base() + `customers/trade-approve/${id}`,
  tradeReject: (id) => base() + `customers/trade-reject/${id}`,
};

export const logisticsEndpoints = {
  ordersFetch: () => base() + "orders/fetch",
  driversFetch: () => base() + "drivers/fetch",
  driversAdd: () => base() + "drivers/add",
  driversEdit: (id) => base() + `drivers/edit/${id}`,
};

export const platformEndpoints = {
  config: () => base() + "configs",
};
