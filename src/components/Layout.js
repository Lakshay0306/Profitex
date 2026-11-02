import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Chatbot from "./Chatbot";
import CommandPalette from "./CommandPalette";
import { Search, LogOut, Sparkles, Command, Plus } from "lucide-react";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/dashboard":
        return { title: "Executive Dashboard", subtitle: "Real-time metrics, AI predictions & business health" };
      case "/invoices":
        return { title: "Invoices & Smart Billing", subtitle: "Generate GST-compliant invoices and manage client billing" };
      case "/products":
        return { title: "Products & Inventory", subtitle: "Stock levels, pricing optimization & AI demand forecast" };
      case "/purchases":
        return { title: "Purchase Orders", subtitle: "Inbound inventory purchases & supplier transaction tracking" };
      case "/expenses":
        return { title: "Expense Management", subtitle: "Smart OCR receipt scanning and operating expenditure records" };
      case "/settings":
        return { title: "System Settings", subtitle: "Configure store details, tax defaults and preferences" };
      default:
        return { title: "Workspace", subtitle: "NexaVentory AI Business Operating System" };
    }
  };

  const pageInfo = getPageTitle(location.pathname);

  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="app-container">
      <Sidebar />
      
      <div className="main-section">
        {/* Modern Top Navbar */}
        <header className="top-navbar">
          <div className="navbar-left">
            <div className="page-header-text">
              <h1 className="navbar-title">{pageInfo.title}</h1>
              <p className="navbar-subtitle">{pageInfo.subtitle}</p>
            </div>
          </div>

          <div className="navbar-center">
            <div
              className="navbar-search-box"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-cmd-palette"));
              }}
              title="Click or press Ctrl+K to open Search"
            >
              <Search size={16} className="search-icon" />
              <span className="search-placeholder">Quick search commands or pages...</span>
              <kbd className="search-kbd-badge">
                <Command size={11} style={{ marginRight: 2 }} /> K
              </kbd>
            </div>
          </div>

          <div className="navbar-right">
            {/* Quick Action Button */}
            {location.pathname !== "/invoices" && (
              <button
                className="topbar-action-pill"
                onClick={() => navigate("/invoices")}
                title="Create New Invoice"
              >
                <Plus size={14} />
                <span>New Bill</span>
              </button>
            )}

            {/* AI Status Chip */}
            <div className="ai-status-chip">
              <Sparkles size={14} className="ai-chip-icon" />
              <span>Gemini AI Connected</span>
            </div>

            {/* Profile & Quick Logout */}
            <div className="topbar-user-chip">
              <div className="chip-avatar">
                {getInitials(user?.name)}
              </div>
              <div className="chip-details">
                <span className="chip-name">{user?.name || "Admin"}</span>
                <span className="chip-role">Store Owner</span>
              </div>
              <button
                className="chip-logout-btn"
                onClick={handleLogout}
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="main-content">
          <div className="content-inner">
            {children}
          </div>
        </main>
      </div>

      <Chatbot />
      <CommandPalette />
    </div>
  );
};

export default Layout;
