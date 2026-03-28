import React, { useContext, useState, useEffect } from 'react';
import './LoginPopUp.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import Swal from 'sweetalert2'; 
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

  const [countdown, setCountdown] = useState(0);

  /* ================= HELPERS (SWEETALERT CONFIG) ================= */
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  /* ================= COUNTDOWN TIMER ================= */
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  /* ================= SUBMIT HANDLER ================= */
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let response;

      // --- SIGN UP LOGIC ---
      if (currentState === 'Sign Up' && !otpStep) {
        response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        if (response.data.success) {
          setOtpStep(true);
          setCountdown(30);
          Toast.fire({ icon: 'info', title: 'OTP sent to your email' });
          return;
        }
      } 
      else if (currentState === 'Sign Up' && otpStep) {
        response = await axios.post(`${backendUrl}/api/user/verify-otp`, { email, otp });
        if (response.data.success) {
          Swal.fire({ icon: 'success', title: 'Verified!', text: 'Account verified successfully 🎉 Please login', confirmButtonColor: '#ff4321' });
          resetAll();
          setCurrentState('Login');
          return;
        }
      } 

      // --- LOGIN LOGIC ---
      else if (currentState === 'Login' && !otpStep) {
        response = await axios.post(`${backendUrl}/api/user/login`, { email, password });

        if (response.data.otpRequired) {
          setOtpStep(true);
          setCountdown(30);
          Toast.fire({ icon: 'info', title: 'OTP sent to your email' });
          return;
        }

        if (response.data.success) {
          // ✅ SUCCESS: Save Token and Email for Auto-fill
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('email', email); 
          
          setToken(response.data.token);
          Toast.fire({ icon: 'success', title: 'Login successful 🔐' });
          
          setTimeout(() => {
            resetAll();
            setShowLogin(false);
            navigate("/");
          }, 1500);
          return;
        }
      } 

      // --- LOGIN WITH OTP VERIFICATION ---
      else if (currentState === 'Login' && otpStep) {
        response = await axios.post(`${backendUrl}/api/user/verify-otp`, { email, otp });

        if (response.data.success) {
          // ✅ SUCCESS: Save Token and Email for Auto-fill
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('email', email);

          setToken(response.data.token);
          Toast.fire({ icon: 'success', title: 'Login successful 🔐' });

          setTimeout(() => {
            resetAll();
            setShowLogin(false);
            navigate("/");
          }, 1500);
        }
      } 

      // --- FORGOT PASSWORD LOGIC ---
      else if (currentState === 'Forgot Password' && !otpStep) {
        response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
        if (response.data.success) {
          setOtpStep(true);
          setCountdown(30);
          Toast.fire({ icon: 'info', title: 'OTP sent to your email' });
          return;
        }
      } 
      else if (currentState === 'Forgot Password' && otpStep) {
        response = await axios.post(`${backendUrl}/api/user/reset-password`, { email, otp, newPassword });
        if (response.data.success) {
          Swal.fire({ icon: 'success', title: 'Success', text: 'Password reset successful', confirmButtonColor: '#ff4321' });
          resetAll();
          setCurrentState('Login');
          return;
        }
      }

      if (!response?.data?.success) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: response?.data?.message });
      }

    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Something went wrong' });
    }
  };

  /* ================= RESEND OTP ================= */
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    try {
      let response;
      if (currentState === "Sign Up") response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
      else if (currentState === "Login") response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
      else if (currentState === "Forgot Password") response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });

      if (response.data.success || response.data.otpRequired) {
        setCountdown(30);
        Toast.fire({ icon: 'success', title: 'OTP resent successfully 📩' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', text: error.response?.data?.message || "Failed to resend OTP" });
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
    setCountdown(0);
  };

  /* ================= LOGOUT ================= */
  const logoutHandler = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4321',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('email'); // ✅ Logout par email bhi clear hogi
        setToken('');
        resetAll();
        setCurrentState('Login');
        Toast.fire({ icon: 'success', title: 'Logged out 👋' });
        setShowLogin(true);
        navigate('/');
      }
    });
  };

  return (
    <div className="login-PopUp">
      <div className="login-PopUp-container">
        <div className="login-popup-title">
          <h2>{token ? 'Welcome' : currentState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close" className="close-icon" />
        </div>

        {token ? (
          <div className="logged-in-box">
            <p>You are logged in 🎉</p>
            <button onClick={logoutHandler} className="logout-btn">Logout</button>
          </div>
        ) : (
          <form onSubmit={onSubmitHandler}>
            <div className="login-popup-inputs">
              {currentState === 'Sign Up' && !otpStep && (
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
              )}
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              
              {(currentState === 'Login' || currentState === 'Sign Up') && !otpStep && (
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              )}

              {otpStep && (
                <>
                  <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                  <div className="resend-otp">
                    <button type="button" onClick={handleResendOtp} disabled={countdown > 0} className="resend-btn">
                      {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </>
              )}

              {currentState === 'Forgot Password' && otpStep && (
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              )}
            </div>

            <button type="submit" className="main-btn">
              {otpStep && currentState === 'Sign Up' ? 'Verify & Create Account' : 
               otpStep && currentState === 'Forgot Password' ? 'Reset Password' : 
               otpStep ? 'Verify OTP' : currentState}
            </button>

            {!otpStep && currentState === 'Login' && (
              <div className="login-popup-links">
                <button type="button" onClick={() => { resetAll(); setCurrentState('Forgot Password'); }}>Forgot Password?</button>
                <button type="button" onClick={() => { resetAll(); setCurrentState('Sign Up'); }}>Create Account</button>
              </div>
            )}
            
            {!otpStep && (currentState === 'Sign Up' || currentState === 'Forgot Password') && (
               <div className="login-popup-links">
                  <button type="button" onClick={() => { resetAll(); setCurrentState('Login'); }}>Already have an account? Login</button>
               </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPopUp;