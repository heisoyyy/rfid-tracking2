import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ collapsed }) {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/scanner", label: "QR Scanner" },
    { path: "/tracking", label: "Tracking Data" },
  ];

  return (
    <div
      className={`sidebar bg-dark text-white ${
        collapsed ? "collapsed" : ""
      } d-flex flex-column`}
    >
      <ul className="nav flex-column p-2">
        {menuItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? "active fw-bold" : "text-white"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
