import { ROLES } from "./roles";

export const menuConfig = [

/* DASHBOARD */

{
    title: "Dashboard",
    icon: "bx bx-home-circle",
    path: "/dashboard",
    roles: [
        ROLES.ADMIN,
        ROLES.MANAGER,
        ROLES.TRADE_CUSTOMER,
        ROLES.DELIVERY_HERO
    ]
},

/* ORDERS */

{
    title: "Orders",
    icon: "bx bx-package",
    roles: [
        ROLES.ADMIN,
        ROLES.MANAGER,
        ROLES.TRADE_CUSTOMER,
        ROLES.DELIVERY_HERO,
        ROLES.CUSTOMER
    ],
    children: [

        {
            title: "Live Orders",
            icon: "bx bx-pulse",
            path: "/orders/live",
            roles: [ROLES.ADMIN, ROLES.MANAGER]
        },

        {
            title: "Today's Orders",
            icon: "bx bx-calendar",
            path: "/orders/today",
            roles: [ROLES.ADMIN, ROLES.MANAGER]
        },

        {
            title: "All Orders",
            icon: "bx bx-list-check",
            path: "/orders/all",
            roles: [ROLES.ADMIN]
        },

        {
            title: "Order History",
            icon: "bx bx-history",
            path: "/orders/history",
            roles: [
                ROLES.MANAGER,
                ROLES.TRADE_CUSTOMER,
                ROLES.CUSTOMER
            ]
        },

        {
            title: "Available Orders",
            icon: "bx bx-map",
            path: "/orders/available",
            roles: [ROLES.DELIVERY_HERO]
        },

        {
            title: "Completed Deliveries",
            icon: "bx bx-check-circle",
            path: "/orders/completed",
            roles: [ROLES.DELIVERY_HERO]
        }

    ]
},

/* SELLERS */

{
    title: "Sellers",
    icon: "bx bx-user-voice",
    requiresSellerSystem: true,
    roles: [ROLES.ADMIN],
    children: [

        {
            title: "All Sellers",
            icon: "bx bx-group",
            path: "/sellers/all",
            roles: [ROLES.ADMIN]
        },

        {
            title: "Pending Approvals",
            icon: "bx bx-time-five",
            path: "/sellers/pending",
            roles: [ROLES.ADMIN]
        },

        {
            title: "Add Seller",
            icon: "bx bx-user-plus",
            path: "/sellers/add",
            roles: [ROLES.ADMIN]
        }

    ]
},

/* STORES */

{
    title: "Stores",
    icon: "bx bx-store",
    requiresSellerSystem: true,
    roles: [
        ROLES.ADMIN,
        ROLES.SELLER
    ],
    children: [

        {
            title: "All Stores",
            icon: "bx bx-store-alt",
            path: "/stores/all",
            roles: [ROLES.ADMIN]
        },

        {
            title: "Active Stores",
            icon: "bx bx-check-circle",
            path: "/stores/active",
            roles: [ROLES.ADMIN]
        },

        {
            title: "My Stores",
            icon: "bx bx-store",
            path: "/stores/my",
            roles: [ROLES.SELLER]
        },

        {
            title: "Add Store",
            icon: "bx bx-plus",
            path: "/stores/add",
            roles: [
                ROLES.ADMIN,
                ROLES.SELLER
            ]
        }

    ]
},

/* PRODUCTS */

{
    title: "Products",
    icon: "bx bx-cube",
    roles: [
        ROLES.ADMIN,
        ROLES.MANAGER,
        ROLES.TRADE_CUSTOMER,
        ROLES.CUSTOMER
    ],
    children: [

        {
            title: "All Products",
            icon: "bx bx-list-ul",
            path: "/products/all",
            roles: [
                ROLES.ADMIN,
                ROLES.MANAGER
            ]
        },

        {
            title: "Browse Products",
            icon: "bx bx-shopping-bag",
            path: "/products",
            roles: [
                ROLES.TRADE_CUSTOMER,
                ROLES.CUSTOMER
            ]
        },

        {
            title: "Add Product",
            icon: "bx bx-plus-circle",
            path: "/products/add",
            roles: [ROLES.MANAGER]
        },

        {
            title: "Categories",
            icon: "bx bx-grid-alt",
            path: "/products/categories",
            roles: [ROLES.ADMIN]
        }

    ]
},

/* CUSTOMERS */

{
    title: "Customers",
    icon: "bx bx-user",
    roles: [ROLES.ADMIN],
    children: [

        {
            title: "All Customers",
            icon: "bx bx-group",
            path: "/customers/all",
            roles: [ROLES.ADMIN]
        },

        {
            title: "Trade Customers",
            icon: "bx bx-briefcase",
            path: "/customers/trade",
            roles: [ROLES.ADMIN]
        },

        {
            title: "Trade Pending",
            icon: "bx bx-time-five",
            path: "/customers/trade-pending",
            roles: [ROLES.ADMIN]
        }

    ]
},

/* TRADE DISCOUNTS */

{
    title: "Trade Discounts",
    icon: "bx bx-purchase-tag",
    roles: [ROLES.ADMIN],
    children: [

        {
            title: "Discount Requests",
            icon: "bx bx-list-ul",
            path: "/trade-discounts/requests",
            roles: [ROLES.ADMIN]
        },

        {
            title: "Approved Discounts",
            icon: "bx bx-check-circle",
            path: "/trade-discounts/approved",
            roles: [ROLES.ADMIN]
        }

    ]
},

/* DRIVERS */

{
    title: "Drivers",
    icon: "bx bx-car",
    roles: [ROLES.ADMIN],
    children: [

        {
            title: "All Drivers",
            icon: "bx bx-id-card",
            path: "/drivers/all",
            roles: [ROLES.ADMIN]
        },

        {
            title: "Pending Drivers",
            icon: "bx bx-time-five",
            path: "/drivers/pending",
            roles: [ROLES.ADMIN]
        }

    ]
},

/* PAYMENTS */

{
    title: "Payments",
    icon: "bx bx-credit-card",
    roles: [
        ROLES.ADMIN,
        ROLES.MANAGER
    ],
    children: [

        {
            title: "Today's Payments",
            icon: "bx bx-wallet",
            path: "/payments/today",
            roles: [ROLES.ADMIN]
        },

        {
            title: "Store Payments",
            icon: "bx bx-store",
            path: "/payments/store",
            roles: [ROLES.MANAGER]
        }

    ]
},

/* DRIVER EARNINGS */

{
    title: "Earnings",
    icon: "bx bx-dollar",
    roles: [ROLES.DELIVERY_HERO],
    children: [

        {
            title: "Current Earnings",
            icon: "bx bx-wallet",
            path: "/earnings",
            roles: [ROLES.DELIVERY_HERO]
        },

        {
            title: "Payout History",
            icon: "bx bx-history",
            path: "/payouts",
            roles: [ROLES.DELIVERY_HERO]
        }

    ]
}

];