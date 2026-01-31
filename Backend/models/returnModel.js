import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    itemId: String,

    productName: String,

    // ✅ IMAGE ARRAY (Cloudinary URLs)
    productImages: {
      type: [String],
      default: [],
    },

    reason: String,

    status: {
      type: String,
      default: "Pending",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ReturnRequest", returnSchema);
