import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// ================= ADD PRODUCT =================
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      details,
      rating
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image"
        });
        return result.secure_url;
      })
    );

    const safeRating = Math.min(Math.max(Number(rating) || 4, 1), 5);

    const productData = {
      name,
      description,
      category,
      subCategory,
      price: Number(price),
      bestseller: bestseller === "true",
      rating: safeRating,
      sizes: sizes ? JSON.parse(sizes) : [],
      details: details ? JSON.parse(details) : [],
      image: imagesUrl,
      date: Date.now()
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added", product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= LIST PRODUCTS =================
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ================= REMOVE PRODUCT =================
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ================= SINGLE PRODUCT =================
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ================= GET PRODUCT BY ID =================
const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product)
      return res.json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ================= UPDATE PRODUCT =================
const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      category,
      subCategory,
      bestseller,
      isAvailable,
      details
    } = req.body;

    // 🔹 Parse sizes
    let sizes = [];
    if (req.body.sizes) {
      sizes = Array.isArray(req.body.sizes)
        ? req.body.sizes.map((s) => JSON.parse(s))
        : [JSON.parse(req.body.sizes)];
    }

    // 🔹 Upload new images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "image"
          });
          return result.secure_url;
        })
      );
    }

    const updateData = {
      name,
      description: description || "No description",
      category,
      subCategory: subCategory || "General",
      bestseller: bestseller || false,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      details: details ? JSON.parse(details) : []
    };

    if (sizes.length) updateData.sizes = sizes;
    if (images.length) updateData.image = images;

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      return res.json({ success: false, message: "Product not found" });

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ================= REMOVE PRODUCT IMAGE (NEW) =================
const removeProductImage = async (req, res) => {
  try {
    const { productId, imageUrl } = req.body;

    if (!productId || !imageUrl) {
      return res.json({
        success: false,
        message: "Missing productId or imageUrl"
      });
    }

    // 🔹 Remove image from MongoDB
    await productModel.findByIdAndUpdate(productId, {
      $pull: { image: imageUrl }
    });

    // 🔹 Remove image from Cloudinary
    const publicId = imageUrl
      .split("/")
      .pop()
      .split(".")[0];

    await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      message: "Image removed successfully"
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  getProductById,
  updateProduct,
  removeProductImage   // 👈 VERY IMPORTANT
};
