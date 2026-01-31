import express from 'express';
import {
  loginUser,
  verifyOtp,
  registerUser,
  adminLogin,
  forgotPassword,
  resetPassword
} from '../controllers/userController.js';

const userRouter = express.Router();

/* ================= USER AUTH ROUTES ================= */

// User registration
userRouter.post('/register', registerUser);

// Login → email + password (OTP send hoga)
userRouter.post('/login', loginUser);

// OTP verify → JWT token milega
userRouter.post('/verify-otp', verifyOtp);

// Admin login (same as before)
userRouter.post('/admin', adminLogin);

// Forgot password → OTP send
userRouter.post('/forgot-password', forgotPassword);

// Reset password → OTP verify + new password
userRouter.post('/reset-password', resetPassword);

export default userRouter;
