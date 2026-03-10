/**
 * Filter menu by user role and app config (e.g. seller_system).
 * @param {Array} menu - Menu config array
 * @param {string} role - User role
 * @param {Object} appConfig - Optional app_config from API (e.g. { seller_system: boolean })
 */
export const filterMenuByRole = (menu, role, appConfig = {}) => {
    const sellerSystemEnabled = !!appConfig?.seller_system;

    return menu
        .filter(item => {
            if (!item.roles.includes(role)) return false;
            if (item.requiresSellerSystem && !sellerSystemEnabled) return false;
            return true;
        })
        .map(item => {
            if (!item.children) return item;
            const filteredChildren = item.children.filter(child =>
                child.roles.includes(role)
            );
            return { ...item, children: filteredChildren };
        })
        .filter(item => {
            if (!item.children) return true;
            return item.children.length > 0;
        });

};