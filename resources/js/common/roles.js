export const ROLES = {
    ADMIN: "admin",
    MANAGER: "manager",
    SELLER: "seller",
    CUSTOMER: "customer",
    TRADE_CUSTOMER: "trade_customer",
    DELIVERY_HERO: "delivery_hero",
    STAFF: "staff",
    WALK_IN: "walk_in"
};

// Role -> app base path for micro-frontend
export const ROLE_APP_BASE = {
    [ROLES.ADMIN]: "/admin",
    [ROLES.SELLER]: "/seller",
    [ROLES.MANAGER]: "/seller",
    [ROLES.DELIVERY_HERO]: "/driver",
    [ROLES.CUSTOMER]: "/",
    [ROLES.TRADE_CUSTOMER]: "/",
};