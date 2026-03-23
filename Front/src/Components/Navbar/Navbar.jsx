import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  
  // 1. State to track logo clicks
  const [logoClickCount, setLogoClickCount] = useState(0);

  const {
    setShowSearch,
    setSearchQuery,
    token,
    setToken,
    getCartCount,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // 2. Handler for Logo Clicks
  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    
    if (newCount === 5) {
      // '_blank' ka matlab hai "Open in a new tab"
      window.open("https://pet-admin-two.vercel.app/", "_blank");
      
      // Redirect ke baad count reset kar dete hain
      setLogoClickCount(0);
    } else {
      setLogoClickCount(newCount);
      
      // Normal click par home page par le jayega (pehle 4 clicks tak)
      navigate("/");

      // Agar user 3 second tak dobara click nahi karta toh count reset ho jayega
      const timer = setTimeout(() => setLogoClickCount(0), 3000);
      return () => clearTimeout(timer);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) setUserEmail(email);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
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
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-top">
        <div className="navbar-left">
          <img
            src={assets.logo}
            alt="logo"
            className="logo"
            // 3. Updated onClick to use the handler
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }} 
          />
        </div>

        {/* ... Rest of your search bar code ... */}
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

        <div className="navbar-right">
          <Link to="/cart" className="cart-wrapper">
            <img src={assets.cart_icon} alt="cart" className="nav-icon" />
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
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
                onClick={() => isMobile && setShowUserMenu((prev) => !prev)}
              >
                👤 {userEmail.split("@")[0] || "Account"}
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <Link to="/payment" onClick={() => setShowUserMenu(false)}>My Orders</Link>
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