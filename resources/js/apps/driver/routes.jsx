/**
 * Driver App - Routes for Delivery Hero role
 * Orders (available, completed), Earnings
 */

import React from "react";
import OrdersBreakdown from "../../pages/OrdersBreakdown";
import Login from "../../pages/Authentication/Login";
import Logout from "../../pages/Authentication/Logout";
import ForgetPwd from "../../pages/Authentication/ForgetPassword";
import Pages404 from "../../pages/Utility/pages-404";

export const driverPublicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
];

export const driverProtectedRoutes = [
  { path: "/", exact: true, component: <OrdersBreakdown /> },
  { path: "/orders/:subdomain", component: <OrdersBreakdown /> },
  { path: "/earnings", component: <OrdersBreakdown /> },
  { path: "/payouts", component: <OrdersBreakdown /> },
];

export { Pages404 };
