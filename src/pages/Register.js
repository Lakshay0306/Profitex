import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "../auth.css";
import { Sparkles, Check } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin"
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      alert("Registration successful! You may now sign in.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed. Please check inputs.");
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
          <h2>Create Store Account</h2>
          <p className="auth-subtitle">Initialize your workspace and admin credentials</p>

          <div className="auth-input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Lakshay Singla"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

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
            <label>Secure Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? "Creating Account..." : "Complete Registration"}
          </button>

          <div className="auth-footer">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
