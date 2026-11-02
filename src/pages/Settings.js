import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import {
  Settings as SettingsIcon,
  Building2,
  User,
  KeyRound,
  CheckCircle2,
  Upload,
  ShieldCheck
} from "lucide-react";

const Settings = () => {
  const { user, login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    gstNumber: "",
    address: ""
  });

  const [profileForm, setProfileForm] = useState({
    name: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await API.get("/company");
        if (res.data) {
          setForm(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchCompany();
    if (user) {
      setProfileForm({ name: user.name });
    }
  }, [user]);

  const submitCompany = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("gstNumber", form.gstNumber);
    formData.append("address", form.address);
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      await API.post("/company", formData);
      alert("Company details updated successfully!");
    } catch (err) {
      alert("Failed to update company information");
    }
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put("/user/profile", profileForm);
      const token = localStorage.getItem("token");
      login({ token, user: data });
      alert("Profile details updated successfully!");
    } catch (err) {
      alert("Failed to update user profile");
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirmation do not match!");
      return;
    }
    try {
      await API.put("/user/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      alert("Security password updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <Layout>
      <div className="dashboard-charts-grid" style={{ alignItems: "start" }}>
        {/* BUSINESS INFO CARD */}
        <div className="modern-content-card">
          <div className="card-top-bar">
            <div className="card-title-group">
              <Building2 size={18} className="card-header-icon" />
              <h3 className="card-headline">Enterprise Store Details</h3>
            </div>
          </div>

          <form onSubmit={submitCompany} className="modern-form">
            <div className="form-field-group">
              <label>Business / Enterprise Legal Name</label>
              <input
                placeholder="e.g. NexaRetail Solutions LLP"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-field-group">
              <label>GSTIN / Tax Registration Number</label>
              <input
                placeholder="e.g. 07AAAAA0000A1Z5"
                value={form.gstNumber}
                onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
              />
            </div>

            <div className="form-field-group">
              <label>Operating Address (Printed on Invoices)</label>
              <textarea
                placeholder="Enter physical address, state and PIN code..."
                value={form.address}
                rows={3}
                className="modern-textarea"
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="form-field-group">
              <label>Official Brand Logo</label>
              <div className="file-upload-box">
                <Upload size={18} />
                <span>Upload Logo File (PNG/JPG)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogo(e.target.files[0])}
                  className="hidden-file-input"
                />
              </div>
            </div>

            <button type="submit" className="btn-modern-primary" style={{ width: "100%", justifyContent: "center" }}>
              <CheckCircle2 size={16} />
              <span>Save Enterprise Details</span>
            </button>
          </form>
        </div>

        {/* USER PROFILE & SECURITY */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* User Profile Card */}
          <div className="modern-content-card">
            <div className="card-top-bar">
              <div className="card-title-group">
                <User size={18} className="card-header-icon" />
                <h3 className="card-headline">Personal Profile</h3>
              </div>
              <span className="badge badge-success">Active Session</span>
            </div>

            <div className="profile-meta-banner">
              <div className="meta-row">
                <span className="meta-label">Email:</span>
                <span className="meta-val">{user?.email || "admin@nexaventory.com"}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Role:</span>
                <span className="meta-val badge badge-warning" style={{ textTransform: "uppercase" }}>
                  {user?.role || "Administrator"}
                </span>
              </div>
            </div>

            <form onSubmit={submitProfile} className="modern-form">
              <div className="form-field-group">
                <label>Display Name</label>
                <input
                  placeholder="Your Name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-modern-primary" style={{ width: "100%", justifyContent: "center" }}>
                <span>Update Profile Name</span>
              </button>
            </form>
          </div>

          {/* Password Security Card */}
          <div className="modern-content-card">
            <div className="card-top-bar">
              <div className="card-title-group">
                <KeyRound size={18} className="card-header-icon" />
                <h3 className="card-headline">Account Password & Security</h3>
              </div>
              <ShieldCheck size={18} color="#10b981" />
            </div>

            <form onSubmit={submitPassword} className="modern-form">
              <div className="form-field-group">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
              </div>

              <div className="form-field-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </div>

              <div className="form-field-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-modern-primary" style={{ width: "100%", justifyContent: "center" }}>
                <span>Change Password</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
