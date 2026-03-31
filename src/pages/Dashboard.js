import { useEffect, useState } from "react";
import API from "../api";
import Layout from "../components/Layout";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {

  const [summary, setSummary] = useState({
    sales: 0,
    expenses: 0,
    purchases: 0,
    profit: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await API.get("/dashboard");
        setSummary(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSummary();
  }, []);

  const barData = {
    labels: ["Sales", "Expenses", "Purchases"],
    datasets: [
      {
        label: "Business Overview",
        data: [summary.sales, summary.expenses, summary.purchases],
        backgroundColor: ["#2563eb", "#ef4444", "#10b981"],
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["Sales", "Expenses"],
    datasets: [
      {
        data: [summary.sales, summary.expenses],
        backgroundColor: ["#2563eb", "#ef4444"],
      },
    ],
  };

  return (
    <Layout>

      <h2 className="dashboard-title">Dashboard</h2>

      {/* KPI Cards */}

      <div className="dashboard-cards">

        <div className="card">
          <h4>Total Sales</h4>
          <h2>₹ {summary.sales}</h2>
        </div>

        <div className="card">
          <h4>Total Purchases</h4>
          <h2>₹ {summary.purchases}</h2>
        </div>

        <div className="card">
          <h4>Total Expenses</h4>
          <h2>₹ {summary.expenses}</h2>
        </div>

        <div className="card highlight">
          <h4>Net Profit</h4>
          <h2>₹ {summary.profit}</h2>
        </div>

      </div>

      {/* Charts */}

      <div className="dashboard-charts">

        <div className="chart-box">
          <h3>Business Overview</h3>
          <Bar data={barData} />
        </div>

        <div className="chart-box">
          <h3>Sales vs Expenses</h3>
          <Pie data={pieData} />
        </div>

      </div>

    </Layout>
  );
};

export default Dashboard;