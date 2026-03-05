import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createSelector } from "reselect";
import { connect, useSelector } from "react-redux";
import { Collapse } from "reactstrap";
import withRouter from "../Common/withRouter";

// i18n
import { withTranslation } from "react-i18next";

// navigation config
import { menuConfig } from "../../common/menu.config";

// RBAC filter
import { filterMenuByRole } from "../../helpers/rbac";

const Navbar = props => {

  const location = useLocation();

  const userSelector = createSelector(
    state => state.Login,
    login => ({
      user: login.user
    })
  );
  const {
    user
  } = useSelector(userSelector);

  const [menu, setMenu] = useState([]);

  useEffect(() => {
    setMenu(filterMenuByRole(menuConfig, user.role));
  }, [user.role])

  const [openMenu, setOpenMenu] = useState(null);

  const navRef = useRef(null);

  /*
  collapse dropdown when route changes
  */
  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname]);

  /*
  collapse dropdown when clicking outside
  */
  useEffect(() => {

    const handleClickOutside = (event) => {

      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(null);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  return (
    <React.Fragment>

      <div className="topnav">

        <div className="container-fluid">

          <nav
            ref={navRef}
            className="navbar navbar-light navbar-expand-lg topnav-menu"
          >

            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
            >

              <ul className="navbar-nav">

                {menu.map((item, index) => {

                  /*
                  SIMPLE MENU ITEM
                  */
                  if (!item.children) {

                    const active = location.pathname === item.path;

                    return (
                      <li className="nav-item" key={index}>

                        <Link
                          className={`nav-link ${active ? "active" : ""}`}
                          to={item.path}
                        >

                          <i className={`${item.icon} me-2`}></i>

                          {props.t(item.title)}

                        </Link>

                      </li>
                    );
                  }

                  /*
                  DROPDOWN MENU
                  */

                  const isOpen = openMenu === index;

                  const childActive = item.children.some(
                    child => child.path === location.pathname
                  );

                  return (

                    <li
                      className={`nav-item dropdown ${isOpen ? "show" : ""}`}
                      key={index}
                    >

                      <a
                        href="#"
                        className={`nav-link dropdown-toggle ${childActive ? "active" : ""}`}
                        onClick={(e) => {

                          e.preventDefault();

                          setOpenMenu(openMenu === index ? null : index);

                        }}
                      >

                        <i className={`${item.icon} me-2`}></i>

                        {props.t(item.title)}

                      </a>

                      <ul
                        className={`dropdown-menu ${isOpen ? "show" : ""}`}
                      >

                        {item.children.map((child, i) => {

                          const active =
                            location.pathname === child.path;

                          return (

                            <li key={i}>

                              <Link
                                className={`dropdown-item ${active ? "active" : ""}`}
                                to={child.path}
                                onClick={() => setOpenMenu(null)}
                              >

                                <i className={`${child.icon} me-2`}></i>

                                {props.t(child.title)}

                              </Link>

                            </li>

                          );

                        })}

                      </ul>

                    </li>

                  );

                })}

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
  t: PropTypes.any
};

const mapStateToProps = state => {
  const { leftMenu } = state.Layout;
  return { leftMenu };
};

export default withRouter(
  connect(mapStateToProps, {})(withTranslation()(Navbar))
);