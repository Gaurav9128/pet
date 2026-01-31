import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["flat", "percentage"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
    },

    minCartValue: {
      type: Number,
      default: 0,
    },

    maxDiscount: {
      type: Number,
      default: 0, // 0 = no limit
    },

    expiryDate: {
  type: Date,
  default: null
},

    isActive: {
      type: Boolean,
      default: true,
    },

    usedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
