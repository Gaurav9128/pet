import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    setShowSearch,
    setSearchQuery,
    getTotalCartAmount,
    token,
    setToken,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) setUserEmail(email);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setToken("");
    setUserEmail("");
    setShowUserMenu(false);
  };

  return (
    <div className="navbar">

      <div className="navbar-top">

        {/* LEFT */}
        <div className="navbar-left">
          <img
            src={assets.logo}
            alt="logo"
            className="logo"
            onClick={() => navigate("/")}
          />
        </div>

        {/* CENTER SEARCH */}
        <div className="search-bar">
          <select className="location-select">
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
          </select>

          <input
            type="text"
            placeholder="Search for products..."
            className="search-input"
            onFocus={() => {
              setShowSearch(true);
              navigate("/cats");
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <img src={assets.search_icon} alt="search" className="search-icon" />
        </div>

        {/* RIGHT */}
        <div className="navbar-right">

          <Link to="/cart" className="cart-wrapper">
            <img src={assets.cart_icon} alt="cart" className="nav-icon" />
            {getTotalCartAmount() > 0 && <span className="cart-badge">0</span>}
          </Link>

          {!token ? (
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Account
            </button>
          ) : (
            <div
              className="user-menu"
              onMouseEnter={() => !isMobile && setShowUserMenu(true)}
              onMouseLeave={() => !isMobile && setShowUserMenu(false)}
            >
              <button
                className="user-btn"
                onClick={() => isMobile && setShowUserMenu(prev => !prev)}
              >
                👤 {userEmail || "Account"}
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <Link to="/payment">My Orders</Link>
                  <button onClick={logoutHandler} className="logout-btn">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Navbar;