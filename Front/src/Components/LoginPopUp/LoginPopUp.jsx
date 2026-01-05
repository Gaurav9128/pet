import React, { useContext, useState } from 'react';
import './LoginPopUp.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPopUp = ({ setShowLogin }) => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, backendUrl } = useContext(StoreContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  /* ================= LOGIN / SIGNUP ================= */
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let response;

      if (currentState === 'Sign Up') {
        response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
      } else if (currentState === 'Forgot Password') {
        // Forgot password API call
        response = await axios.post(`${backendUrl}/api/user/forgot-password`, {
          email,
          newPassword,
        });
      } else {
        response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
      }

      if (response.data.success) {
        if (currentState !== 'Forgot Password') {
          localStorage.setItem('token', response.data.token);
          setToken(response.data.token);
          toast.success('You successfully logged in ✅');
        } else {
          toast.success('Password updated successfully ✅');
        }

        setName('');
        setEmail('');
        setPassword('');
        setNewPassword('');
        if (currentState === 'Forgot Password') setCurrentState('Login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  /* ================= LOGOUT ================= */
  const logoutHandler = () => {
    localStorage.removeItem('token');
    setToken('');
    setCurrentState('Login');
    toast.success('Logged out successfully 👋');
  };

  return (
    <div className="login-PopUp">
      <div className="login-PopUp-container">
        {/* ❌ CLOSE ICON */}
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
            <p>You are logged in successfully 🎉</p>
            <button onClick={logoutHandler} className="logout-btn">Logout</button>
          </div>
        ) : (
          <form onSubmit={onSubmitHandler}>
            <div className="login-popup-inputs">
              {currentState === 'Sign Up' && (
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

              {(currentState === 'Login' || currentState === 'Sign Up') && (
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              )}

              {currentState === 'Forgot Password' && (
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              )}
            </div>

            <button type="submit">
              {currentState === 'Sign Up'
                ? 'Create account'
                : currentState === 'Forgot Password'
                ? 'Update Password'
                : 'Login'}
            </button>

            {(currentState === 'Login' || currentState === 'Sign Up') && (
              <div className="login-popup-condition">
                <input type="checkbox" required />
                <p>I agree to the Terms of Service and Privacy Policy</p>
              </div>
            )}

            {currentState === 'Login' && (
              <>
                <p>
                  Forgot password?{' '}
                  <span onClick={() => setCurrentState('Forgot Password')}>
                    Click Here
                  </span>
                </p>
                <p>
                  Create a new account?{' '}
                  <span onClick={() => setCurrentState('Sign Up')}>Click Here</span>
                </p>
              </>
            )}

            {currentState === 'Sign Up' && (
              <p>
                Already have an account?{' '}
                <span onClick={() => setCurrentState('Login')}>Login Here</span>
              </p>
            )}

            {currentState === 'Forgot Password' && (
              <p>
                Remembered your password?{' '}
                <span onClick={() => setCurrentState('Login')}>Login Here</span>
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPopUp;
