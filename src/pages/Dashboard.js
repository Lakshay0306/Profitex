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
import {
  TrendingUp,
  ShoppingCart,
  CreditCard,
  Sparkles,
  RefreshCw,
  Award,
  ArrowUpRight,
  BarChart3,
  Activity
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [summary, setSummary] = useState({
    sales: 0,
    expenses: 0,
    purchases: 0,
    profit: 0,
    topProducts: [],
    trends: [],
  });

  const [aiInsights, setAiInsights] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [refreshingSummary, setRefreshingSummary] = useState(false);

  const fetchSummary = async () => {
    setRefreshingSummary(true);
    try {
      const { data } = await API.get("/dashboard");
      setSummary(data);
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshingSummary(false);
    }
  };

  const fetchAiInsights = async () => {
    setLoadingAi(true);
    try {
      const { data } = await API.get("/dashboard/insights");
      setAiInsights(data.insights);
    } catch (err) {
      console.log(err);
      setAiInsights("AI insights temporarily unavailable. Please verify API configuration.");
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchAiInsights();
  }, []);

  const barData = {
    labels: ["Sales Revenue", "Total Purchases", "Operating Expenses"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [summary.sales, summary.purchases, summary.expenses],
        backgroundColor: ["#2563eb", "#059669", "#dc2626"],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const lineData = {
    labels: summary.trends.map((t) => t.month),
    datasets: [
      {
        label: "Sales Revenue",
        data: summary.trends.map((t) => t.sales),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.08)",
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Operating Expenses",
        data: summary.trends.map((t) => t.expenses),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.05)",
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointBackgroundColor: "#ef4444",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
          font: { family: "'Inter', sans-serif", size: 12, weight: "500" },
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleFont: { family: "'Inter', sans-serif", size: 13 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: "'Inter', sans-serif", size: 11 }, color: "#64748b" },
      },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11 },
          color: "#64748b",
          callback: (value) => "₹" + value.toLocaleString(),
        },
      },
    },
  };

  return (
    <Layout>
      {/* KPI Cards Grid */}
      <div className="stats-grid">
        {/* Card 1: Total Sales */}
        <div className="modern-kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Sales</span>
            <div className="kpi-icon-wrapper kpi-icon-blue">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="kpi-body">
            <h2 className="kpi-value">₹{summary.sales.toLocaleString()}</h2>
            <div className="kpi-footer">
              <span className="kpi-badge kpi-badge-positive">
                <ArrowUpRight size={13} /> Active Revenue
              </span>
              <span className="kpi-subtext">Calculated from verified bills</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Purchases */}
        <div className="modern-kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Purchases</span>
            <div className="kpi-icon-wrapper kpi-icon-emerald">
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className="kpi-body">
            <h2 className="kpi-value">₹{summary.purchases.toLocaleString()}</h2>
            <div className="kpi-footer">
              <span className="kpi-badge kpi-badge-neutral">
                Stock Reorders
              </span>
              <span className="kpi-subtext">Supplier inventory intake</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Expenses */}
        <div className="modern-kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Expenses</span>
            <div className="kpi-icon-wrapper kpi-icon-rose">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="kpi-body">
            <h2 className="kpi-value">₹{summary.expenses.toLocaleString()}</h2>
            <div className="kpi-footer">
              <span className="kpi-badge kpi-badge-expense">
                Operating Cost
              </span>
              <span className="kpi-subtext">Utilities, rent & OCR slips</span>
            </div>
          </div>
        </div>

        {/* Card 4: Net Profit */}
        <div className="modern-kpi-card kpi-card-highlight">
          <div className="kpi-header">
            <span className="kpi-title">Net Profit</span>
            <div className="kpi-icon-wrapper kpi-icon-purple">
              <Sparkles size={20} />
            </div>
          </div>
          <div className="kpi-body">
            <h2 className="kpi-value">₹{summary.profit.toLocaleString()}</h2>
            <div className="kpi-footer">
              <span className="kpi-badge kpi-badge-profit">
                Gross Margin
              </span>
              <span className="kpi-subtext">Sales − (Expenses + Purchases)</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Executive Intelligence Card */}
      <div className="modern-ai-card">
        <div className="ai-card-header">
          <div className="ai-card-title-group">
            <div className="ai-badge-glowing">
              <Sparkles size={16} />
              <span>Gemini AI Business Intelligence</span>
            </div>
            <h3 className="ai-headline">Executive Financial Summary & Advisory</h3>
          </div>
          <button
            onClick={fetchAiInsights}
            disabled={loadingAi}
            className="ai-refresh-btn"
            title="Re-run AI Analysis"
          >
            <RefreshCw size={14} className={loadingAi ? "spin-animation" : ""} />
            <span>{loadingAi ? "Analyzing..." : "Refresh Insights"}</span>
          </button>
        </div>

        <div className="ai-card-content">
          {loadingAi ? (
            <div className="ai-loading-state">
              <div className="ai-pulsing-loader" />
              <p>Gemini AI is parsing recent sales velocity, margin spreads and store cashflow...</p>
            </div>
          ) : (
            <div className="ai-text-box">
              {aiInsights || "No financial insights available yet. Generate invoices or log expenses to initialize analysis."}
            </div>
          )}
        </div>
      </div>

      {/* Analytics Charts & Top Products Grid */}
      <div className="dashboard-charts-grid">
        {/* Left Chart: Revenue vs Expenses */}
        <div className="modern-chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Revenue vs Operating Expenses</h3>
              <p className="chart-subtitle">Monthly trajectory comparing inflows against overheads</p>
            </div>
            <div className="chart-indicator">
              <Activity size={16} />
            </div>
          </div>
          <div className="chart-canvas-wrapper" style={{ height: 320 }}>
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        {/* Right Card: Top Performing Products */}
        <div className="modern-chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Top Selling Products</h3>
              <p className="chart-subtitle">Ranked by overall units sold</p>
            </div>
            <div className="chart-indicator">
              <Award size={16} />
            </div>
          </div>
          <div className="top-products-list">
            {summary.topProducts && summary.topProducts.length > 0 ? (
              summary.topProducts.map((p, i) => (
                <div key={i} className="top-product-row">
                  <div className="product-rank-badge">
                    #{i + 1}
                  </div>
                  <div className="product-info-col">
                    <span className="product-name-text">{p.name}</span>
                    <span className="product-category-text">High-Velocity Inventory</span>
                  </div>
                  <div className="product-qty-badge">
                    <span className="qty-number">{p.qty}</span>
                    <span className="qty-label">units</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-chart-state">
                <BarChart3 size={32} />
                <p>No sales records detected yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Chart: Financial Overview Breakdown */}
      <div className="modern-chart-card" style={{ marginTop: 24 }}>
        <div className="chart-card-header">
          <div>
            <h3 className="chart-title">Financial Balance Breakdown</h3>
            <p className="chart-subtitle">Comparison of Revenue, Purchases & Expenses</p>
          </div>
        </div>
        <div className="chart-canvas-wrapper" style={{ height: 260 }}>
          <Bar
            data={barData}
            options={{
              ...chartOptions,
              plugins: { ...chartOptions.plugins, legend: { display: false } },
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
