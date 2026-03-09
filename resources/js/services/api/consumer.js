/**
 * Consumer domain API endpoints
 * Profile, addresses, notifications, reviews, wallet, chat
 */

const base = () => import.meta.env.VITE_API_VERSION || '';

export const consumerEndpoints = {
  profile: () => base() + 'profile',
  updateProfile: () => base() + 'update-profile',
  changePassword: () => base() + 'change-password',
  deleteAccount: () => base() + 'delete-account',
  logout: () => base() + 'logout',

  shippingAddresses: () => base() + 'user/shipping-addresses',
  shippingAddressStore: () => base() + 'shipping-addresses',
  shippingAddressUpdate: (id) => base() + `shipping-addresses/${id}`,
  shippingAddressDestroy: (id) => base() + `shipping-addresses/${id}`,

  notifications: () => base() + 'notifications',
  deleteNotification: (id) => base() + `delete-notification/${id}`,
  deleteAllNotifications: () => base() + 'delete-all-notifications',

  myWallet: () => base() + 'my-wallet',
  myReward: () => base() + 'my-reward',
  convertReward: () => base() + 'convert-reward',
  digitalProductOrders: () => base() + 'digital-product-order-list',
  recharge: () => base() + 'recharge',

  chatSellers: () => base() + 'sellers',
  messages: () => base() + 'messages',
  sendMessage: () => base() + 'send-message',
};
