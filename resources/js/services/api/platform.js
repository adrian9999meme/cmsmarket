/**
 * Platform domain API endpoints
 * Config, home, campaigns, blog, pages, user orders, payment
 */

const base = () => import.meta.env.VITE_API_VERSION || '';

export const platformEndpoints = {
  config: () => base() + 'configs',
  homeScreen: () => base() + 'home-screen',
  page: (id) => base() + `page/${id}`,

  // User orders
  orders: () => base() + 'orders',
  trackOrder: () => base() + 'track-order',
  confirmOrder: () => base() + 'confirm-order',
  payment: () => base() + 'payment',
  invoiceDownload: (id) => base() + `invoice-download/${id}`,
  orderByTrx: () => base() + 'order-by-trx',
};
