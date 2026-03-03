import React, { useEffect, useRef, useState } from "react";
import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";

import OrdersHeader from "./OrdersHeader";
import OrdersFilters from "./OrdersFilters";
import OrdersTable from "./OrdersTable";

import { DELIVERY_STATUS_ALL, SORT_LATEST } from "./ordersConstant";
// action
import { getOrders } from "../../store/e-commerce/actions";

const initialFilters = {
  sellerId: "",
  deliveryStatus: DELIVERY_STATUS_ALL,
  date_from: "",
  date_to: "",
  sortingQuery: SORT_LATEST,
};

const OrdersBreakdown = () => {
  const dispatch = useDispatch()
  const [filters, setFilters] = useState(initialFilters);
  const [query, setQuery] = useState({
    ...initialFilters,
    keyword: '',
  });
  const [keyword, setKeyword] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const ecommerceSelector = createSelector(
    state => state.ecommerce,
    ecommerce => ({
      allOrders: ecommerce.orders,
    })
  );
  const { allOrders } = useSelector(ecommerceSelector);

  useEffect(() => {
    setOrders(allOrders);
  }, [allOrders]);

  const queryRef = useRef(query);
  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  // 📡 Fetch orders whenever filters change
  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      ...filters,
      keyword: keyword,
    }))
    console.log("filters changes:", query)
  }, [filters, keyword]);
  // fetch orders data whenever filters change and render at first
  useEffect(() => {
    dispatch(getOrders(queryRef.current))
  }, [dispatch, filters])


  // 🔁 Handle filter change
  const handleFilterChange = (field, value) => {
    if (field === 'keyword') {
      setKeyword(value);
    } else {
      setFilters((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // 🔄 Reset filters
  const handleReset = () => {
    setFilters(initialFilters);
    setKeyword("");
  };

  // 👁 View order handler
  const handleViewOrder = (order) => {
    console.log("View order:", order);
  };

  return (
    <div className="page-content">

      <div className="container-fluid py-4">

        {/* Header */}
        <OrdersHeader total={orders?.length} />

        {/* Filters */}
        <OrdersFilters
          filters={query}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearch={(searchKeyword) => getOrders({ ...queryRef.current, keyword: searchKeyword })}
        />

        {/* Table */}
        <OrdersTable
          orders={orders}
          loading={loading}
          onView={handleViewOrder}
        />

      </div>
    </div>
  );
};

export default OrdersBreakdown;