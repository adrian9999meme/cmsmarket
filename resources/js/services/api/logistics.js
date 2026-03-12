/**
 * Logistics domain API endpoints
 * Orders (CMS), drivers, chat
 */

const base = () => import.meta.env.VITE_API_VERSION || '';

export const logisticsEndpoints = {
  // Orders (CMS)
  ordersFetch: () => base() + 'orders/fetch',

  // Drivers
  driversFetch: () => base() + 'drivers/fetch',
  driversAdd: () => base() + 'drivers/add',
  driversEdit: (id) => base() + `drivers/edit/${id}`,
  driversDelete: (id) => base() + `drivers/delete/${id}`,

  // Chat (CMS)
  chatRooms: () => base() + 'chat/rooms',
  chatMessages: () => base() + 'chat/messages',
  chatSendMessage: () => base() + 'chat/send-message',
};
