import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchGraphs();
  }, []);

  const fetchStats = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/admin/dashboard/stats"
    );
    setStats(data);
  };

  const fetchGraphs = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/admin/dashboard/graphs"
    );
    setGraphData(data);
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

      {/* GRAPHS */}
      <div className="graphs">
        <LineChart width={500} height={300} data={graphData}>
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <CartesianGrid />
          <Line type="monotone" dataKey="orders" />
        </LineChart>

        <BarChart width={500} height={300} data={graphData}>
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <CartesianGrid />
          <Bar dataKey="profit" />
        </BarChart>
      </div>

    </div>
  );
};

export default Dashboard;
