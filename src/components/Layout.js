import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Chatbot from "./Chatbot";
import CommandPalette from "./CommandPalette";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-section">
        <div className="navbar">
          <input
            className="search"
            placeholder="Search... (Press Cmd+K)"
            onClick={() => {
              document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'k', 'metaKey': true}));
            }}
            readOnly
          />
          <div className="profile-section">
            <span>{user?.name || "Admin"}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <div className="content">
          {children}
        </div>
      </div>

      <Chatbot />
      <CommandPalette />
    </div>
  );
};

export default Layout;