import React from "react";

import { SORT_FILTER_OPTIONS } from "../ordersConstant";

const SortFilter = ({ value, onChange }) => {
    return (
        <div>
            <label className="form-label  fw-semibold text-muted">
                Sort By
            </label>

            <div className="input-group input-group-sm">
                <span className="input-group-text bg-light">
                    <i className="bi bi-sort-down"></i>
                </span>

                <select
                    className="form-select"
                    value={value || "latest"}
                    onChange={(e) => onChange("sortingQuery", e.target.value)}
                >
                    {SORT_FILTER_OPTIONS?.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SortFilter;