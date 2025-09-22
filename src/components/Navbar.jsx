import React from "react";
import "./Sidebar.css";


function Navbar({ onToggle, onLogout }) {
  return (
    <nav className="navbar navbar-dark bg-dark px-3 d-flex align-items-center">
      {/* Toggle Button */}
      <button className="btn btn-outline-light me-3" onClick={onToggle}>
        ☰
      </button>

      {/* Brand */}
      <span className="navbar-brand mb-0 h1">RFID Tracking</span>

      {/* Logout Button */}
      <button className="btn btn-outline-light ms-auto" onClick={onLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
