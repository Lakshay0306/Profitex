import { useEffect, useState } from "react";
import API from "../api";
import Layout from "../components/Layout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const Dashboard = () => {

  const [summary, setSummary] = useState({
    sales: 0,
    expenses: 0,
    purchases: 0,
    profit: 0,
    topProducts: [],
    trends: []
  });

  const [aiInsights, setAiInsights] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await API.get("/dashboard");
        setSummary(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAiInsights = async () => {
      setLoadingAi(true);
      try {
        const { data } = await API.get("/dashboard/insights");
        setAiInsights(data.insights);
      } catch (err) {
        console.log(err);
        setAiInsights("AI insights temporarily unavailable.");
      } finally {
        setLoadingAi(false);
      }
    };

    fetchSummary();
    fetchAiInsights();
  }, []);

  const barData = {
    labels: ["Sales", "Expenses", "Purchases"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [summary.sales, summary.expenses, summary.purchases],
        backgroundColor: ["#2563eb", "#ef4444", "#10b981"],
        borderRadius: 4,
      },
    ],
  };

  const lineData = {
    labels: summary.trends.map(t => t.month),
    datasets: [
      {
        label: "Sales",
        data: summary.trends.map(t => t.sales),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        fill: true,
        tension: 0.4
      },
      {
        label: "Expenses",
        data: summary.trends.map(t => t.expenses),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <Layout>
      <h2 className="page-title">Dashboard</h2>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Sales</h4>
          <h2>₹{summary.sales.toLocaleString()}</h2>
        </div>

        <div className="stat-card">
          <h4>Total Purchases</h4>
          <h2>₹{summary.purchases.toLocaleString()}</h2>
        </div>

        <div className="stat-card">
          <h4>Total Expenses</h4>
          <h2>₹{summary.expenses.toLocaleString()}</h2>
        </div>

        <div className="stat-card highlight">
          <h4>Net Profit</h4>
          <h2>₹{summary.profit.toLocaleString()}</h2>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="stat-card" style={{ marginBottom: '30px', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a', fontSize: '18px', marginTop: 0, marginBottom: '15px' }}>
          <span>🤖</span> Executive Summary
        </h3>
        {loadingAi ? (
          <p style={{ color: '#475569', margin: 0 }}>Analyzing financial portfolios...</p>
        ) : (
          <div style={{ color: '#334155', whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '15px' }}>
            {aiInsights || "No significant insights available for the current fiscal period."}
          </div>
        )}
      </div>

      <div className="charts-grid" style={{ marginBottom: "30px" }}>
        <div className="chart-box">
          <h3>Revenue vs Expenses</h3>
          <div style={{ height: "300px", marginTop: "20px" }}>
            <Line data={lineData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        <div className="chart-box">
          <h3>Top Products</h3>
          <table className="billing-table">
            <thead>
              <tr>
                <th>Product</th>
                <th style={{ textAlign: 'right' }}>Qty</th>
              </tr>
            </thead>
            <tbody>
              {summary.topProducts.map((p, i) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#2563eb' }}>{p.qty}</td>
                </tr>
              ))}
              {summary.topProducts.length === 0 && (
                <tr><td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>No data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-box" style={{ gridColumn: "1 / -1" }}>
          <h3>Financial Overview</h3>
          <div style={{ height: "300px", marginTop: "20px" }}>
             <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default Dashboard;