import express from 'express';
import { loginUser, registerUser, adminLogin, forgotPassword } from '../controllers/userController.js';

const userRouter = express.Router();

// User registration
userRouter.post('/register', registerUser);

// User login
userRouter.post('/login', loginUser);

// Admin login
userRouter.post('/admin', adminLogin);

// Forgot password (update password)
userRouter.post('/forgot-password', forgotPassword); // ✅ New route

export default userRouter;
