/**
 * Consumer CMS domain API endpoints
 * Customers, trade discount requests (admin)
 */

const base = () => import.meta.env.VITE_API_VERSION || '';

export const consumerCmsEndpoints = {
  // Customers
  customersFetch: () => base() + 'customers/fetch',
  customersCreate: () => base() + 'customers/create',
  customersEdit: (id) => base() + `customers/edit/${id}`,
  customersSetActive: (id) => base() + `customers/setactive/${id}`,
  customersDelete: (id) => base() + `customers/delete/${id}`,
  tradeApprove: (id) => base() + `customers/trade-approve/${id}`,
  tradeReject: (id) => base() + `customers/trade-reject/${id}`,

  // Trade discount requests
  tradeDiscountRequests: () => base() + 'trade-discount-requests',
  tradeDiscountRequestShow: (id) => base() + `trade-discount-requests/${id}`,
  tradeDiscountRequestStore: () => base() + 'trade-discount-requests',
  tradeDiscountRequestUpdate: (id) => base() + `trade-discount-requests/${id}`,
  tradeDiscountRequestApprove: (id) => base() + `trade-discount-requests/${id}/approve`,
  tradeDiscountRequestReject: (id) => base() + `trade-discount-requests/${id}/reject`,
  tradeDiscountRequestDestroy: (id) => base() + `trade-discount-requests/${id}`,
};
