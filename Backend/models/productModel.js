import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  image: {
    type: [String],
    required: true
  },

  category: {
    type: String,
    required: true
  },

  subCategory: {
    type: String,
    required: true
  },

  sizes: {
    type: [
      {
        label: { type: String, required: true },
        mrp: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    required: true
  },

  // ⭐ NEW FIELD: Product Details (Dynamic)
  details: {
    type: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true }
      }
    ],
    default: []
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4
  },

  bestseller: {
    type: Boolean,
    default: false
  },

  date: {
    type: Number,
    default: Date.now
  }
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
