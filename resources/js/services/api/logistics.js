/**
 * Logistics domain API endpoints
 * Orders (CMS), drivers
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
};
