import express from "express";
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  toggleCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/create", adminAuth, createCoupon);
router.get("/all", adminAuth, getAllCoupons);
router.put("/update/:id", adminAuth, updateCoupon);
router.put("/toggle/:id", adminAuth, toggleCoupon);
router.delete("/delete/:id", adminAuth, deleteCoupon);

export default router;
