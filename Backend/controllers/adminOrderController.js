import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";

/* ===========================
   GET ALL RETURN REQUESTS
=========================== */
export const getReturnRequests = async (req, res) => {
  try {
    const orders = await orderModel.find({
      "items.returnStatus": "Pending"
    });

    const returnRequests = [];

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.returnStatus === "Pending") {
          returnRequests.push({
            orderId: order._id,
            orderUniqueId: order.orderUniqueId,
            userId: order.userId,
            item
          });
        }
      });
    });

    res.json({ success: true, returnRequests });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ===========================
   APPROVE / REJECT RETURN
=========================== */
export const updateReturnStatus = async (req, res) => {
  try {
    const { orderId, productId, status, rejectReason } = req.body;

    // ✅ FIND ORDER
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // ✅ FIND ITEM (FIXED 🔥)
    const item = order.items.find(
      i => i.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    // ✅ DEBUG (optional)
    console.log("Reject Reason from frontend:", rejectReason);

    // ✅ UPDATE STATUS
    item.returnStatus = status;

    // ✅ HANDLE REJECT REASON (FIXED 🔥)
    if (status === "Rejected") {
      item.returnRejectReason =
        rejectReason && rejectReason.trim() !== ""
          ? rejectReason
          : "No reason provided";
    } else {
      item.returnRejectReason = "";
    }

    await order.save();

    // ✅ GET USER
    const user = await userModel.findById(order.userId);

    if (!user || !user.email) {
      return res.json({
        success: true,
        message: "Return updated but user email not found"
      });
    }

    /* ===========================
       EMAIL CONTENT
    =========================== */
    let subject = "";
    let html = "";

    // ✅ APPROVED EMAIL
    if (status === "Approved") {
      subject = "Return Approved – Pickup Scheduled";

      html = `
      <div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px">
        <div style="max-width:600px; background:#fff; margin:auto; padding:20px; border-radius:8px">
          <h2 style="color:#333">Hi ${user.name || "Customer"},</h2>
          <p>Your return request has been <b style="color:green">APPROVED</b>.</p>
          <p><b>Order ID:</b> ${order.orderUniqueId}</p>

          <table width="100%" border="1" cellspacing="0" cellpadding="10" style="border-collapse:collapse; margin-top:15px">
            <thead style="background:#f2f2f2">
              <tr>
                <th align="left">Product</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img src="${item.image[0]}" width="80" style="border-radius:6px; display:block; margin-bottom:6px"/>
                  ${item.name}
                </td>
                <td align="center">${item.quantity}</td>
                <td align="center">₹${item.price}</td>
              </tr>
            </tbody>
          </table>

          <p style="margin-top:15px">
            📦 <b>Pickup Message:</b><br/>
            Our pickup partner will contact you within 24–48 hours.
          </p>

          <hr style="margin:20px 0"/>
          <p style="font-size:14px;color:#666">
            Thank you for shopping with <b>Belim Tails</b> ❤️
          </p>
        </div>
      </div>
      `;
    }

    // ❌ REJECTED EMAIL (FIXED 🔥)
    if (status === "Rejected") {
      subject = "Return Rejected";

      html = `
      <div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px">
        <div style="max-width:600px; background:#fff; margin:auto; padding:20px; border-radius:8px">
          <h2>Hi ${user.name || "Customer"},</h2>
          <p>Your return request has been <b style="color:red">REJECTED</b>.</p>

          <p><b>Order ID:</b> ${order.orderUniqueId}</p>
          <p><b>Product:</b> ${item.name}</p>
          <p><b>Price:</b> ₹${item.price}</p>

          <p style="color:red">
            <b>Reason:</b> ${item.returnRejectReason}
          </p>

          <hr/>
          <p style="font-size:14px;color:#666">
            For further assistance, contact Belim Tails support.
          </p>
        </div>
      </div>
      `;
    }

    // ✅ SEND EMAIL
    await sendEmail({
      to: user.email,
      subject,
      html
    });

    res.json({
      success: true,
      message: `Return ${status} successfully & email sent`
    });

  } catch (error) {
    console.error("RETURN ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};