import React, { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import withRouter from "../Common/withRouter";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

const SidebarContent = props => {
  const ref = useRef();
  const menuInstance = useRef(null);
  const prevActiveItem = useRef(null);

  // Set the default focused item path here. Use a valid route path.
  const DEFAULT_PATH = "/dashboard";

  // Helper to activate the focused menu and parents, and expand
  const activateMenuItem = useCallback(item => {
    if (!item) return;
    // Remove previous activation if changed
    if (prevActiveItem.current && prevActiveItem.current !== item) {
      deactivateMenuItem(prevActiveItem.current);
    }
    // If already active, don't collapse/expand again
    if (item.classList.contains("active")) return;
    // Activate the menu item and parent structure
    item.classList.add("active");
    let parent = item.parentElement;
    while (parent && parent.getAttribute("id") !== "side-menu") {
      if (parent.tagName === "LI") parent.classList.add("mm-active");
      if (parent.tagName === "UL") parent.classList.add("mm-show");
      parent = parent.parentElement;
    }
    // Save current active item
    prevActiveItem.current = item;
    scrollElement(item);
  }, []);

  // Helper to deactivate an activated menu item and all its parents
  const deactivateMenuItem = (item) => {
    if (!item) return;
    // Remove active from item and all parent <li> and expand from <ul>
    let parent = item.parentElement;
    item.classList.remove("active");
    while (parent && parent.getAttribute("id") !== "side-menu") {
      if (parent.tagName === "LI") parent.classList.remove("mm-active");
      if (parent.tagName === "UL") parent.classList.remove("mm-show");
      parent = parent.parentElement;
    }
  };

  // Find menu item matching the pathname
  const path = useLocation();

  // This function now accepts an explicit path to fallback to, if the current path doesn't match any menu item
  const activeMenu = useCallback(
    (useDefault = false) => {
      // If not overriding, use the location path
      // If using the default, use DEFAULT_PATH instead
      const pathName = useDefault ? DEFAULT_PATH : path.pathname;
      const ul = document.getElementById("side-menu");
      if (!ul) return;

      const items = ul.getElementsByTagName("a");
      let matchingMenuItem = null;

      // Fix to ensure MetisMenu works with react-router Link:
      // Instead of using pathname, use getAttribute("href") for comparison
      // React-router 'to' prop will set href (may include a leading /)
      for (let i = 0; i < items.length; ++i) {
        let linkHref = items[i].getAttribute("href");
        let cleanedPathName = pathName.split("?")[0].split("#")[0];
        if (
          linkHref &&
          (linkHref === cleanedPathName ||
            linkHref === window.location.origin + cleanedPathName)
        ) {
          matchingMenuItem = items[i];
          break;
        }
        if (
          linkHref &&
          (cleanedPathName.endsWith(linkHref) ||
            linkHref.endsWith(cleanedPathName))
        ) {
          matchingMenuItem = items[i];
          break;
        }
      }

      if (matchingMenuItem) {
        activateMenuItem(matchingMenuItem);
        return true; // found and activated
      } else if (prevActiveItem.current) {
        deactivateMenuItem(prevActiveItem.current);
        prevActiveItem.current = null;
      }
      return false;
    },
    [path.pathname, activateMenuItem]
  );

  useEffect(() => {
    if (ref.current && ref.current.recalculate) ref.current.recalculate();
  }, []);

  useEffect(() => {
    if (menuInstance.current) {
      menuInstance.current.dispose && menuInstance.current.dispose();
      menuInstance.current = null;
    }
    menuInstance.current = new MetisMenu("#side-menu");
    // Set the active menu item, and fall back to default if none matches.
    // Try to activate the current path; if not, activate the default
    const activated = activeMenu(false);
    if (!activated) {
      // Select the default only on initial mount, not on every path change
      activeMenu(true);
    }
    // Clean up MetisMenu
    return () => {
      if (menuInstance.current && menuInstance.current.dispose) {
        menuInstance.current.dispose();
        menuInstance.current = null;
      }
    };
    // eslint-disable-next-line
  }, []); // Only run once on mount

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const activated = activeMenu(false);
    // Whenever the path changes and no path matches, also fall back to default (if it's not the current path already)
    if (!activated && path.pathname !== DEFAULT_PATH) {
      activeMenu(true);
    }
  }, [activeMenu, path.pathname]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")}</li>

            <li>
              <Link to="/dashboard">
                <i className="bx bx-home-circle"></i>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-user-voice"></i>
                <span>{props.t("Sellers")}</span>
              </a>
              <ul className="sub-menu">
                <li>
                  <Link to="/sellers/all">
                    <i className="bx bx-store-alt"></i> {props.t("All Sellers")}
                  </Link>
                </li>
                <li>
                  <Link to="/sellers/pending">
                    <i className="bx bx-time"></i> {props.t("Pending Approvals")}
                  </Link>
                </li>
                <li>
                  <Link to="/sellers/blocked">
                    <i className="bx bx-block"></i> {props.t("Blocked Sellers")}
                  </Link>
                </li>
                <li>
                  <Link to="/sellers/add">
                    <i className="bx bx-plus-circle"></i> {props.t("Add New Seller")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-store"></i>
                <span>{props.t("Stores")}</span>
              </a>
              <ul className="sub-menu">
                <li>
                  <Link to="/stores/all">
                    <i className="bx bx-store"></i> {props.t("All Stores")}
                  </Link>
                </li>
                <li><Link to="/stores/active"><i className="bx bx-check-circle"></i> {props.t("Active Stores")}</Link></li>
                <li><Link to="/stores/blocked"><i className="bx bx-block"></i> {props.t("Blocked Stores")}</Link></li>
                <li><Link to="/stores/pending"><i className="bx bx-time"></i> {props.t("Pending Approvals")}</Link></li>
                <li><Link to="/stores/add"><i className="bx bx-plus-circle"></i> {props.t("Add New Store")}</Link></li>
                <li><Link to="/stores/discounts"><i className="bx bx-purchase-tag"></i> {props.t("Store Discounts")}</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-user-circle"></i>
                <span>{props.t("Customers")}</span>
              </a>
              <ul className="sub-menu">
                <li>
                  <Link to="/customers/all">
                    <i className="bx bx-user"></i> {props.t("Customers")}
                  </Link>
                </li>
                <li><Link to="/customers/trades-men"><i className="bx bx-male"></i> {props.t("Trades Men")}</Link></li>
                <li><Link to="/customers/trades-discounts"><i className="bx bx-purchase-tag-alt"></i> {props.t("Trades Discounts")}</Link></li>
                <li><Link to="/customers/add"><i className="bx bx-plus-circle"></i> {props.t("Add New Customer")}</Link></li>
                <li><Link to="/customers/blocked"><i className="bx bx-block"></i> {props.t("Blocked Customers")}</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-cube"></i>
                <span>{props.t("Products")}</span>
              </a>
              <ul className="sub-menu">
                <li>
                  <Link to="/products/all">
                    <i className="bx bx-cube"></i> {props.t("All Products")}
                  </Link>
                </li>
                <li>
                  <Link to="/products/xcell-csv">
                    <i className="bx bx-spreadsheet"></i> {props.t("Xcell / CSV")}
                  </Link>
                </li>
                <li>
                  <Link to="/products/categories">
                    <i className="bx bx-category"></i> {props.t("Categories")}
                  </Link>
                </li>
                <li>
                  <Link to="/products/media">
                    <i className="bx bx-photo-album"></i> {props.t("Media Files")}
                  </Link>
                </li>
                <li>
                  <Link to="/products/add">
                    <i className="bx bx-plus-circle"></i> {props.t("Add New Products")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-package"></i>
                <span>{props.t("Orders")}</span>
              </a>
              <ul className="sub-menu">
                <li>
                  <Link to="/orders/all">
                    <i className="bx bx-list-ul"></i> {props.t("All Orders")}
                  </Link>
                </li>
                <li>
                  <Link to="/orders/live">
                    <i className="bx bx-bolt-circle"></i> {props.t("Live Orders")}
                  </Link>
                </li>
                <li>
                  <Link to="/orders/today">
                    <i className="bx bx-calendar-check"></i> {props.t("Today's Orders")}
                  </Link>
                </li>
                <li>
                  <Link to="/orders/unresolved">
                    <i className="bx bx-error"></i> {props.t("Unresolved")}
                  </Link>
                </li>
                <li>
                  <Link to="/orders/cancelled">
                    <i className="bx bx-block"></i> {props.t("Cancelled")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-car"></i>
                <span>{props.t("Drivers")}</span>
              </a>
              <ul className="sub-menu">
                <li>
                  <Link to="/drivers/all">
                    <i className="bx bx-id-card"></i> {props.t("All Drivers")}
                  </Link>
                </li>
                <li>
                  <Link to="/drivers/online">
                    <i className="bx bx-wifi"></i> {props.t("Drivers Online")}
                  </Link>
                </li>
                <li>
                  <Link to="/drivers/earnings">
                    <i className="bx bx-money"></i> {props.t("Earnings & Payouts")}
                  </Link>
                </li>
                <li>
                  <Link to="/drivers/pending">
                    <i className="bx bx-time"></i> {props.t("Pending Approvals")}
                  </Link>
                </li>
                <li>
                  <Link to="/drivers/blocked">
                    <i className="bx bx-block"></i> {props.t("Blocked Drivers")}
                  </Link>
                </li>
                <li>
                  <Link to="/drivers/add">
                    <i className="bx bx-plus-circle"></i> {props.t("Add New Driver")}
                  </Link>
                </li>
                <li>
                  <Link to="/drivers/app">
                    <i className="bx bx-mobile-alt"></i> {props.t("Driver App")}
                  </Link>
                </li>
                <li>
                  <Link to="/drivers/support">
                    <i className="bx bx-support"></i> {props.t("Driver Support")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-support"></i>
                <span>{props.t("Support")}</span>
              </a>
              <ul className="sub-menu">
                <li>
                  <Link to="/support/urgent">
                    <i className="bx bx-error"></i> {props.t("Urgent Tickets")}
                  </Link>
                </li>
                <li>
                  <Link to="/support/customers">
                    <i className="bx bx-user"></i> {props.t("Customer Tickets")}
                  </Link>
                </li>
                <li>
                  <Link to="/support/stores">
                    <i className="bx bx-store"></i> {props.t("Stores Tickets")}
                  </Link>
                </li>
                <li>
                  <Link to="/support/drivers">
                    <i className="bx bx-car"></i> {props.t("Drivers Tickets")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-bell"></i>
                <span>{props.t("Notifications")}</span>
              </a>
              <ul className="sub-menu">
                <li>
                  <Link to="/notifications/info">
                    <i className="bx bx-info-circle"></i> {props.t("Website Info")}
                  </Link>
                </li>
                <li>
                  <Link to="/notifications/banners">
                    <i className="bx bx-image"></i> {props.t("Website Banners")}
                  </Link>
                </li>
                <li>
                  <Link to="/notifications/newsletters">
                    <i className="bx bx-envelope"></i> {props.t("Newsletters")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-credit-card"></i>
                <span>{props.t("Payments")}</span>
              </a>
              <ul className="sub-menu">
                <li>
                  <Link to="/payments/today">
                    <i className="bx bx-calendar-check"></i> {props.t("Today's Payments")}
                  </Link>
                </li>
                <li>
                  <Link to="/payments/customers">
                    <i className="bx bx-user"></i> {props.t("Customer Payments")}
                  </Link>
                </li>
                <li>
                  <Link to="/payments/cancelled">
                    <i className="bx bx-x-circle"></i> {props.t("Cancelled / Refunded")}
                  </Link>
                </li>
                <li>
                  <Link to="/payments/customer-invoices">
                    <i className="bx bx-file"></i> {props.t("Customer Invoices")}
                  </Link>
                </li>
                <li>
                  <Link to="/payments/store-payments">
                    <i className="bx bx-store"></i> {props.t("Store Payments")}
                  </Link>
                </li>
                <li>
                  <Link to="/payments/store-payments-history">
                    <i className="bx bx-history"></i> {props.t("Store Payments History")}
                  </Link>
                </li>
                <li>
                  <Link to="/payments/store-invoices">
                    <i className="bx bx-file"></i> {props.t("Store Invoices")}
                  </Link>
                </li>
                <li>
                  <Link to="/payments/driver-payouts">
                    <i className="bx bx-dollar"></i> {props.t("Driver's Payouts")}
                  </Link>
                </li>
                <li>
                  <Link to="/payments/driver-payouts-history">
                    <i className="bx bx-history"></i> {props.t("Driver's Payouts History")}
                  </Link>
                </li>
                <li>
                  <Link to="/payments/driver-invoices">
                    <i className="bx bx-file"></i> {props.t("Driver's Invoices")}
                  </Link>
                </li>
                <li>
                  <Link to="/payments/online">
                    <i className="bx bx-globe"></i> {props.t("Make Online Payment")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-bar-chart-alt-2"></i>
                <span>{props.t("Statistics")}</span>
              </a>
              <ul className="sub-menu">
                <li>
                  <Link to="/statistics/today">
                    <i className="bx bx-calendar-check"></i> {props.t("Today's Reports")}
                  </Link>
                </li>
                <li>
                  <Link to="/statistics/stores">
                    <i className="bx bx-store"></i> {props.t("Stores Reports")}
                  </Link>
                </li>
                <li>
                  <Link to="/statistics/monthly">
                    <i className="bx bx-calendar"></i> {props.t("Monthly Reports")}
                  </Link>
                </li>
                <li>
                  <Link to="/statistics/customers">
                    <i className="bx bx-user"></i> {props.t("Customer Reports")}
                  </Link>
                </li>
                <li>
                  <Link to="/statistics/products">
                    <i className="bx bx-cube"></i> {props.t("Products Stats")}
                  </Link>
                </li>
                <li>
                  <Link to="/statistics/website">
                    <i className="bx bx-globe"></i> {props.t("Website Stats")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-user-circle"></i>
                <span>{props.t("Admin Users")}</span>
              </a>
              <ul className="sub-menu">
                <li>
                  <Link to="/admin-users/all">
                    <i className="bx bx-user"></i> {props.t("All Admin Users")}
                  </Link>
                </li>
                <li>
                  <Link to="/admin-users/roles">
                    <i className="bx bx-id-card"></i> {props.t("Admin Roles")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-world"></i>
                <span>{props.t("Website CMS")}</span>
              </a>
              <ul className="sub-menu">
                <li>
                  <Link to="/website-cms/pages">
                    <i className="bx bx-file"></i> {props.t("All Pages")}
                  </Link>
                </li>
                <li>
                  <Link to="/website-cms/main-menu">
                    <i className="bx bx-menu"></i> {props.t("Main Menu")}
                  </Link>
                </li>
                <li>
                  <Link to="/website-cms/footer">
                    <i className="bx bx-underline"></i> {props.t("Footer")}
                  </Link>
                </li>
                <li>
                  <Link to="/website-cms/blog">
                    <i className="bx bx-news"></i> {props.t("Blog")}
                  </Link>
                </li>
                <li>
                  <Link to="/website-cms/add-page">
                    <i className="bx bx-plus-circle"></i> {props.t("Add New Page")}
                  </Link>
                </li>
                <li>
                  <Link to="/website-cms/media">
                    <i className="bx bx-photo-album"></i> {props.t("Site Media")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-cog"></i>
                <span>{props.t("Settings")}</span>
              </a>
              <ul className="sub-menu">
                <li>
                  <Link to="/settings/pricing">
                    <i className="bx bx-calculator"></i> {props.t("Pricing Formula")}
                  </Link>
                </li>
                <li>
                  <Link to="/settings/server-info">
                    <i className="bx bx-server"></i> {props.t("Server Info")}
                  </Link>
                </li>
                <li>
                  <Link to="/settings/logs">
                    <i className="bx bx-file"></i> {props.t("Logs")}
                  </Link>
                </li>
                <li>
                  <Link to="/settings/maintenance">
                    <i className="bx bx-wrench"></i> {props.t("Maintenance")}
                  </Link>
                </li>
                <li>
                  <Link to="/settings/backup">
                    <i className="bx bx-save"></i> {props.t("System Backup")}
                  </Link>
                </li>
              </ul>
            </li>

            <li className="position-absolute bottom-0">
              <Link to="/logout">
                <i className="bx bx-power-off"></i>
                <span>{props.t("Logout")}</span>
              </Link>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
