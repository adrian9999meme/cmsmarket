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
        ROLES.DELIVERY_HERO,
        ROLES.STAFF
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
            title: "Unresolved",
            icon: "bx bx-error-circle",
            path: "/orders/unresolved",
            roles: [ROLES.ADMIN, ROLES.MANAGER]
        },
        {
            title: "Cancelled",
            icon: "bx bx-x-circle",
            path: "/orders/cancelled",
            roles: [ROLES.ADMIN]
        },
        {
            title: "Order History",
            icon: "bx bx-history",
            path: "/orders/history",
            roles: [ROLES.MANAGER, ROLES.TRADE_CUSTOMER, ROLES.CUSTOMER]
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
        { title: "All Sellers", icon: "bx bx-group", path: "/sellers/all", roles: [ROLES.ADMIN] },
        { title: "Pending Approvals", icon: "bx bx-time-five", path: "/sellers/pending", roles: [ROLES.ADMIN] },
        { title: "Blocked Sellers", icon: "bx bx-block", path: "/sellers/blocked", roles: [ROLES.ADMIN] },
        { title: "Add New Seller", icon: "bx bx-user-plus", path: "/sellers/add", roles: [ROLES.ADMIN] }
    ]
},

/* STORES */

{
    title: "Stores",
    icon: "bx bx-store",
    requiresSellerSystem: true,
    roles: [ROLES.ADMIN, ROLES.SELLER],
    children: [
        { title: "All Stores", icon: "bx bx-store-alt", path: "/stores/all", roles: [ROLES.ADMIN] },
        { title: "Active Stores", icon: "bx bx-check-circle", path: "/stores/active", roles: [ROLES.ADMIN] },
        { title: "Blocked Stores", icon: "bx bx-block", path: "/stores/blocked", roles: [ROLES.ADMIN] },
        { title: "Pending Approvals", icon: "bx bx-time-five", path: "/stores/pending", roles: [ROLES.ADMIN] },
        { title: "My Stores", icon: "bx bx-store", path: "/stores/my", roles: [ROLES.SELLER, ROLES.MANAGER] },
        { title: "Add New Store", icon: "bx bx-plus", path: "/stores/add", roles: [ROLES.ADMIN, ROLES.SELLER] },
        { title: "Store Discounts", icon: "bx bx-purchase-tag", path: "/stores/discounts", roles: [ROLES.ADMIN] }
    ]
},

/* PRODUCTS */

{
    title: "Products",
    icon: "bx bx-cube",
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.TRADE_CUSTOMER, ROLES.CUSTOMER],
    children: [
        { title: "All Products", icon: "bx bx-list-ul", path: "/products/all", roles: [ROLES.ADMIN, ROLES.MANAGER] },
        { title: "Browse Products", icon: "bx bx-shopping-bag", path: "/products", roles: [ROLES.TRADE_CUSTOMER, ROLES.CUSTOMER] },
        { title: "Categories", icon: "bx bx-grid-alt", path: "/products/categories", roles: [ROLES.ADMIN] },
        { title: "Media Files", icon: "bx bx-image", path: "/products/media", roles: [ROLES.ADMIN] },
        { title: "Add New Product", icon: "bx bx-plus-circle", path: "/products/add", roles: [ROLES.MANAGER] }
    ]
},

/* CUSTOMERS */

{
    title: "Customers",
    icon: "bx bx-user",
    roles: [ROLES.ADMIN],
    children: [
        { title: "All Customers", icon: "bx bx-group", path: "/customers/all", roles: [ROLES.ADMIN] },
        { title: "Trade Customers", icon: "bx bx-briefcase", path: "/customers/trade", roles: [ROLES.ADMIN] },
        { title: "Trade Pending", icon: "bx bx-time-five", path: "/customers/trade-pending", roles: [ROLES.ADMIN] },
        { title: "Add New Customer", icon: "bx bx-user-plus", path: "/customers/add", roles: [ROLES.ADMIN] },
        { title: "Blocked Customers", icon: "bx bx-block", path: "/customers/blocked", roles: [ROLES.ADMIN] }
    ]
},

/* TRADE DISCOUNTS */

{
    title: "Trade Discounts",
    icon: "bx bx-purchase-tag",
    roles: [ROLES.ADMIN],
    children: [
        { title: "Discount Requests", icon: "bx bx-list-ul", path: "/trade-discounts/requests", roles: [ROLES.ADMIN] },
        { title: "Approved Discounts", icon: "bx bx-check-circle", path: "/trade-discounts/approved", roles: [ROLES.ADMIN] }
    ]
},

/* DRIVERS */

{
    title: "Drivers",
    icon: "bx bx-car",
    roles: [ROLES.ADMIN],
    children: [
        { title: "Drivers Online", icon: "bx bx-signal-5", path: "/drivers/online", roles: [ROLES.ADMIN] },
        { title: "All Drivers", icon: "bx bx-id-card", path: "/drivers/all", roles: [ROLES.ADMIN] },
        { title: "Pending Approvals", icon: "bx bx-time-five", path: "/drivers/pending", roles: [ROLES.ADMIN] },
        { title: "Blocked Drivers", icon: "bx bx-block", path: "/drivers/blocked", roles: [ROLES.ADMIN] },
        { title: "Add New Driver", icon: "bx bx-user-plus", path: "/drivers/add", roles: [ROLES.ADMIN] },
        { title: "Earnings & Payouts", icon: "bx bx-dollar", path: "/drivers/earnings", roles: [ROLES.ADMIN] }
    ]
},

