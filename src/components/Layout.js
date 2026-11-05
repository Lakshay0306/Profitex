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
        return { 
          title: "Executive Dashboard", 
          subtitle: "Real-time revenue metrics, financial health & inventory tracking" 
        };
      case "/invoices":
        return { 
          title: "Invoices & Billing", 
          subtitle: "Generate GST-compliant tax invoices and manage client accounts" 
        };
      case "/products":
        return { 
          title: "Products & Inventory", 
          subtitle: "Live catalog stock, pricing optimization & demand forecasting" 
        };
      case "/purchases":
        return { 
          title: "Purchase Orders", 
          subtitle: "Inbound inventory purchases & vendor transaction records" 
        };
      case "/expenses":
        return { 
          title: "Expense Management", 
          subtitle: "Operational expenditure tracking & smart receipt digitization" 
        };
      case "/settings":
        return { 
          title: "Store Settings", 
          subtitle: "Business profile, GSTIN configuration & account preferences" 
        };
      default:
        return { 
          title: "Console", 
          subtitle: "NexaVentory Business Management Platform" 
        };
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
              <Search size={15} className="search-icon" />
              <span className="search-placeholder">Quick search commands or pages...</span>
              <kbd className="search-kbd-badge">
                <Command size={10} style={{ marginRight: 2 }} /> K
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

            {/* Subtle Copilot Badge */}
            <div className="ai-status-chip" title="AI Copilot Engine Active">
              <Sparkles size={13} className="ai-chip-icon" />
              <span>AI Copilot</span>
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
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="main-content">
          <div className="content-inner">{children}</div>
        </main>
      </div>

      <CommandPalette />
      <Chatbot />
    </div>
  );
};

export default Layout;
