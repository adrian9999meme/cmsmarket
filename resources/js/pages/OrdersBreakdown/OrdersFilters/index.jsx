import React from "react";
import { useSelector } from "react-redux";

import SellerFilter from "./SellerFilter";
import DeliveryStatusFilter from "./DeliveryStatusFilter";
import DateRangeFilter from "./DateRangeFilter";
import SortFilter from "./SortFilter";
import SearchFilter from "./SearchFilter";

const OrdersFilters = ({ filters, onChange, onReset, onSearch, sellers = [] }) => {
    const sellerSystemEnabled = !!useSelector((state) => state.config?.appConfig?.seller_system);

    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-body">

                {/* ROW 1 */}
                <div className="row g-3 mb-3">
                    {sellerSystemEnabled && (
                        <div className="col-md-4">
                            <SellerFilter
                                value={filters.sellerId}
                                onChange={onChange}
                                sellers={sellers}
                            />
                        </div>
                    )}

                    <div className="col-md-4">
                        <DeliveryStatusFilter
                            value={filters.deliveryStatus}
                            onChange={onChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <SortFilter
                            value={filters.sortingQuery}
                            onChange={onChange}
                        />
                    </div>
                </div>

                {/* ROW 2 */}
                <div className="row g-3 align-items-end justify-content-between">

                    {/* Left Side: Search */}
                    <div className="col-md-5">
                        <div className="">
                            <SearchFilter
                                value={filters.keyword}
                                onChange={onChange}
                                onKeyDown={onSearch}
                            />
                        </div>
                    </div>

                    {/* Right Side: Date Filter */}
                    <div className="col-md-4">
                        <DateRangeFilter
                            filters={filters}
                            onChange={onChange}
                        />
                    </div>

                    {/* Reset filters*/}
                    <div className="col-md-3">
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm w-100"
                            onClick={onReset}
                        >
                            Reset
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrdersFilters;