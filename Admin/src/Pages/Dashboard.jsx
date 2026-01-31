import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/admin/dashboard/stats"
    );
    setStats(data);
  };

  return (
    <div className="dashboard">

      {/* STATS CARDS */}
      <div className="cards">
        <div className="card">Total Orders <h2>{stats.totalOrders}</h2></div>
        <div className="card">Products Available <h2>{stats.totalProducts}</h2></div>
        <div className="card">COD Orders <h2>{stats.codOrders}</h2></div>
        <div className="card">Online Orders <h2>{stats.onlineOrders}</h2></div>
      </div>

    </div>
  );
};

export default Dashboard;
