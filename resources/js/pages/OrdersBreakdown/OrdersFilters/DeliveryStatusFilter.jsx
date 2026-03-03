import React from "react";

import { DELIVERY_STATUS_OPTIONS } from "../ordersConstant";

const DeliveryStatusFilter = ({ value, onChange }) => {
    return (
        <div>
            <label className="form-label  fw-semibold text-muted">
                Delivery Status
            </label>

            <select
                className="form-select form-select-sm"
                value={value || ""}
                onChange={(e) => onChange("deliveryStatus", e.target.value)}
            >
                {DELIVERY_STATUS_OPTIONS?.map((item) => (
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DeliveryStatusFilter;