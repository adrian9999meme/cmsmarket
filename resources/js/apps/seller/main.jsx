/**
 * Seller CMS - Entry point
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import store from "../../store";
import SellerApp from "./App";
import "../../i18n";
import { getBasePath } from "../../config/routeConfig";

if (document.getElementById("react-app")) {
  const root = ReactDOM.createRoot(document.getElementById("react-app"));
  root.render(
    <Provider store={store}>
      <BrowserRouter basename={getBasePath("/seller")}>
        <SellerApp />
      </BrowserRouter>
    </Provider>
  );
}
