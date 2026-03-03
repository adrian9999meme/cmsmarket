import React from "react";

import OrdersTableHeader from "./OrdersTableHeader";
import OrderTableRow from "./OrdersTableRow";
import LoadingState from "./LoadingState";
import EmptyState from "../EmptyState";
import { ORDERS_COLUMNS } from "../ordersConstant";

const OrdersTable = ({ orders = [], loading, onView }) => {
  console.log("orders:", orders)
  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle mb-0">
        
        {/* Header */}
        <OrdersTableHeader columns={ORDERS_COLUMNS} />

        <tbody>
          {loading ? (
            <LoadingState colSpan={9} />
          ) : orders?.length === 0 ? (
            <EmptyState colSpan={9} />
          ) : (
            orders?.map((order, index) => (
              <OrderTableRow
                key={order.id}
                order={order}
                index={index}
                onView={onView}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;