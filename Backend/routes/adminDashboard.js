// routes/adminDashboard.js
import express from "express";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

const router = express.Router();

/* =========================
   DASHBOARD STATS
========================= */
router.get("/stats", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const codOrders = await Order.countDocuments({
      paymentMethod: "COD"
    });

    const onlineOrders = await Order.countDocuments({
      paymentMethod: { $ne: "COD" }
    });

    res.json({
      totalOrders,
      totalProducts,
      codOrders,
      onlineOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   DASHBOARD GRAPHS
========================= */
router.get("/graphs", async (req, res) => {
  try {
    const orders = await Order.find();

    const graphData = {};

    orders.forEach(order => {
      // createdAt safe fallback
      const date = order.createdAt
        ? new Date(order.createdAt)
        : new Date();

      const month = date.getMonth() + 1; // 1–12

      if (!graphData[month]) {
        graphData[month] = {
          month,
          orders: 0,
          profit: 0
        };
      }

      graphData[month].orders += 1;
      graphData[month].profit += order.totalAmount || 0;
    });

    res.json(Object.values(graphData));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
