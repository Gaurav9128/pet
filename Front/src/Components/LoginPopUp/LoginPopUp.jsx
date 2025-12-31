import React, { useContext, useState } from 'react';
import './LoginPopUp.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPopUp = ({ setShowLogin }) => {
  const [currentState, setCurrentState] = useState('Login');

  // ✅ token bhi liya
  const { token, setToken, backendUrl } = useContext(StoreContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* ================= LOGIN / SIGNUP ================= */
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let response;

      if (currentState === 'Sign Up') {
        response = await axios.post(
          `${backendUrl}/api/user/register`,
          { name, email, password }
        );
      } else {
        response = await axios.post(
          `${backendUrl}/api/user/login`,
          { email, password }
        );
      }

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);

        toast.success('You successfully logged in ✅');

        setName('');
        setEmail('');
        setPassword('');
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

        {/* ================= USER LOGGED IN ================= */}
        {token ? (
          <div className="logged-in-box">
            <p>You are logged in successfully 🎉</p>
            <button onClick={logoutHandler} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          /* ================= LOGIN / SIGNUP FORM ================= */
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

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit">
              {currentState === 'Sign Up' ? 'Create account' : 'Login'}
            </button>

            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>I agree to the Terms of Service and Privacy Policy</p>
            </div>

            {currentState === 'Login' ? (
              <p>
                Create a new account?{' '}
                <span onClick={() => setCurrentState('Sign Up')}>
                  Click Here
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <span onClick={() => setCurrentState('Login')}>
                  Login Here
                </span>
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPopUp;
