import promoBannerModel from "../models/promoBannerModel.js";
import { v2 as cloudinary } from "cloudinary";

/* ================= ADD BANNER ================= */
const addPromoBanner = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "promo_banners",
    });

    const banner = new promoBannerModel({
      image: result.secure_url,
      order: req.body.order,
    });

    await banner.save();

    res.json({
      success: true,
      message: "Promo Banner Added",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET BANNERS ================= */
const listPromoBanner = async (req, res) => {
  try {
    const banners = await promoBannerModel.find({}).sort({ order: 1 });

    res.json({
      success: true,
      banners: banners, // ✅ FIXED
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE BANNER ================= */
const deletePromoBanner = async (req, res) => {
  try {
    await promoBannerModel.findByIdAndDelete(req.params.id); // ✅ better

    res.json({
      success: true,
      message: "Banner Deleted",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { addPromoBanner, listPromoBanner, deletePromoBanner };