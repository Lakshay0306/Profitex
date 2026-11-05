import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Package,
  Truck,
  Wallet,
  Settings,
  ChevronRight,
  Database
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Invoices & Billing", path: "/invoices", icon: Receipt },
    { name: "Products & Stock", path: "/products", icon: Package },
    { name: "Purchases", path: "/purchases", icon: Truck },
    { name: "Expenses", path: "/expenses", icon: Wallet },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo-mark">
          <span className="logo-letter">N</span>
        </div>
        <div className="brand-details">
          <span className="brand-title">NexaVentory</span>
          <span className="brand-subtitle">Enterprise Operations</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-menu-wrapper">
        <div className="menu-category-label">MANAGEMENT CONSOLE</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <div className="nav-item-icon-wrapper">
                  <Icon size={17} />
                </div>
                <span className="nav-item-text">{item.name}</span>
                {isActive && <ChevronRight size={14} className="active-arrow" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Professional System Health Status in Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-system-status">
          <div className="system-status-indicator">
            <span className="system-dot" />
            <span className="system-label">System Online</span>
          </div>
          <div className="system-sublabel">
            <Database size={11} style={{ marginRight: 4 }} />
            <span>MongoDB Atlas · Cloud DB</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
