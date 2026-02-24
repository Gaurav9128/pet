import express from "express";
import Coupon from "../models/couponModel.js";

const router = express.Router();

router.post("/apply", async (req, res) => {
  try {
    const { couponCode, cartAmount } = req.body;

    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.json({ success: false, message: "Invalid Coupon Code" });
    }

    // ✅ FIXED EXPIRY CHECK
    if (coupon.expiryDate) {
      const expiry = new Date(coupon.expiryDate);
      expiry.setHours(23, 59, 59, 999);

      if (Date.now() > expiry.getTime()) {
        return res.json({
          success: false,
          message: "Coupon Expired",
        });
      }
    }

    if (cartAmount < coupon.minCartValue) {
      return res.json({
        success: false,
        message: `Minimum cart value ₹${coupon.minCartValue} required`,
      });
    }

    let discount =
      coupon.discountType === "flat"
        ? coupon.discountValue
        : (cartAmount * coupon.discountValue) / 100;

    if (coupon.maxDiscount > 0) {
      discount = Math.min(discount, coupon.maxDiscount);
    }

    return res.json({
      success: true,
      discount,
      finalAmount: cartAmount - discount,
      couponCode: coupon.code,
      minCartValue: coupon.minCartValue   // 👈 VERY IMPORTANT
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
