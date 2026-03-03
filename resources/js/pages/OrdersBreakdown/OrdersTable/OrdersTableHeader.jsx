import React from "react";

const OrdersTableHeader = ({ columns, onSort, sortKey, sortDirection }) => {
  return (
    <thead className="table-light">
      <tr>
        {columns?.map((col, index) => (
          <th
            key={index}
            className={`align-middle ${col.className || ""}`}
            style={{ cursor: col.sortable ? "pointer" : "default" }}
            onClick={() => col.sortable && onSort && onSort(col.key)}
          >
            <div className="d-flex align-items-center gap-1">
              {col.label}

              {/* Optional sort indicator */}
              {col.sortable && sortKey === col.key && (
                <i
                  className={`bi ${
                    sortDirection === "asc"
                      ? "bi-arrow-up"
                      : "bi-arrow-down"
                  }`}
                />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default OrdersTableHeader;