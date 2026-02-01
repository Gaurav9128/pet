import express from "express";
import Coupon from "../models/couponModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const today = new Date();

    const coupons = await Coupon.find({
      isActive: true,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: today } }
      ]
    });

    console.log("PUBLIC COUPONS 👉", coupons); // 🔥 DEBUG

    res.json({ success: true, coupons });
  } catch (error) {
    console.log("PUBLIC COUPON ERROR", error);
    res.json({ success: false });
  }
});

export default router;
