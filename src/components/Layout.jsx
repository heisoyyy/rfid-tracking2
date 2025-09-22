import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../App.css";

function Layout({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="d-flex flex-column vh-100">
      {/* Navbar */}
      <Navbar onToggle={() => setCollapsed(!collapsed)} onLogout={onLogout} />

      {/* Body */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} />

        {/* Main Content */}
        <main className="flex-grow-1 p-4 bg-light overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
