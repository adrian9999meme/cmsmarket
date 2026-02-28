import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Row, Col, Collapse } from "reactstrap";
import { Link } from "react-router-dom";
import withRouter from "../Common/withRouter";
import classname from "classnames";

//i18n
import { withTranslation } from "react-i18next";

import { connect } from "react-redux";

const Navbar = props => {

  const [ui, setui] = useState(false);
  const [app, setapp] = useState(false);
  const [email, setemail] = useState(false);
  const [ecommerce, setecommerce] = useState(false);
  const [crypto, setcrypto] = useState(false);
  const [project, setproject] = useState(false);
  const [task, settask] = useState(false);
  const [contact, setcontact] = useState(false);
  const [blog, setBlog] = useState(false);
  const [job, setJob] = useState(false);
  const [candidate, setCandidate] = useState(false);
  const [component, setcomponent] = useState(false);
  const [form, setform] = useState(false);
  const [table, settable] = useState(false);
  const [chart, setchart] = useState(false);
  const [icon, seticon] = useState(false);
  const [map, setmap] = useState(false);
  const [extra, setextra] = useState(false);
  const [invoice, setinvoice] = useState(false);
  const [auth, setauth] = useState(false);
  const [utility, setutility] = useState(false);

  useEffect(() => {
    var matchingMenuItem = null;
    var ul = document.getElementById("navigation");
    var items = ul.getElementsByTagName("a");
    removeActivation(items);
    for (var i = 0; i < items.length; ++i) {
      if (window.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  });

  const removeActivation = items => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;
      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        if (parent.classList.contains("active")) {
          parent.classList.remove("active");
        }
      }
    }
  };

  function activateParentDropdown(item) {
    item.classList.add("active");
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add("active"); // li
      const parent2 = parent.parentElement;
      parent2.classList.add("active"); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add("active"); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add("active"); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("active"); // li
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add("active"); // li
            }
          }
        }
      }
    }
    return false;
  }


  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">

                {/* Dashboard */}
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    <i className="bx bx-home-circle me-2"></i>
                    {props.t("Dashboard")}
                  </Link>
                </li>

                {/* Orders */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="ordersDropdown" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                    <i className="bx bx-package me-2" />{props.t("Orders")}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="ordersDropdown">
                    <li><Link className="dropdown-item" to="/orders/live"><i className="bx bx-bolt-circle me-2" />{props.t("Live Orders")}</Link></li>
                    <li><Link className="dropdown-item" to="/orders/today"><i className="bx bx-calendar-star me-2" />{props.t("Today's Orders")}</Link></li>
                    <li><Link className="dropdown-item" to="/orders/all"><i className="bx bx-list-ul me-2" />{props.t("All Orders")}</Link></li>
                    <li><Link className="dropdown-item" to="/orders/unresolved"><i className="bx bx-error me-2" />{props.t("Unresolved")}</Link></li>
                    <li><Link className="dropdown-item" to="/orders/cancelled"><i className="bx bx-block me-2" />{props.t("Cancelled")}</Link></li>
                  </ul>
                </li>

                {/* Sellers */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="sellersDropdown" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                    <i className="bx bx-user-voice me-2" />{props.t("Sellers")}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="sellersDropdown">
                    <li><Link className="dropdown-item" to="/sellers/all"><i className="bx bx-store-alt me-2" />{props.t("All Sellers")}</Link></li>
                    <li><Link className="dropdown-item" to="/sellers/pending"><i className="bx bx-time me-2" />{props.t("Pending Approvals")}</Link></li>
                    <li><Link className="dropdown-item" to="/sellers/blocked"><i className="bx bx-block me-2" />{props.t("Blocked Sellers")}</Link></li>
                    <li><Link className="dropdown-item" to="/sellers/add"><i className="bx bx-plus-circle me-2" />{props.t("Add New Seller")}</Link></li>
                  </ul>
                </li>

                {/* Stores */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="storesDropdown" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                    <i className="bx bx-store me-2" />{props.t("Stores")}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="storesDropdown">
                    <li><Link className="dropdown-item" to="/stores/all"><i className="bx bx-store me-2" />{props.t("All Stores")}</Link></li>
                    <li><Link className="dropdown-item" to="/stores/active"><i className="bx bx-check-circle me-2" />{props.t("Active Stores")}</Link></li>
                    <li><Link className="dropdown-item" to="/stores/blocked"><i className="bx bx-block me-2" />{props.t("Blocked Stores")}</Link></li>
                    <li><Link className="dropdown-item" to="/stores/pending"><i className="bx bx-time me-2" />{props.t("Pending Approvals")}</Link></li>
                    <li><Link className="dropdown-item" to="/stores/add"><i className="bx bx-plus-circle me-2" />{props.t("Add New Store")}</Link></li>
                    <li><Link className="dropdown-item" to="/stores/discounts"><i className="bx bx-purchase-tag me-2" />{props.t("Store Discounts")}</Link></li>
                  </ul>
                </li>

                {/* Products */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="productsDropdown" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                    <i className="bx bx-cube me-2" />{props.t("Products")}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="productsDropdown">
                    <li><Link className="dropdown-item" to="/products/all"><i className="bx bx-cube me-2" />{props.t("All Products")}</Link></li>
                    <li><Link className="dropdown-item" to="/products/xcell-csv"><i className="bx bx-spreadsheet me-2" />{props.t("Xcell / CSV")}</Link></li>
                    <li><Link className="dropdown-item" to="/products/categories"><i className="bx bx-category me-2" />{props.t("Categories")}</Link></li>
                    <li><Link className="dropdown-item" to="/products/media"><i className="bx bx-photo-album me-2" />{props.t("Media Files")}</Link></li>
                    <li><Link className="dropdown-item" to="/products/add"><i className="bx bx-plus-circle me-2" />{props.t("Add New Products")}</Link></li>
                  </ul>
                </li>

                {/* Customers */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="customersDropdown" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                    <i className="bx bx-user-circle me-2" />{props.t("Customers")}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="customersDropdown">
                    <li><Link className="dropdown-item" to="/customers/all"><i className="bx bx-user me-2" />{props.t("Customers")}</Link></li>
                    <li><Link className="dropdown-item" to="/customers/trades-men"><i className="bx bx-male me-2" />{props.t("Trades Men")}</Link></li>
                    <li><Link className="dropdown-item" to="/customers/trades-discounts"><i className="bx bx-purchase-tag-alt me-2" />{props.t("Trades Discounts")}</Link></li>
                    <li><Link className="dropdown-item" to="/customers/add"><i className="bx bx-plus-circle me-2" />{props.t("Add New Customer")}</Link></li>
                    <li><Link className="dropdown-item" to="/customers/blocked"><i className="bx bx-block me-2" />{props.t("Blocked Customers")}</Link></li>
                  </ul>
                </li>

                {/* Drivers */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="driversDropdown" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                    <i className="bx bx-car me-2" />{props.t("Drivers")}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="driversDropdown">
                    <li><Link className="dropdown-item" to="/drivers/online"><i className="bx bx-wifi me-2" />{props.t("Drivers Online")}</Link></li>
                    <li><Link className="dropdown-item" to="/drivers/all"><i className="bx bx-id-card me-2" />{props.t("All Drivers")}</Link></li>
                    <li><Link className="dropdown-item" to="/drivers/earnings"><i className="bx bx-money me-2" />{props.t("Earnings & Payouts")}</Link></li>
                    <li><Link className="dropdown-item" to="/drivers/pending"><i className="bx bx-time me-2" />{props.t("Pending Approvals")}</Link></li>
                    <li><Link className="dropdown-item" to="/drivers/blocked"><i className="bx bx-block me-2" />{props.t("Blocked Drivers")}</Link></li>
                    <li><Link className="dropdown-item" to="/drivers/add"><i className="bx bx-plus-circle me-2" />{props.t("Add New Driver")}</Link></li>
                    <li><Link className="dropdown-item" to="/drivers/app"><i className="bx bx-mobile-alt me-2" />{props.t("Driver App")}</Link></li>
                    <li><Link className="dropdown-item" to="/drivers/support"><i className="bx bx-support me-2" />{props.t("Driver Support")}</Link></li>
                  </ul>
                </li>

                {/* Support */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="supportDropdown" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                    <i className="bx bx-support me-2" />{props.t("Support")}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="supportDropdown">
                    <li><Link className="dropdown-item" to="/support/urgent"><i className="bx bx-error-circle me-2" />{props.t("Urgent Tickets")}</Link></li>
                    <li><Link className="dropdown-item" to="/support/customers"><i className="bx bx-user me-2" />{props.t("Customer Tickets")}</Link></li>
                    <li><Link className="dropdown-item" to="/support/stores"><i className="bx bx-store me-2" />{props.t("Stores Tickets")}</Link></li>
                    <li><Link className="dropdown-item" to="/support/drivers"><i className="bx bx-car me-2" />{props.t("Drivers Tickets")}</Link></li>
                  </ul>
                </li>

                {/* Notifications */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="notificationsDropdown" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                    <i className="bx bx-notification me-2" />{props.t("Notifications")}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="notificationsDropdown">
                    <li><Link className="dropdown-item" to="/notifications/website-info"><i className="bx bx-info-circle me-2" />{props.t("Website Info")}</Link></li>
                    <li><Link className="dropdown-item" to="/notifications/banners"><i className="bx bx-image me-2" />{props.t("Website Banners")}</Link></li>
                    <li><Link className="dropdown-item" to="/notifications/newsletters"><i className="bx bx-mail-send me-2" />{props.t("Newsletters")}</Link></li>
                  </ul>
                </li>

                {/* Payments */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="paymentsDropdown" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                    <i className="bx bx-credit-card me-2" />{props.t("Payments")}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="paymentsDropdown">
                    <li><Link className="dropdown-item" to="/payments/today"><i className="bx bx-calendar-star me-2" />{props.t("Today's payments")}</Link></li>
                    <li><Link className="dropdown-item" to="/payments/customers"><i className="bx bx-user me-2" />{props.t("Customer Payments")}</Link></li>
                    <li><Link className="dropdown-item" to="/payments/cancelled"><i className="bx bx-block me-2" />{props.t("Cancelled / Refunded")}</Link></li>
                    <li><Link className="dropdown-item" to="/payments/customer-invoices"><i className="bx bx-file me-2" />{props.t("Customer Invoices")}</Link></li>
                    <li><Link className="dropdown-item" to="/payments/stores"><i className="bx bx-store me-2" />{props.t("Store Payments")}</Link></li>
                    <li><Link className="dropdown-item" to="/payments/stores-history"><i className="bx bx-history me-2" />{props.t("Store Payments History")}</Link></li>
                    <li><Link className="dropdown-item" to="/payments/store-invoices"><i className="bx bx-file me-2" />{props.t("Store Invoices")}</Link></li>
                    <li><Link className="dropdown-item" to="/payments/drivers"><i className="bx bx-car me-2" />{props.t("Driver's Payouts")}</Link></li>
                    <li><Link className="dropdown-item" to="/payments/drivers-history"><i className="bx bx-history me-2" />{props.t("Driver's Payouts History")}</Link></li>
                    <li><Link className="dropdown-item" to="/payments/driver-invoices"><i className="bx bx-file me-2" />{props.t("Driver's Invoices")}</Link></li>
                    <li><Link className="dropdown-item" to="/payments/make-online"><i className="bx bx-dollar-circle me-2" />{props.t("Make Online Payment")}</Link></li>
                  </ul>
                </li>

                {/* Statistics */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="statisticsDropdown" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                    <i className="bx bx-bar-chart-alt me-2" />{props.t("Statistics")}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="statisticsDropdown">
                    <li><Link className="dropdown-item" to="/statistics/today"><i className="bx bx-calendar-check me-2" />{props.t("Today's Reports")}</Link></li>
                    <li><Link className="dropdown-item" to="/statistics/stores"><i className="bx bx-store me-2" />{props.t("Stores Reports")}</Link></li>
                    <li><Link className="dropdown-item" to="/statistics/monthly"><i className="bx bx-calendar me-2" />{props.t("Monhtly Reports")}</Link></li>
                    <li><Link className="dropdown-item" to="/statistics/customer"><i className="bx bx-user me-2" />{props.t("Customer Reports")}</Link></li>
                    <li><Link className="dropdown-item" to="/statistics/products"><i className="bx bx-package me-2" />{props.t("Products Stats")}</Link></li>
                    <li><Link className="dropdown-item" to="/statistics/website"><i className="bx bx-globe me-2" />{props.t("Website Stats")}</Link></li>
                  </ul>
                </li>

                {/* Admin Users */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="adminUsersDropdown" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                    <i className="bx bx-user-circle me-2" />{props.t("Admin Users")}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="adminUsersDropdown">
                    <li><Link className="dropdown-item" to="/admin-users/all"><i className="bx bx-user me-2" />{props.t("All Admin Users")}</Link></li>
                    <li><Link className="dropdown-item" to="/admin-users/roles"><i className="bx bx-id-card me-2" />{props.t("Admin Roles")}</Link></li>
                  </ul>
                </li>

                {/* Website CMS */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="websiteCMSDropdown" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                    <i className="bx bx-world me-2" />{props.t("Website CMS")}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="websiteCMSDropdown">
                    <li><Link className="dropdown-item" to="/website-cms/pages"><i className="bx bx-file me-2" />{props.t("All Pages")}</Link></li>
                    <li><Link className="dropdown-item" to="/website-cms/main-menu"><i className="bx bx-menu me-2" />{props.t("Main Menu")}</Link></li>
                    <li><Link className="dropdown-item" to="/website-cms/footer"><i className="bx bx-underline me-2" />{props.t("Footer")}</Link></li>
                    <li><Link className="dropdown-item" to="/website-cms/blog"><i className="bx bx-news me-2" />{props.t("Blog")}</Link></li>
                    <li><Link className="dropdown-item" to="/website-cms/add-page"><i className="bx bx-plus-circle me-2" />{props.t("Add New Page")}</Link></li>
                    <li><Link className="dropdown-item" to="/website-cms/media"><i className="bx bx-photo-album me-2" />{props.t("Site Media")}</Link></li>
                  </ul>
                </li>

                {/* Settings */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="settingsDropdown" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                    <i className="bx bx-cog me-2" />{props.t("Settings")}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="settingsDropdown">
                    <li><Link className="dropdown-item" to="/settings/pricing"><i className="bx bx-calculator me-2" />{props.t("Pricing Formula")}</Link></li>
                    <li><Link className="dropdown-item" to="/settings/server-info"><i className="bx bx-server me-2" />{props.t("Server Info")}</Link></li>
                    <li><Link className="dropdown-item" to="/settings/logs"><i className="bx bx-file me-2" />{props.t("Logs")}</Link></li>
                    <li><Link className="dropdown-item" to="/settings/maintenance"><i className="bx bx-wrench me-2" />{props.t("Maintenance")}</Link></li>
                    <li><Link className="dropdown-item" to="/settings/backup"><i className="bx bx-save me-2" />{props.t("System Backup")}</Link></li>
                  </ul>
                </li>
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  );
};

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = state => {
  const { leftMenu } = state.Layout;
  return { leftMenu };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
);
