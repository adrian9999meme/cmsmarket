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
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";

import SidebarItem from "./SidebarItem";
import { menuConfig } from "../../common/menu.config";
import { filterMenuByRole } from "../../helpers/rbac";

const SidebarContent = () => {

  const userSelector = createSelector(
    state => state.Login,
    login => ({
      user: login.user
    })
  );

  const { user } = useSelector(userSelector);

  const menuRef = useRef(null);

  const [menu, setMenu] = useState([]);

  /*
  Load menu based on role
  */
  useEffect(() => {
    if (user?.role) {
      setMenu(filterMenuByRole(menuConfig, user.role));
    }
  }, [user]);

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

    <SimpleBar className="h-100">

      <div id="sidebar-menu">

        <ul className="metismenu list-unstyled" id="side-menu">

          <li className="menu-title">Menu</li>

          {menu.map((item, index) => (
            <SidebarItem key={index} item={item} />
          ))}

          <li className="mt-auto position-absolute bottom-0">

            <Link to="/logout">

              <i className="bx bx-power-off"></i>

              <span>Logout</span>

            </Link>

          </li>

        </ul>

      </div>

    </SimpleBar>

  );

};

export default SidebarContent;
