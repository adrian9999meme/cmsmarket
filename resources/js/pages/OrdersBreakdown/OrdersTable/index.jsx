import React from "react";

import OrdersTableHeader from "./OrdersTableHeader";
import OrderTableRow from "./OrdersTableRow";
import LoadingState from "./LoadingState";
import EmptyState from "../EmptyState";
import { ORDERS_COLUMNS } from "../ordersConstant";

const OrdersTable = ({ orders = [], loading, onView, sellerSystemEnabled = false }) => {
  const columns = sellerSystemEnabled
    ? ORDERS_COLUMNS
    : ORDERS_COLUMNS.filter((col) => col.key !== "seller");
  const colSpan = columns.length;

  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle mb-0">
        <OrdersTableHeader columns={columns} />
        <tbody>
          {loading ? (
            <LoadingState colSpan={colSpan} />
          ) : orders?.length === 0 ? (
            <EmptyState colSpan={colSpan} />
          ) : (
            orders?.map((order, index) => (
              <OrderTableRow
                key={order.id}
                order={order}
                index={index}
                onView={onView}
                sellerSystemEnabled={sellerSystemEnabled}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;