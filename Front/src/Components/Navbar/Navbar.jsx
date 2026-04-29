import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { ChevronDown, User } from "lucide-react";

const Navbar = ({ setShowLogin }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [logoClickCount, setLogoClickCount] = useState(0);

  const { setShowSearch, setSearchQuery, token, setToken, getCartCount } = useContext(StoreContext);
  const navigate = useNavigate();

  // Category Mapping Logic
  const categoryMap = {
    "CAT": ["cats"],
    "DOG": ["dogs"],
    "BRANDS": ["brand"],
    "ACCESSORIES": ["Accessories"],
    "OTHER": ["Other"],
  };

  const handleSubNavClick = (menuName) => {
    const categoryValues = categoryMap[menuName];
    if (categoryValues && Array.isArray(categoryValues)) {
      const queryString = categoryValues.join(",");
      navigate(`/cats?category=${queryString}`);
    }
  };

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    if (newCount === 5) {
      window.open("https://pet-admin-two.vercel.app/", "_blank");
      setLogoClickCount(0);
    } else {
      setLogoClickCount(newCount);
      navigate("/");
      const timer = setTimeout(() => setLogoClickCount(0), 3000);
      return () => clearTimeout(timer);
    }
  };

  // Fixed: Email fetching from "email" key instead of "userEmail"
  useEffect(() => {
    const email = localStorage.getItem("email"); // Apki storage key "email" hai
    if (email) {
      setUserEmail(email);
    } else {
      setUserEmail("");
    }

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [token]); 

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email"); // Yaha bhi key name match kar diya
    setToken("");
    setUserEmail("");
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <div className="navbar bg-white w-full border-b border-gray-100">
      {/* --- TOP NAVBAR --- */}
      <div className="navbar-top flex items-center justify-between px-4 md:px-10 py-4">
        <div className="navbar-left">
          <img
            src={assets.logo_2}
            alt="logo"
            className="logo w-32 md:w-44 cursor-pointer"
            onClick={handleLogoClick}
          />
        </div>

        {/* Search Bar */}
        <div className="search-bar flex-1 max-w-xl mx-4 md:mx-12 relative hidden sm:block">
          <input
            type="text"
            placeholder="Search for products..."
            className="search-input w-full border border-gray-200 rounded-full px-5 py-2.5 outline-none focus:border-orange-400 transition-all text-sm"
            onFocus={() => {
              setShowSearch(true);
              navigate("/cats");
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img src={assets.search_icon} alt="search" className="search-icon absolute right-5 top-1/2 -translate-y-1/2 w-4 opacity-50" />
        </div>

        {/* Icons & Account Section */}
        <div className="navbar-right flex items-center gap-4 md:gap-8">
          <Link to="/cart" className="cart-wrapper relative">
            <img src={assets.cart_icon} alt="cart" className="nav-icon w-6 md:w-7" />
            {getCartCount() > 0 && (
              <span className="cart-badge absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {getCartCount()}
              </span>
            )}
          </Link>

          {!token ? (
            <button 
              className="login-btn bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition-all text-sm shadow-md" 
              onClick={() => setShowLogin(true)}
            >
              Account
            </button>
          ) : (
            <div
              className="user-menu relative"
              onMouseEnter={() => !isMobile && setShowUserMenu(true)}
              onMouseLeave={() => !isMobile && setShowUserMenu(false)}
            >
              <button
                className="user-btn flex flex-col items-end gap-0 cursor-pointer"
                onClick={() => isMobile && setShowUserMenu((prev) => !prev)}
              >
                <div className="flex items-center gap-1 font-bold text-gray-800 text-sm">
                  <User size={16} className="text-orange-500" /> 
                  {userEmail ? userEmail.split("@")[0] : "User"}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </div>
                {/* Fixed: Email Display */}
                <span className="text-[10px] text-gray-400 lowercase font-normal block max-w-[150px] truncate">
                  {userEmail}
                </span>
              </button>

              {showUserMenu && (
                <div className="user-dropdown absolute right-0 mt-3 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Active Account</p>
                    <p className="text-xs text-gray-600 truncate font-medium">{userEmail}</p>
                  </div>
                  <Link to="/payment" className="block px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700" onClick={() => setShowUserMenu(false)}>My Orders</Link>
                  <hr className="my-1 border-gray-50" />
                  <button onClick={logoutHandler} className="logout-btn w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 text-sm font-bold transition-colors">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- SUB-NAVBAR --- */}
      <div className="px-4 md:px-10 pb-5">
        <nav className="relative overflow-hidden  max-w-7xl mx-auto bg-white hover:shadow-md transition-shadow duration-300">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex justify-between items-center px-10">
            <span className="text-4xl rotate-12">🐾</span>
            <span className="text-4xl -rotate-12">🐾</span>
          </div>

          <ul className="relative z-10 flex flex-wrap items-center justify-center gap-6 md:gap-16 py-3.5">
            {Object.keys(categoryMap).map((item) => (
              <li key={item} className="group">
                <button
                  onClick={() => handleSubNavClick(item)}
                  className="flex items-center gap-1.5 text-[11px] md:text-[13px] font-extrabold tracking-[0.25em] text-gray-600 hover:text-orange-500 transition-all duration-300 uppercase"
                >
                  {item}
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 opacity-40" />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;