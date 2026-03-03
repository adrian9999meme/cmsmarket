// sort options
export const SORT_LATEST = "latest";
export const SORT_OLDEST = "oldest";

export const SORT_PRICE_LOW = "price_low";
export const SORT_PRICE_HIGH = "price_high";

export const SORT_TOTAL_PRODUCT_LOW = "total_product_low";
export const SORT_TOTAL_PRODUCT_HIGH = "total_product_high";

export const SORT_FILTER_OPTIONS = [
    {
        value: SORT_LATEST,
        label: "Latest On Top",
    },
    {
        value: SORT_OLDEST,
        label: "Oldest On Top",
    },
    {
        value: SORT_PRICE_LOW,
        label: "Price: High → Low",
    },
    {
        value: SORT_PRICE_HIGH,
        label: "Price: Low → High",
    },
    {
        value: SORT_TOTAL_PRODUCT_LOW,
        label: "Total Product: High → Low",
    },
    {
        value: SORT_TOTAL_PRODUCT_HIGH,
        label: "Total Product: Low → High",
    },
];

// delivery status
export const DELIVERY_STATUS_ALL = "all";
export const DELIVERY_STATUS_PENDING = "pending";
export const DELIVERY_STATUS_CONFIRMED = "confirmed";
export const DELIVERY_STATUS_PICKED_UP = "picked_up";
export const DELIVERY_STATUS_ON_THE_WAY = "on_the_way";
export const DELIVERY_STATUS_DELIVERED = "delivered";
export const DELIVERY_STATUS_CANCELED = "canceled";

export const DELIVERY_STATUS_OPTIONS = [
    {
        value: DELIVERY_STATUS_ALL,
        label: "All",
    },
    {
        value: DELIVERY_STATUS_PENDING,
        label: "Pending",
    },
    {
        value: DELIVERY_STATUS_CONFIRMED,
        label: "Confirmed",
    },
    {
        value: DELIVERY_STATUS_PICKED_UP,
        label: "Picked Up",
    },
    {
        value: DELIVERY_STATUS_ON_THE_WAY,
        label: "On The Way",
    },
    {
        value: DELIVERY_STATUS_DELIVERED,
        label: "Delivered",
    },
    {
        value: DELIVERY_STATUS_CANCELED,
        label: "Canceled",
    },
];

export const ORDERS_COLUMNS = [
    { key: "index", label: "#", className: "text-center" },
    { key: "order_code", label: "Order Code", sortable: true },
    { key: "seller", label: "Seller" },
    { key: "customer", label: "Customer" },
    { key: "total_product", label: "Total Product", sortable: true },
    { key: "total_price", label: "Total Price", sortable: true },
    { key: "delivery_status", label: "Delivery Status" },
    { key: "payment_status", label: "Payment Status" },
    { key: "options", label: "Options", className: "text-center" },
];