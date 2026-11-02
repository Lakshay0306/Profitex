import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";
import {
  Wallet,
  Camera,
  Plus,
  Edit3,
  Trash2,
  PieChart,
  Calendar,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  TrendingDown
} from "lucide-react";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [summaries, setSummaries] = useState({ byCategory: {}, byMonth: {} });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Rent"
  });

  const categories = [
    "Rent",
    "Salary",
    "Utilities",
    "Transport",
    "Office Supplies",
    "Marketing",
    "Other"
  ];

  const fetchData = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
      const summaryRes = await API.get("/expenses/summary");
      setSummaries(summaryRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/expenses/${editId}`, form);
        setIsEditing(false);
        setEditId(null);
      } else {
        await API.post("/expenses", form);
      }
      setForm({ title: "", amount: "", category: "Rent" });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (exp) => {
    setForm({ title: exp.title, amount: exp.amount, category: exp.category });
    setIsEditing(true);
    setEditId(exp._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense record?")) {
      try {
        await API.delete(`/expenses/${id}`);
        fetchData();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const [isScanning, setIsScanning] = useState(false);

  const handleScanReceipt = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    const formData = new FormData();
    formData.append("receipt", file);

    try {
      const { data } = await API.post("/ai/scan-receipt", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm({
        title: data.description || data.vendorName || "Scanned Expense",
        amount: data.amount || "",
        category: "Other"
      });
      alert("Receipt scanned successfully! Please review the pre-filled fields before saving.");
    } catch (err) {
      console.log(err);
      alert("Failed to scan receipt. " + (err.response?.data?.message || ""));
    } finally {
      setIsScanning(false);
      e.target.value = null;
    }
  };

  const totalExpenseVal = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <Layout>
      {/* EXPENSE SUMMARY CARDS */}
      <div className="dashboard-charts-grid" style={{ marginBottom: 24 }}>
        {/* Category Breakdown Card */}
        <div className="modern-chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Expenditure by Category</h3>
              <p className="chart-subtitle">Operating costs categorized by allocation</p>
            </div>
            <div className="chart-indicator">
              <PieChart size={16} />
            </div>
          </div>
          <div className="category-breakdown-list">
            {Object.entries(summaries.byCategory).map(([cat, val]) => (
              <div key={cat} className="category-breakdown-row">
                <span className="cat-name-tag">{cat}</span>
                <div className="cat-val-group">
                  <span className="cat-amount">₹{val.toFixed(2)}</span>
                </div>
              </div>
            ))}
            {Object.keys(summaries.byCategory).length === 0 && (
              <p className="empty-subtext">No category summaries generated yet.</p>
            )}
          </div>
        </div>

        {/* Monthly Summary Card */}
        <div className="modern-chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Monthly Expense Outflows</h3>
              <p className="chart-subtitle">Historical monthly spending trends</p>
            </div>
            <div className="chart-indicator">
              <Calendar size={16} />
            </div>
          </div>
          <div className="category-breakdown-list">
            {Object.entries(summaries.byMonth).map(([month, val]) => (
              <div key={month} className="category-breakdown-row">
                <span className="cat-name-tag">{month}</span>
                <span className="cat-amount">₹{val.toFixed(2)}</span>
              </div>
            ))}
            {Object.keys(summaries.byMonth).length === 0 && (
              <p className="empty-subtext">No monthly trends recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* ADD / EDIT EXPENSE FORM & OCR SCANNER */}
      <div className="modern-content-card">
        <div className="card-top-bar">
          <div className="card-title-group">
            <Wallet size={18} className="card-header-icon" />
            <h3 className="card-headline">{isEditing ? "Edit Expense Entry" : "Record Operating Expense"}</h3>
          </div>

          {/* AI Receipt Scanner Trigger */}
          <label className="btn-modern-ai-scanner" title="Upload paper receipt or invoice to auto-extract details">
            {isScanning ? (
              <>
                <RefreshCw size={14} className="spin-animation" />
                <span>Scanning Receipt via Gemini AI...</span>
              </>
            ) : (
              <>
                <Camera size={15} />
                <span>Smart Receipt OCR Scanner</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleScanReceipt}
              disabled={isScanning}
            />
          </label>
        </div>

        <form onSubmit={submit} className="modern-form">
          <div className="form-grid-3">
            <div className="form-field-group" style={{ gridColumn: "span 2" }}>
              <label>Expense Title / Description *</label>
              <input
                placeholder="e.g. Office Electricity Bill, Cloud Server Hosting"
                value={form.title}
                required
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="form-field-group">
              <label>Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 2450.00"
                value={form.amount}
                required
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              />
            </div>

            <div className="form-field-group">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="modern-select"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-action-row">
            <button type="submit" className="btn-modern-primary">
              {isEditing ? <CheckCircle2 size={16} /> : <Plus size={16} />}
              <span>{isEditing ? "Update Expense" : "Record Expense"}</span>
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn-modern-ghost"
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                  setForm({ title: "", amount: "", category: "Rent" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* EXPENSES LEDGER TABLE */}
      <div className="modern-content-card" style={{ marginTop: 24 }}>
        <div className="card-top-bar">
          <div className="card-title-group">
            <TrendingDown size={18} className="card-header-icon" />
            <h3 className="card-headline">Expense Ledger ({expenses.length} records)</h3>
          </div>
          <span className="badge badge-danger">Total Outflow: ₹{totalExpenseVal.toFixed(2)}</span>
        </div>

        <div className="modern-table-responsive">
          <table className="modern-data-table">
            <thead>
              <tr>
                <th>Expense Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Recorded Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td>
                    <strong>{exp.title}</strong>
                  </td>
                  <td>
                    <span className="category-pill">{exp.category}</span>
                  </td>
                  <td>
                    <span className="price-tag expense-price-tag">₹{exp.amount.toFixed(2)}</span>
                  </td>
                  <td>{new Date(exp.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td style={{ textAlign: "right" }}>
                    <div className="table-action-buttons">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="action-icon-btn edit-btn"
                        title="Edit Expense"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="action-icon-btn delete-btn"
                        title="Delete Expense"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="table-empty-message">
                    No expense entries logged yet. Click "+ Record Expense" or scan a paper receipt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Expenses;
