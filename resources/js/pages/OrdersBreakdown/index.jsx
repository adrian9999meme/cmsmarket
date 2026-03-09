import React, { useEffect, useRef, useState } from "react";
import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import OrdersHeader from "./OrdersHeader";
import OrdersFilters from "./OrdersFilters";
import OrdersTable from "./OrdersTable";

import { DELIVERY_STATUS_ALL, SORT_LATEST } from "./ordersConstant";
import { useRoleAwareFetch } from "../../hooks/useRoleAwareFetch";
import { getOrders } from "../../store/e-commerce/actions";

const initialFilters = {
  sellerId: "",
  deliveryStatus: DELIVERY_STATUS_ALL,
  date_from: "",
  date_to: "",
  sortingQuery: SORT_LATEST,
};

const OrdersBreakdown = () => {
  const dispatch = useDispatch();
  const { subdomain } = useParams();
  const { buildQuery } = useRoleAwareFetch();

  const [filters, setFilters] = useState(initialFilters);
  const [query, setQuery] = useState({
    ...initialFilters,
    keyword: "",
  });
  const [keyword, setKeyword] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const ecommerceSelector = createSelector(
    (state) => state.ecommerce,
    (state) => state.config?.appConfig,
    (ecommerce, appConfig) => ({
      allOrders: ecommerce.orders,
      sellerSystemEnabled: !!appConfig?.seller_system,
      sellers: ecommerce.sellers || [],
    })
  );
  const { allOrders, sellerSystemEnabled, sellers } = useSelector(ecommerceSelector);

  useEffect(() => {
    setOrders(allOrders);
  }, [allOrders]);

  const queryRef = useRef(query);
  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      ...filters,
      keyword,
    }));
  }, [filters, keyword]);

  // Role-aware fetch: merge role defaults with URL subdomain + filters
  useEffect(() => {
    const roleQuery = buildQuery("orders", {
      subdomain: subdomain || undefined,
      sellerId: queryRef.current.sellerId || undefined,
      deliveryStatus: queryRef.current.deliveryStatus !== DELIVERY_STATUS_ALL ? queryRef.current.deliveryStatus : undefined,
      date_from: queryRef.current.date_from || undefined,
      date_to: queryRef.current.date_to || undefined,
      sortingQuery: queryRef.current.sortingQuery || undefined,
      keyword: queryRef.current.keyword || undefined,
    });
    dispatch(getOrders(roleQuery));
  }, [dispatch, filters, subdomain, buildQuery, keyword]);


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
          onSearch={(searchKeyword) => {
            const roleQuery = buildQuery("orders", {
              ...queryRef.current,
              keyword: searchKeyword,
            });
            dispatch(getOrders(roleQuery));
          }}
          sellers={sellers}
        />

        {/* Table */}
        <OrdersTable
          orders={orders}
          loading={loading}
          onView={handleViewOrder}
          sellerSystemEnabled={sellerSystemEnabled}
        />

      </div>
    </div>
  );
};

export default OrdersBreakdown;