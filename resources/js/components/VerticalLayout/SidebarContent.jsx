// import React, { useEffect, useRef, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { createSelector } from "reselect";

// import SimpleBar from "simplebar-react";
// import MetisMenu from "metismenujs";

// import SidebarItem from "./SidebarItem";
// import { menuConfig } from "../../common/menu.config";
// import { filterMenuByRole } from "../../helpers/rbac";

// const SidebarContent = () => {

//   const userSelector = createSelector(
//     state => state.Login,
//     login => ({
//       user: login.user
//     })
//   );
//   const {
//     user
//   } = useSelector(userSelector);

//   const dispatch = useDispatch()

//   const menuRef = useRef(null);

//   const [menu, setMenu] = useState([]);

//   useEffect(() => {
//     setMenu(filterMenuByRole(menuConfig, user.role));
//   }, [user.role, dispatch])

//   useEffect(() => {
//     if (menuRef.current) {
//       menuRef.current.dispose();
//     }
//     menuRef.current = new MetisMenu("#side-menu");
//   }, [dispatch])

//   return (

//     <SimpleBar className="h-100">

//       <div id="sidebar-menu">

//         <ul className="metismenu list-unstyled" id="side-menu">

//           <li className="menu-title">Menu</li>

//           {menu.map((item, index) => (
//             <SidebarItem key={index} item={item} />
//           ))}

//           <li className="mt-auto position-absolute bottom-0">

//             <Link to="/logout">

//               <i className="bx bx-power-off"></i>

//               <span>Logout</span>

//             </Link>

//           </li>

//         </ul>

//       </div>

//     </SimpleBar>

//   );

// };

// export default SidebarContent;


import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";

import SidebarItem from "./SidebarItem";
import { menuConfig } from "../../common/menu.config";
import { filterMenuByRole } from "../../helpers/rbac";
import { logoutUser } from "../../store/actions";

const SidebarContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userSelector = createSelector(
    state => state.Login,
    state => state.config?.appConfig,
    (login, appConfig) => ({
      user: login.user,
      appConfig: appConfig || {}
    })
  );

  const { user, appConfig } = useSelector(userSelector);

  const menuRef = useRef(null);

  const [menu, setMenu] = useState([]);

  /*
  Load menu based on role and app config (e.g. seller_system)
  */
  useEffect(() => {
    if (user?.role) {
      setMenu(filterMenuByRole(menuConfig, user.role, appConfig));
    }
  }, [user, appConfig]);

  /*
  Initialize MetisMenu AFTER menu renders
  */
  useEffect(() => {

    if (!menu.length) return;

    if (menuRef.current) {
      menuRef.current.dispose();
    }

    const timer = setTimeout(() => {
      menuRef.current = new MetisMenu("#side-menu");
    }, 0);

    return () => clearTimeout(timer);

  }, [menu]);

  return (
    <div className="d-flex flex-column h-100">
      <SimpleBar className="flex-grow-1" style={{ minHeight: 0 }}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">Menu</li>
            {menu.map((item, index) => (
              <SidebarItem key={index} item={item} />
            ))}
          </ul>
        </div>
      </SimpleBar>
      <div className="sidebar-footer flex-shrink-0">
        <button
          type="button"
          className="sidebar-footer-btn d-flex align-items-center w-100 border-0 bg-transparent text-start"
          style={{ padding: "0.625rem 1.5rem", cursor: "pointer", pointerEvents: "auto" }}
          onClick={() => dispatch(logoutUser(navigate))}
        >
          <i className="bx bx-power-off me-2" style={{ minWidth: "1.75rem", fontSize: "1.25rem" }}></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

};

export default SidebarContent;
