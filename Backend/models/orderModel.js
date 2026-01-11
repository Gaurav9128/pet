import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  orderUniqueId: {
    type: String,
    required: true,
    unique: true
  },

  userId: { type: String, required: true },

  items: [
    {
      productId: { type: String, required: true },
      name: { type: String },
      price: { type: Number },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String }
    }
  ],

  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: 'Order Placed' },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, default: false },
  date: { type: Number, default: Date.now }
})

const orderModel =
  mongoose.models.order || mongoose.model('order', orderSchema)

export default orderModel
