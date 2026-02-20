import React, { useContext, useState } from 'react';
import './LoginPopUp.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginPopUp = ({ setShowLogin }) => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, backendUrl } = useContext(StoreContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false);

  /* ================= SUBMIT HANDLER ================= */
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let response;

      /* ===== SIGN UP (SEND OTP) ===== */
      if (currentState === 'Sign Up' && !otpStep) {

        response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password
        });

        if (response.data.success) {
          setOtpStep(true);
          toast.info('OTP sent to your email for verification');
          return;
        }

        /* ===== VERIFY SIGNUP OTP ===== */
      } else if (currentState === 'Sign Up' && otpStep) {

        // ✅ FIXED ROUTE HERE
        response = await axios.post(`${backendUrl}/api/user/verify-otp`, {
          email,
          otp
        });

        if (response.data.success) {
          toast.success('Account verified successfully 🎉 Please login');
          resetAll();
          setCurrentState('Login');
          return;
        }

        /* ===== LOGIN ===== */
      } else if (currentState === 'Login' && !otpStep) {

        response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password
        });

        if (response.data.otpRequired) {
          setOtpStep(true);
          toast.info('OTP sent to your email');
          return;
        }

        /* ===== VERIFY LOGIN OTP ===== */
      } else if (currentState === 'Login' && otpStep) {

        response = await axios.post(`${backendUrl}/api/user/verify-otp`, {
          email,
          otp
        });

        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          setToken(response.data.token);
          toast.success("Login successful 🔐");

          setTimeout(() => {
            resetAll();
            setShowLogin(false);
            navigate("/");
          }, 800);
        }

        /* ===== FORGOT PASSWORD (SEND OTP) ===== */
      } else if (currentState === 'Forgot Password' && !otpStep) {

        response = await axios.post(`${backendUrl}/api/user/forgot-password`, {
          email
        });

        if (response.data.success) {
          setOtpStep(true);
          toast.info('OTP sent to your email');
          return;
        }

        /* ===== RESET PASSWORD ===== */
      } else if (currentState === 'Forgot Password' && otpStep) {

        response = await axios.post(`${backendUrl}/api/user/reset-password`, {
          email,
          otp,
          newPassword
        });

        if (response.data.success) {
          toast.success('Password reset successful');
          resetAll();
          setCurrentState('Login');
          return;
        }
      }

      if (!response?.data?.success) {
        toast.error(response?.data?.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  /* ================= RESET ================= */
  const resetAll = () => {
    setName('');
    setEmail('');
    setPassword('');
    setNewPassword('');
    setOtp('');
    setOtpStep(false);
  };

  /* ================= LOGOUT ================= */
  const logoutHandler = () => {
    localStorage.removeItem('token');
    setToken('');
    resetAll();
    setCurrentState('Login');
    toast.success('Logged out 👋');
    setShowLogin(true);
    navigate('/');
  };

  return (
    <div className="login-PopUp">
      <div className="login-PopUp-container">

        <div className="login-popup-title">
          <h2>{token ? 'Welcome' : currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="close"
            className="close-icon"
          />
        </div>

        {token ? (
          <div className="logged-in-box">
            <p>You are logged in 🎉</p>
            <button onClick={logoutHandler} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmitHandler}>
            <div className="login-popup-inputs">

              {currentState === 'Sign Up' && !otpStep && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {(currentState === 'Login' || currentState === 'Sign Up') && !otpStep && (
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              )}

              {otpStep && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              )}

              {currentState === 'Forgot Password' && otpStep && (
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              )}

            </div>

            <button type="submit" className="main-btn">
              {otpStep && currentState === 'Sign Up'
                ? 'Verify & Create Account'
                : otpStep && currentState === 'Forgot Password'
                  ? 'Reset Password'
                  : otpStep
                    ? 'Verify OTP'
                    : currentState}
            </button>

            {!otpStep && currentState === 'Login' && (
              <div className="login-popup-links">
                <button type="button" onClick={() => {
                  resetAll();
                  setCurrentState('Forgot Password');
                }}>
                  Forgot Password?
                </button>

                <button type="button" onClick={() => {
                  resetAll();
                  setCurrentState('Sign Up');
                }}>
                  Create Account
                </button>
              </div>
            )}

          </form>
        )}

      </div>
    </div>
  );
};

export default LoginPopUp;
