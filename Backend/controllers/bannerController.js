import Banner from "../models/Banner.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ✅ Upload Banner
export const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "banners",
    });

    const banner = await Banner.create({
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });

    fs.unlinkSync(req.file.path);

    res.status(200).json(banner);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Active Banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json(banners);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Banner (Cloudinary + MongoDB)
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // 🔥 Delete image from Cloudinary
    await cloudinary.uploader.destroy(banner.public_id);

    // 🔥 Delete from MongoDB
    await Banner.findByIdAndDelete(id);

    res.status(200).json({ message: "Banner deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
