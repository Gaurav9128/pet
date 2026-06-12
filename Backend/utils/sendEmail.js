import nodemailer from "nodemailer";

/* ===========================
   SMTP TRANSPORTER (LIVE FIX)
=========================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Belimtails@gmail.com",          // 👈 apni Gmail ID
    pass: "siossscjjkkxmwvg"       // 👈 Gmail App Password
  }
});

/* ===========================
   GENERIC EMAIL SENDER
=========================== */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Belim Tails" <yourgmail@gmail.com>`,
      to,
      subject,
      html
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};

/* ===========================
   OTP EMAIL
=========================== */
export const sendOTPEmail = async (to, otp) => {
  await sendEmail({
    to,
    subject: "Your Login OTP",
    html: `
      <h3>Belim Tails Login Verification</h3>
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 5 minutes.</p>
    `
  });
};
