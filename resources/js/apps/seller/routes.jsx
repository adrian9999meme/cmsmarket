/**
 * Seller CMS - Routes for Seller, Manager roles
 * Dashboard, Orders (live, today, history), Stores (my), Products (all, add), Payments (store)
 */

import React from "react";
import Dashboard from "../../pages/Dashboard/index";
import StoresBreakdown from "../../pages/StoresBreakdown/index";
import ProductsBreakdown from "../../pages/ProductsBreakdown/index";
import OrdersBreakdown from "../../pages/OrdersBreakdown";
import Login from "../../pages/Authentication/Login";
import Logout from "../../pages/Authentication/Logout";
import ForgetPwd from "../../pages/Authentication/ForgetPassword";
import Register from "../../pages/Authentication/Register";
import ResetPassword from "../../pages/Authentication/ResetPassword";
import Pages404 from "../../pages/Utility/pages-404";
import Chat from "../../pages/Chat/Chat";

export const sellerPublicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
  { path: "/reset-password/:token", component: <ResetPassword /> },
];

export const sellerProtectedRoutes = [
  { path: "/", exact: true, component: <Dashboard /> },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/stores/:subdomain", component: <StoresBreakdown /> },
  { path: "/products/:subdomain?", component: <ProductsBreakdown /> },
  { path: "/orders/:subdomain", component: <OrdersBreakdown /> },
  { path: "/payments/:subdomain", component: <OrdersBreakdown /> },
  { path: "/chat", component: <Chat /> },
];

export { Pages404 };