/* SUPPORT */

{
    title: "Support",
    icon: "bx bx-support",
    roles: [ROLES.ADMIN, ROLES.STAFF],
    children: [
        { title: "Urgent Tickets", icon: "bx bx-error", path: "/support/urgent", roles: [ROLES.ADMIN, ROLES.STAFF] },
        { title: "Customer Tickets", icon: "bx bx-user", path: "/support/tickets", roles: [ROLES.ADMIN, ROLES.STAFF] },
        { title: "Stores Tickets", icon: "bx bx-store", path: "/support/stores", roles: [ROLES.ADMIN] },
        { title: "Drivers Tickets", icon: "bx bx-car", path: "/support/drivers", roles: [ROLES.ADMIN] }
    ]
},

/* NOTIFICATIONS */

{
    title: "Notifications",
    icon: "bx bx-bell",
    roles: [ROLES.ADMIN],
    children: [
        { title: "Website Info", icon: "bx bx-info-circle", path: "/notifications/website-info", roles: [ROLES.ADMIN] },
        { title: "Website Banners", icon: "bx bx-image", path: "/notifications/banners", roles: [ROLES.ADMIN] },
        { title: "Newsletters", icon: "bx bx-envelope", path: "/notifications/newsletters", roles: [ROLES.ADMIN] }
    ]
},

/* PAYMENTS */

{
    title: "Payments",
    icon: "bx bx-credit-card",
    roles: [ROLES.ADMIN, ROLES.MANAGER],
    children: [
        { title: "Today's Payments", icon: "bx bx-wallet", path: "/payments/today", roles: [ROLES.ADMIN] },
        { title: "Store Payments", icon: "bx bx-store", path: "/payments/store", roles: [ROLES.MANAGER] },
        { title: "Customer Payments", icon: "bx bx-user", path: "/payments/customers", roles: [ROLES.ADMIN] },
        { title: "Cancelled / Refunded", icon: "bx bx-x-circle", path: "/payments/refunded", roles: [ROLES.ADMIN] },
        { title: "Driver's Payouts", icon: "bx bx-dollar", path: "/payments/payouts", roles: [ROLES.ADMIN] }
    ]
},

/* STATISTICS */

{
    title: "Statistics",
    icon: "bx bx-bar-chart",
    roles: [ROLES.ADMIN],
    children: [
        { title: "Today's Reports", icon: "bx bx-calendar", path: "/statistics/today", roles: [ROLES.ADMIN] },
        { title: "Stores Reports", icon: "bx bx-store", path: "/statistics/stores", roles: [ROLES.ADMIN] },
        { title: "Monthly Reports", icon: "bx bx-calendar-check", path: "/statistics/monthly", roles: [ROLES.ADMIN] },
        { title: "Customer Reports", icon: "bx bx-user", path: "/statistics/customers", roles: [ROLES.ADMIN] },
        { title: "Products Stats", icon: "bx bx-cube", path: "/statistics/products", roles: [ROLES.ADMIN] },
        { title: "Website Stats", icon: "bx bx-globe", path: "/statistics/website", roles: [ROLES.ADMIN] }
    ]
},

/* ADMIN USERS / STAFF */

{
    title: "Admin Users",
    icon: "bx bx-user-check",
    roles: [ROLES.ADMIN],
    children: [
        { title: "All Admin Users", icon: "bx bx-group", path: "/staff/all", roles: [ROLES.ADMIN] },
        { title: "Admin Roles", icon: "bx bx-shield", path: "/staff/roles", roles: [ROLES.ADMIN] }
    ]
},

/* WEBSITE CMS */

{
    title: "Website CMS",
    icon: "bx bx-globe",
    roles: [ROLES.ADMIN],
    children: [
        { title: "All Pages", icon: "bx bx-file", path: "/cms/pages", roles: [ROLES.ADMIN] },
        { title: "Main Menu", icon: "bx bx-menu", path: "/cms/menu", roles: [ROLES.ADMIN] },
        { title: "Footer", icon: "bx bx-list-ul", path: "/cms/footer", roles: [ROLES.ADMIN] },
        { title: "Blog", icon: "bx bx-news", path: "/cms/blog", roles: [ROLES.ADMIN] },
        { title: "Add New Page", icon: "bx bx-plus", path: "/cms/pages/add", roles: [ROLES.ADMIN] },
        { title: "Site Media", icon: "bx bx-image", path: "/cms/media", roles: [ROLES.ADMIN] }
    ]
},

/* SETTINGS */

{
    title: "Settings",
    icon: "bx bx-cog",
    path: "/settings",
    roles: [ROLES.ADMIN]
},

/* DRIVER EARNINGS (for delivery hero) */

{
    title: "Earnings",
    icon: "bx bx-dollar",
    roles: [ROLES.DELIVERY_HERO],
    children: [
        { title: "Current Earnings", icon: "bx bx-wallet", path: "/earnings", roles: [ROLES.DELIVERY_HERO] },
        { title: "Payout History", icon: "bx bx-history", path: "/payouts", roles: [ROLES.DELIVERY_HERO] }
    ]
}

];
