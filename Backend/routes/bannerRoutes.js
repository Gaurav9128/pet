import express from "express";
import multer from "multer";
import {
  uploadBanner,
  getBanners,
  deleteBanner
} from "../controllers/bannerController.js";

const router = express.Router();

// ✅ Vercel safe storage
const upload = multer({
  storage: multer.memoryStorage()
});

// Routes
router.post("/upload", upload.single("image"), uploadBanner);
router.get("/", getBanners);
router.delete("/:id", deleteBanner);

export default router;
