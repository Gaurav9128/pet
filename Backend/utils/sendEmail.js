import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ===========================
   GENERIC EMAIL SENDER
=========================== */
export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Belim Tails" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

/* ===========================
   OTP EMAIL (EXISTING FEATURE)
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
