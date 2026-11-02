import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import "../auth.css";
import { Sparkles, Check, ArrowRight } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", form);
      login(data);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid email or password credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-brand-badge">
          <Sparkles size={14} />
          <span>Intelligent Enterprise Suite</span>
        </div>
        <h1>NexaVentory</h1>
        <p>AI-Powered Smart Billing, Stock Control & Profitability Management System.</p>

        <div className="auth-feature-list">
          <div className="auth-feature-item">
            <div className="auth-feature-dot">
              <Check size={13} />
            </div>
            <span>Instant GST-Compliant Billing & Automated PDF Dispatch</span>
          </div>
          <div className="auth-feature-item">
            <div className="auth-feature-dot">
              <Check size={13} />
            </div>
            <span>Google Gemini AI Virtual Business Manager & Analytics</span>
          </div>
          <div className="auth-feature-item">
            <div className="auth-feature-dot">
              <Check size={13} />
            </div>
            <span>Smart Receipt OCR Scanner & Velocity Demand Forecasting</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <form className="auth-card" onSubmit={submit}>
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to access your business intelligence dashboard</p>

          <div className="auth-input-group">
            <label>Work Email</label>
            <input
              type="email"
              placeholder="name@business.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign in to Dashboard"}
          </button>

          <div className="auth-footer">
            Don't have an account yet?
            <Link to="/register">Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
