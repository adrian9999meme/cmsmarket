import React from "react";

const OrderTableRow = ({ order, index, onView }) => {
    return (
        <tr className="align-middle">
            {/* Index */}
            <td className="text-center fw-semibold">
                {index + 1}
            </td>

            {/* Order Code */}
            <td>
                <span className="fw-semibold text-dark">
                    #{order.order_code}
                </span>
            </td>

            {/* Seller */}
            <td>
                <div className="fw-medium">
                    {order.seller_name}
                </div>
            </td>

            {/* Customer */}
            <td>
                <div className="fw-medium">
                    {order.customer_name}
                </div>
            </td>

            {/* Total Product */}
            <td className="text-center">
                <span className="badge bg-light text-dark border">
                    {order.total_product}
                </span>
            </td>

            {/* Total Price */}
            <td className="fw-semibold text-success">
                £{Number(order.total_price).toFixed(2)}
            </td>

            {/* Delivery Status */}
            <td>
                <span
                    className={`badge ${order.delivery_status === "delivered"
                            ? "bg-success"
                            : order.delivery_status === "canceled"
                                ? "bg-danger"
                                : order.delivery_status === "on_the_way"
                                    ? "bg-warning text-dark"
                                    : "bg-secondary"
                        }`}
                >
                    {order.delivery_status}
                </span>
            </td>

            {/* Payment Status */}
            <td>
                <span
                    className={`badge ${order.payment_status === "paid"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                >
                    {order.payment_status}
                </span>
            </td>

            {/* Options */}
            <td className="text-center">
                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onView(order)}
                >
                    View
                </button>
            </td>
        </tr>
    );
};

export default OrderTableRow;