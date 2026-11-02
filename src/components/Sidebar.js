import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Package,
  Truck,
  Wallet,
  Settings,
  Sparkles,
  LogOut,
  ChevronRight,
  Activity
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Invoices & Billing", path: "/invoices", icon: Receipt },
    { name: "Products & Stock", path: "/products", icon: Package },
    { name: "Purchases", path: "/purchases", icon: Truck },
    { name: "Expenses", path: "/expenses", icon: Wallet },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Sparkles size={20} className="brand-sparkle" />
        </div>
        <div className="brand-details">
          <span className="brand-title">NexaVentory</span>
          <span className="brand-subtitle">AI ERP System</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-menu-wrapper">
        <div className="menu-category-label">OPERATIONS & ANALYTICS</div>
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
                  <Icon size={18} />
                </div>
                <span className="nav-item-text">{item.name}</span>
                {isActive && <ChevronRight size={14} className="active-arrow" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quick System Status Widget */}
      <div className="sidebar-stats-widget">
        <div className="widget-header">
          <Activity size={13} style={{ color: "#2563eb" }} />
          <span>System Status</span>
        </div>
        <div className="widget-row">
          <span>Engine:</span>
          <span className="widget-val-green">Gemini AI Active</span>
        </div>
        <div className="widget-row">
          <span>Database:</span>
          <span className="widget-val-blue">MongoDB Synced</span>
        </div>
      </div>

      {/* AI Assistant Promo Pill */}
      <div className="sidebar-ai-pill">
        <div className="ai-pill-dot" />
        <span>Gemini AI Engine Active</span>
      </div>

      {/* Bottom User Profile Section */}
      <div className="sidebar-footer">
        <div className="user-profile-card">
          <div className="user-avatar">
            {getInitials(user?.name)}
          </div>
          <div className="user-info">
            <span className="user-name" title={user?.name || "Admin"}>
              {user?.name || "Admin"}
            </span>
            <span className="user-role">Administrator</span>
          </div>
          <button
            onClick={handleLogout}
            className="user-logout-btn"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
