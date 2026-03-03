import React from "react";

const OrdersHeader = ({ total }) => {
  return (
    <div className="mb-4">
      <div className="d-flex align-items-center gap-2 mb-1">
        <span
          className="bg-primary rounded-pill"
          style={{ width: "28px", height: "4px" }}
        ></span>
        <h4 className="mb-0 fw-semibold">All Orders</h4>
      </div>

      <p className="text-muted mb-0">
        You have total <strong>{total}</strong> orders
      </p>
    </div>
  );
};

export default OrdersHeader;