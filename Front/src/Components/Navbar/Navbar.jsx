import React, {
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {

  const [openCategories, setOpenCategories] = useState(false);
  const [openCat, setOpenCat] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [logoClickCount, setLogoClickCount] = useState(0);
  const logoTimerRef = useRef(null);

  const {
    setShowSearch,
    getTotalCartAmount,
    token,
    setToken,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const [userEmail, setUserEmail] = useState("");

  /* ===================== */
  /* GET EMAIL */
  /* ===================== */

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  /* ===================== */
  /* MOBILE CHECK */
  /* ===================== */

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ===================== */
  /* CATEGORY TOGGLE */
  /* ===================== */

  const toggleCategory = (id) => {
    setOpenCat(openCat === id ? null : id);
  };

  const handleCategoryClick = () => {
    setOpenCategories(false);
    setOpenCat(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ===================== */
  /* LOGO CLICK */
  /* ===================== */

  const handleLogoClick = () => {
    setLogoClickCount((prev) => prev + 1);

    if (logoTimerRef.current) {
      clearTimeout(logoTimerRef.current);
    }

    if (logoClickCount + 1 === 5) {
      setLogoClickCount(0);
      window.open("https://pet-admin-two.vercel.app/", "_blank");
      return;
    }

    logoTimerRef.current = setTimeout(() => {
      navigate("/");
      setLogoClickCount(0);
    }, 300);
  };

  /* ===================== */
  /* LOGOUT */
  /* ===================== */

  const logoutHandler = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    setToken("");
    setUserEmail("");
    setShowUserMenu(false);

  };

  return (
    <div className="navbar">

      {/* LEFT */}

      <div className="navbar-left">

        <img
          src={assets.logo}
          alt="logo"
          className="logo"
          onClick={handleLogoClick}
        />

        {/* DESKTOP CATEGORY BUTTON */}

        <button
          className="category-btn"
          onClick={() => setOpenCategories(!openCategories)}
          ref={buttonRef}
        >
          <span className="category-text">☰ All Categories</span>
        </button>
 
 {/* CATEGORY DROPDOWN */}
        {openCategories && (
          <div className="category-dropdown" ref={dropdownRef}>
            {[
              "CAT FOOD",
              "DOG FOOD",
              "SMALL PETS",
              "PET PARENT",
              "HENLO",
              "PHARMACY",
              "SHOP BY BREED",
            ].map((item, index) => (
              <div className="category-row" key={item}>
                <div className="category-title">
                  <Link
                    to="/cats"
                    className="cat-link"
                    onClick={handleCategoryClick}
                  >
                    {item}
                  </Link>
                  <span
                    className="toggle-btn"
                    onClick={() => toggleCategory(index)}
                  >
                    {openCat === index ? "−" : "+"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT */}

      <div className="navbar-right">

        {/* MOBILE HAMBURGER */}

        <img
          onClick={() => {
            setShowSearch(true);
            navigate("/cats");
          }}
          src={assets.search_icon}
          className="nav-icon"
          alt="search"
        />

        <div className="navbar-search-icon">

          <Link to="/cart">
            <img
              src={assets.cart_icon}
              alt="cart"
              className="nav-icon"
            />
          </Link>

          <div
            className={getTotalCartAmount() === 0 ? "" : "dot"}
          ></div>

        </div>
        

        {/* USER MENU */}

        {!token ? (

          <button onClick={() => setShowLogin(true)}>
            Sign In
          </button>

        ) : (

          <div
            className="user-menu"
            onMouseEnter={
              !isMobile ? () => setShowUserMenu(true) : undefined
            }
            onMouseLeave={
              !isMobile ? () => setShowUserMenu(false) : undefined
            }
          >

            <button
              className="user-btn"
              onClick={() => {
                if (isMobile) {
                  setShowUserMenu((prev) => !prev);
                }
              }}
            >
              👤 {userEmail || "Account"}
            </button>

            {showUserMenu && (

              <div className="user-dropdown">

                <Link
                  to="/payment"
                  onClick={() => setShowUserMenu(false)}
                >
                  My Orders
                </Link>

                <a
                  href="https://pet-admin-two.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Admin Panel
                </a>

                <button
                  onClick={logoutHandler}
                  className="logout-btn"
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        )}
        {isMobile && (
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
          </button>
        )}

      </div>

      {/* MOBILE SIDEBAR */}

      <div className={`mobile-sidebar ${mobileMenuOpen ? "open" : ""}`}>

        <div className="mobile-sidebar-header">

          <span>Menu</span>

          <button
            className="close-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✕
          </button>

        </div>

        <ul className="mobile-menu-list">

          <li>
            <Link to="/cats" onClick={handleCategoryClick}>
              Cat Food
            </Link>
          </li>

          <li>
            <Link to="/cats" onClick={handleCategoryClick}>
              Dog Food
            </Link>
          </li>

          <li>
            <Link to="/cats" onClick={handleCategoryClick}>
              Small Pets
            </Link>
          </li>

          <li>
            <Link to="/cats" onClick={handleCategoryClick}>
              Pet Parent
            </Link>
          </li>

          <li>
            <Link to="/cats" onClick={handleCategoryClick}>
              Pharmacy
            </Link>
          </li>

          <li>
            <Link to="/cats" onClick={handleCategoryClick}>
              Shop By Breed
            </Link>
          </li>

        </ul>

      </div>

      {/* OVERLAY */}

      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

    </div>
  );
};

export default Navbar;