import express from "express";
import {
  getReturnRequests,
  updateReturnStatus
} from "../controllers/adminOrderController.js";

import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/return-requests", adminAuth, getReturnRequests);
router.post("/update-return-status", adminAuth, updateReturnStatus);

export default router;
