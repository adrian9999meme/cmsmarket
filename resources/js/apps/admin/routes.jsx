/**
 * Admin CMS - Routes for Admin role only
 * Dashboard, Sellers, Stores, Products, Customers, Orders, Drivers, Payments, Trade Discounts, Support, Staff, Pages, etc.
 */

import React from "react";
import Dashboard from "../../pages/Dashboard/index";
import SellersBreakdown from "../../pages/SellersBreakdown/index";
import StoresBreakdown from "../../pages/StoresBreakdown/index";
import ProductsBreakdown from "../../pages/ProductsBreakdown/index";
import CustomersBreakdown from "../../pages/CustomersBreakdown/index";
import OrdersBreakdown from "../../pages/OrdersBreakdown";
import DriversBreakdown from "../../pages/DriversBeakdown";
import TradeDiscountsBreakdown from "../../pages/TradeDiscountsBreakdown";
import SupportBreakdown from "../../pages/SupportBreakdown";
import StaffBreakdown from "../../pages/StaffBreakdown";
import PagesBreakdown from "../../pages/PagesBreakdown";
import PaymentsBreakdown from "../../pages/PaymentsBreakdown";
import NotificationsBreakdown from "../../pages/NotificationsBreakdown";
import StatisticsBreakdown from "../../pages/StatisticsBreakdown";
import SettingsBreakdown from "../../pages/SettingsBreakdown";
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
  { path: "/payments/:subdomain", component: <PaymentsBreakdown /> },
  { path: "/trade-discounts/:subdomain", component: <TradeDiscountsBreakdown /> },
  { path: "/support/:subdomain", component: <SupportBreakdown /> },
  { path: "/staff/:subdomain", component: <StaffBreakdown /> },
  { path: "/cms/pages/add", component: <PagesBreakdown /> },
  { path: "/cms/:subdomain", component: <PagesBreakdown /> },
  { path: "/notifications/:subdomain", component: <NotificationsBreakdown /> },
  { path: "/statistics/:subdomain", component: <StatisticsBreakdown /> },
  { path: "/settings", component: <SettingsBreakdown /> },
];

export { Pages404 };
