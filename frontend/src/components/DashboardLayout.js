import React from "react";
import { Outlet } from "react-router-dom";
import "./DashboardLayout.css";


// Correct path:
import BloodDropLogo from "../assets/blood.svg";

export default function DashboardLayout({ onLogout }) {
  return (
    <div className="layout-container">
      {/* Top Navbar */}
      <nav className="top-nav">
        <div className="nav-left">
          <img src={BloodDropLogo} alt="Blood Drop Logo" className="logo" />
          <h1>Blood Donation Network</h1>
        </div>
        


        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </nav>

      {/* Page Content */}
      <div className="content-wrapper">
        <Outlet />
      </div>
    </div>
  );
}
