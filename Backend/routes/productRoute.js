import express from 'express'
import {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct
} from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import Product from '../models/productModel.js' // ✅ Product model import

const productRouter = express.Router();

// ---------- ADD PRODUCT ----------
productRouter.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
);

// ---------- REMOVE PRODUCT ----------
productRouter.post('/remove', adminAuth, removeProduct);

// ---------- SINGLE PRODUCT ----------
productRouter.post('/single', singleProduct);

// ---------- LIST PRODUCTS ----------
productRouter.get('/list', listProducts);

// ---------- TOGGLE AVAILABILITY ----------
productRouter.post('/toggleAvailability', adminAuth, async (req, res) => {
  try {
    const { id, isAvailable } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: `Product marked ${isAvailable ? 'Available' : 'Unavailable'}`,
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default productRouter;
