import nodemailer from "nodemailer";

const sendOrderMail = async (toEmail, order) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Calculate original total of all items
  const originalTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 👉 ITEM ROWS WITH FINAL AMOUNT PROPORTIONAL
  const itemsHTML = order.items
    .map((item) => {
      const itemTotal = item.price * item.quantity;
      // Proportionally calculate final total
      const adjustedTotal = Math.round((itemTotal / originalTotal) * order.amount);
      return `
        <tr>
          <td>${item.name}</td>
          <td>${item.size || "-"}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price}</td>
          <td>₹${adjustedTotal}</td>
        </tr>
      `;
    })
    .join("");

  const mailOptions = {
    from: `"Belim Tails" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🛒 Order Confirmed | Order ID: ${order.orderUniqueId}`,
    html: `
      <h2>Hello ${order.address.firstName},</h2>
      <p>Your order has been placed successfully.</p>

      <h3>📦 Order Details</h3>
      <table border="1" cellpadding="8" cellspacing="0" width="100%">
        <tr>
          <th>Product</th>
          <th>Size</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
        ${itemsHTML}
      </table>

      <br/>

      <p><b>Subtotal:</b> ₹${order.subTotal}</p>

      ${
        order.discountAmount > 0
          ? `<p><b>Coupon (${order.coupon?.code}):</b> -₹${order.discountAmount}</p>`
          : ""
      }

      <p><b>Delivery Fee:</b> ₹${order.deliveryCharge}</p>

      <h3>Total Amount: ₹${order.amount}</h3>

      <p><b>Payment Method:</b> ${order.paymentMethod}</p>

      <h3>🚚 Delivery Address</h3>
      <p>
        ${order.address.street}, ${order.address.city}<br/>
        ${order.address.state}, ${order.address.zipCode}<br/>
        ${order.address.country}<br/>
        📞 ${order.address.phone}
      </p>

      <p>Thank you for shopping with us ❤️</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOrderMail;
