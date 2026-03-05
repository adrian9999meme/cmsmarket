import React from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarItem = ({ item }) => {
    const location = useLocation();

    if (!item.children) {

        return (
            <li>
                <Link to={item.path}>
                    <i className={item.icon}></i>
                    <span>{item.title}</span>
                </Link>
            </li>
        );

    }

    return (
        <li>

            <a href="#" className="has-arrow">

                <i className={item.icon}></i>

                <span>{item.title}</span>

            </a>

            <ul className="sub-menu">

                {item.children.map((child, index) => {

                    const isChildActive = location.pathname === child.path;

                    return (
                        <li
                            key={index}
                            className={isChildActive ? "mm-active" : ""}
                        >
                            <Link
                                to={child.path}
                                className={isChildActive ? "active" : ""}
                            >
                                <i className={child.icon}></i>
                                {child.title}
                            </Link>
                        </li>
                    );
                })}

            </ul>

        </li>
    );
};

export default SidebarItem;