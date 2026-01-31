import express from 'express'
import {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  getProductById,
  updateProduct,
  removeProductImage
} from '../controllers/productController.js'

import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js'
import Product from '../models/productModel.js'

const productRouter = express.Router()

// ---------- LIST PRODUCTS ----------
productRouter.get('/list', listProducts)

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
)

// ---------- REMOVE PRODUCT ----------
productRouter.post('/remove', adminAuth, removeProduct)

// ---------- REMOVE PRODUCT IMAGE ----------
productRouter.post(
  '/remove-image',
  adminAuth,
  removeProductImage
)

// ---------- SINGLE PRODUCT ----------
productRouter.post('/single', singleProduct)

// ---------- UPDATE PRODUCT ----------
// ---------- UPDATE PRODUCT ----------
productRouter.post(
  '/update',
  adminAuth,
  upload.any(),     // 🔥 THIS IS THE FIX
  updateProduct
)

// ---------- TOGGLE AVAILABILITY ----------
productRouter.post('/toggleAvailability', adminAuth, async (req, res) => {
  try {
    const { id, isAvailable } = req.body

    const product = await Product.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.json({
      success: true,
      message: `Product marked ${isAvailable ? 'Available' : 'Unavailable'}`,
      product
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// ---------- GET PRODUCT BY ID (LAST) ----------
productRouter.get('/:id', getProductById)

export default productRouter
