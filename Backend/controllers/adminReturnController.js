import Order from "../models/orderModel.js";
import sendMail from "../utils/sendMail.js";

export const updateReturnStatus = async (req, res) => {
  try {
    const { orderId, productId, status, reason } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const item = order.items.find(
      i => i.productId === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // ✅ UPDATE STATUS
    item.returnStatus = status;

    if (status === "Rejected") {
      item.returnRejectReason = reason;
    }

    await order.save();

    // 🔹 FETCH USER MANUALLY (IMPORTANT)
    const user = await userModel.findById(order.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    /* ================= EMAIL ================= */

    const messageHTML =
      status === "Approved"
        ? `
          <p style="color:green;font-weight:bold">
            ✅ Your return request has been approved
          </p>
          <p>
            Our pickup partner will contact you within
            <b>24–48 hours</b>.
          </p>
        `
        : `
          <p style="color:red;font-weight:bold">
            ❌ Your return request has been rejected
          </p>
          <p><b>Reason:</b> ${reason}</p>
        `;

    const emailHTML = `
      <h2>Hello ${user.name},</h2>

      ${messageHTML}

      <h3>Product Details</h3>
      <table border="1" cellpadding="8">
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Qty</th>
        </tr>
        <tr>
          <td>${item.name}</td>
          <td>₹${item.price}</td>
          <td>${item.quantity}</td>
        </tr>
      </table>

      <p><b>Order ID:</b> ${order.orderUniqueId}</p>

      <p>Thank you for shopping with us ❤️</p>
      <b>Belim Tails</b>
    `;

    await sendEmail({
      to: user.email,
      subject: `Return ${status} | Order ID: ${order.orderUniqueId}`,
      html: emailHTML
    });

    /* ======================================== */

    res.json({
      success: true,
      message: `Return ${status} & email sent`
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
