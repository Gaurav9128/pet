import Banner from "../models/Banner.js";
import { v2 as cloudinary } from "cloudinary";


// ✅ Upload Banner
// ✅ Upload Banner (Vercel Safe)
export const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 🔥 Upload from memory buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "banners" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }

        const banner = await Banner.create({
          imageUrl: result.secure_url,
          public_id: result.public_id,
        });

        res.status(200).json(banner);
      }
    );

    uploadStream.end(req.file.buffer);

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
