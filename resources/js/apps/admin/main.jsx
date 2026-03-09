/**
 * Admin CMS - Entry point
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import store from "../../store";
import AdminApp from "./App";
import "../../i18n";

if (document.getElementById("react-app")) {
  const root = ReactDOM.createRoot(document.getElementById("react-app"));
  root.render(
    <Provider store={store}>
      <BrowserRouter basename="/admin">
        <AdminApp />
      </BrowserRouter>
    </Provider>
  );
}
