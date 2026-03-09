/**
 * API endpoints - domain-based structure
 * Mirrors backend routes/api/* domain files
 *
 * Usage:
 *   import { auth, marketplace, logistics } from '@/services/api';
 *   api.get(auth.login());
 */

export { authEndpoints } from './auth';
export { consumerEndpoints } from './consumer';
export { consumerCmsEndpoints } from './consumerCms';
export { marketplaceEndpoints } from './marketplace';
export { logisticsEndpoints } from './logistics';
export { platformEndpoints } from './platform';
