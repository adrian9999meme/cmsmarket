/**
 * Admin CMS - Routes for Admin role only
 * Dashboard, Sellers, Stores, Products, Customers, Orders, Drivers, Payments, Trade Discounts
 */

import React from "react";
import Dashboard from "../../pages/Dashboard/index";
import SellersBreakdown from "../../pages/SellersBreakdown/index";
import StoresBreakdown from "../../pages/StoresBreakdown/index";
import ProductsBreakdown from "../../pages/ProductsBreakdown/index";
import CustomersBreakdown from "../../pages/CustomersBreakdown/index";
import OrdersBreakdown from "../../pages/OrdersBreakdown";
import DriversBreakdown from "../../pages/DriversBeakdown";
import Login from "../../pages/Authentication/Login";
import Logout from "../../pages/Authentication/Logout";
import ForgetPwd from "../../pages/Authentication/ForgetPassword";
import Register from "../../pages/Authentication/Register";
import ResetPassword from "../../pages/Authentication/ResetPassword";
import Pages404 from "../../pages/Utility/pages-404";

export const adminPublicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
  { path: "/reset-password/:token", component: <ResetPassword /> },
];

export const adminProtectedRoutes = [
  { path: "/", exact: true, component: <Dashboard /> },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/sellers/:subdomain", component: <SellersBreakdown /> },
  { path: "/stores/:subdomain", component: <StoresBreakdown /> },
  { path: "/products/:subdomain?", component: <ProductsBreakdown /> },
  { path: "/customers/:subdomain", component: <CustomersBreakdown /> },
  { path: "/orders/:subdomain", component: <OrdersBreakdown /> },
  { path: "/drivers/:subdomain", component: <DriversBreakdown /> },
  { path: "/payments/:subdomain", component: <OrdersBreakdown /> },
  { path: "/trade-discounts/:subdomain", component: <CustomersBreakdown /> },
];

export { Pages404 };
