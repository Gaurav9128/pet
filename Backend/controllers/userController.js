import validator from 'validator';
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";

/* ================= JWT TOKEN ================= */
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/* ================= OTP GENERATOR ================= */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* ================= EMAIL SENDER ================= */
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Belim Tails Security" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

/* ==================== USER LOGIN (OTP BASED) ==================== */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // 🔐 Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    // 📧 Send OTP Email
    await sendEmail(
      email,
      "Belim Tails Login OTP",
      `<h2>Login Verification</h2>
       <p>Your OTP is:</p>
       <h1>${otp}</h1>
       <p>Valid for 5 minutes.</p>
       <p>If this was not you, please reset your password immediately.</p>`
    );

    res.json({
      success: true,
      otpRequired: true,
      message: "OTP sent to your email"
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ==================== VERIFY LOGIN OTP ==================== */
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      user.otpExpire < Date.now()
    ) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    const token = createToken(user._id);

    res.json({ success: true, token });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ==================== USER REGISTER (WITH OTP) ==================== */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🔐 Generate OTP
    const otp = generateOTP();

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      otp: otp,
      otpExpire: Date.now() + 5 * 60 * 1000 // 5 min
    });

    await newUser.save();

    // 📧 Send OTP Email
    await sendEmail(
      email,
      "Belim Tails Account Verification OTP",
      `<h2>Account Verification</h2>
       <p>Your OTP is:</p>
       <h1>${otp}</h1>
       <p>Valid for 5 minutes.</p>`
    );

    res.json({
      success: true,
      message: "OTP sent to your email"
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* ==================== ADMIN LOGIN (UNCHANGED) ==================== */
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ==================== FORGOT PASSWORD (SEND OTP) ==================== */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendEmail(
      email,
      "Belim Tails Password Reset OTP",
      `<h2>Password Reset</h2>
       <h1>${otp}</h1>
       <p>OTP valid for 5 minutes.</p>`
    );

    res.json({ success: true, message: "OTP sent to email" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ==================== RESET PASSWORD WITH OTP ==================== */
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await userModel.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      user.otpExpire < Date.now()
    ) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    if (newPassword.length < 8) {
      return res.json({ success: false, message: "Password too short" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  loginUser,
  verifyOtp,
  registerUser,
  adminLogin,
  forgotPassword,
  resetPassword
};
