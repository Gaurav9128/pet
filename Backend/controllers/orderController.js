import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Coupon from "../models/couponModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";
import generateOrderId from "../utils/generateOrderId.js";
import sendOrderMail from "../utils/sendOrderMail.js";

/* ================= GLOBAL ================= */
const currency = "inr";
const deliveryCharge = 50; // ✅ SAME AS FRONTEND

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ================= HELPER ================= */
const calculateSubTotal = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

const finalizeOrder = async (userId, orderData) => {
  // Clear user cart
  await userModel.findByIdAndUpdate(userId, { cartData: {} });
  // Send email with correct fields
  await sendOrderMail(orderData.address.email, orderData);
};

/* ================= COD ORDER ================= */
const placeOrder = async (req, res) => {
  try {
    const { userId, items, address, couponCode } = req.body;

    const orderUniqueId = await generateOrderId(orderModel);
    const subTotal = calculateSubTotal(items);

    let discount = 0;
    let appliedCoupon = null;

    /* ========== COUPON VALIDATION ========== */
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (!coupon) {
        return res.json({ success: false, message: "Invalid coupon" });
      }

      // ✅ expiry check
      if (coupon.expiryDate) {
        const expiry = new Date(coupon.expiryDate);
        expiry.setHours(23, 59, 59, 999);
        if (Date.now() > expiry.getTime()) {
          return res.json({ success: false, message: "Coupon Expired" });
        }
      }

      // ✅ min cart value
      if (subTotal < coupon.minCartValue) {
        return res.json({
          success: false,
          message: `Minimum ₹${coupon.minCartValue} required`,
        });
      }

      // ✅ FIX: usedBy safe check
      coupon.usedBy = coupon.usedBy || [];

      if (coupon.usedBy.includes(userId)) {
        return res.json({
          success: false,
          message: "Coupon already used",
        });
      }

      // ✅ discount calculation
      discount =
        coupon.discountType === "flat"
          ? coupon.discountValue
          : (subTotal * coupon.discountValue) / 100;

      if (coupon.maxDiscount > 0) {
        discount = Math.min(discount, coupon.maxDiscount);
      }

      appliedCoupon = {
        code: coupon.code,
        discount: Math.round(discount),
      };

      // ✅ update coupon usage
      coupon.usedBy.push(userId);
      coupon.usedCount += 1;
      await coupon.save();
    }

    const finalAmount = Math.round(
      Math.max(subTotal - discount + deliveryCharge, 0)
    );

    const orderDataForMail = {
      orderUniqueId,
      userId,
      items,
      address,
      subTotal: Math.round(subTotal),
      discountAmount: Math.round(discount),
      deliveryCharge,
      amount: finalAmount,
      coupon: appliedCoupon,
      paymentMethod: "COD",
      payment: false,
      status: "Placed",
      date: Date.now(),
    };

    await orderModel.create(orderDataForMail);
    await finalizeOrder(userId, orderDataForMail);

    res.json({ success: true, orderUniqueId });
  } catch (error) {
    console.log("ORDER ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};


/* ================= STRIPE ================= */
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address, couponCode } = req.body;
    const { origin } = req.headers;

    const orderUniqueId = await generateOrderId(orderModel);
    const subTotal = calculateSubTotal(items);

    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (coupon) {
        discount =
          coupon.discountType === "flat"
            ? coupon.discountValue
            : (subTotal * coupon.discountValue) / 100;

        if (coupon.maxDiscount > 0) {
          discount = Math.min(discount, coupon.maxDiscount);
        }

        appliedCoupon = {
          code: coupon.code,
          discount: Math.round(discount),
        };
      }
    }

    const finalAmount = Math.round(Math.max(subTotal - discount + deliveryCharge, 0));

    const orderDataForMail = {
      orderUniqueId,
      userId,
      items,
      address,
      subTotal: Math.round(subTotal),
      discountAmount: Math.round(discount),
      deliveryCharge,
      amount: finalAmount,
      coupon: appliedCoupon,
      paymentMethod: "Stripe",
      payment: false,
      status: "Placed",
      date: Date.now(),
    };

    const newOrder = await orderModel.create(orderDataForMail);

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url, orderUniqueId });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ================= VERIFY STRIPE ================= */
const verifyStripe = async (req, res) => {
  try {
    const { orderId, success, userId } = req.body;

    if (success === "true") {
      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true },
        { new: true }
      );

      await finalizeOrder(userId, order);
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ================= RAZORPAY ================= */
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, address, couponCode } = req.body;

    const orderUniqueId = await generateOrderId(orderModel);
    const subTotal = calculateSubTotal(items);

    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (coupon) {
        discount =
          coupon.discountType === "flat"
            ? coupon.discountValue
            : (subTotal * coupon.discountValue) / 100;

        if (coupon.maxDiscount > 0) {
          discount = Math.min(discount, coupon.maxDiscount);
        }

        appliedCoupon = {
          code: coupon.code,
          discount: Math.round(discount),
        };
      }
    }

    const finalAmount = Math.round(Math.max(subTotal - discount + deliveryCharge, 0));

    const orderDataForMail = {
      orderUniqueId,
      userId,
      items,
      address,
      subTotal: Math.round(subTotal),
      discountAmount: Math.round(discount),
      deliveryCharge,
      amount: finalAmount,
      coupon: appliedCoupon,
      paymentMethod: "Razorpay",
      payment: false,
      status: "Placed",
      date: Date.now(),
    };

    const newOrder = await orderModel.create(orderDataForMail);

    const options = {
      amount: finalAmount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (err) return res.json({ success: false });
      res.json({ success: true, order, orderUniqueId });
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ================= VERIFY RAZORPAY ================= */
const verifyRazorpay = async (req, res) => {
  try {
    const { userId, razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      const order = await orderModel.findByIdAndUpdate(
        orderInfo.receipt,
        { payment: true },
        { new: true }
      );

      await finalizeOrder(userId, order);
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ================= USER ORDERS ================= */
const userOrders = async (req, res) => {
  const { userId } = req.body;
  const orders = await orderModel.find({ userId });
  res.json({ success: true, orders });
};

/* ================= RETURN ================= */
const returnRequest = async (req, res) => {
  try {
    const { orderId, itemId, reason } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false });

    const item = order.items.id(itemId);
    if (!item) return res.json({ success: false });

    if (item.returnStatus) {
      return res.json({ success: false, message: "Already requested" });
    }

    item.returnStatus = "Pending";
    item.returnReason = reason || "";
    await order.save();

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ================= ADMIN ================= */
const allOrders = async (req, res) => {
  const orders = await orderModel.find({});
  res.json({ success: true, orders });
};

const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;
  await orderModel.findByIdAndUpdate(orderId, { status });
  res.json({ success: true });
};

/* ================= EXPORT ================= */
export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  verifyStripe,
  verifyRazorpay,
  userOrders,
  allOrders,
  updateStatus,
  returnRequest,
};
