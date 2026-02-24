import Coupon from "../models/couponModel.js";

/* ================= CREATE COUPON ================= */
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json({ success: true, coupon });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ================= APPLY COUPON ================= */
export const applyCoupon = async (req, res) => {
  try {

    const { couponCode, cartAmount } = req.body;

    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

    // Coupon exist check
    if (!coupon) {
      return res.json({ success: false, message: "Invalid coupon code" });
    }

    // Active check
    if (!coupon.isActive) {
      return res.json({ success: false, message: "Coupon is inactive" });
    }

    // Expiry check
    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      return res.json({ success: false, message: "Coupon expired" });
    }

    // Minimum order amount check
    if (cartAmount < coupon.minOrderAmount) {
      return res.json({
        success: false,
        message: `Minimum order amount ₹${coupon.minOrderAmount} required`
      });
    }

    let discount = 0;

    // Percentage type
    if (coupon.type === "percentage") {
      discount = (cartAmount * coupon.value) / 100;
    }

    // Fixed type
    if (coupon.type === "fixed") {
      discount = coupon.value;
    }

    res.json({
      success: true,
      couponCode: coupon.code,
      discount: Math.round(discount),
      minOrderAmount: coupon.minOrderAmount  // 👈 VERY IMPORTANT
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
/* ================= GET ALL COUPONS ================= */
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ================= UPDATE COUPON ================= */
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ success: true, coupon });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ================= TOGGLE COUPON ================= */
export const toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ success: true, coupon });
  } catch (error) {
    res.json({ success: false });
  }
};

/* ================= DELETE COUPON ================= */
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
};
