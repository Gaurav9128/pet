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

  /* 🔥 MOBILE DETECTION */
  const [isMobile, setIsMobile] = useState(false);

  /* 🔥 LOGO CLICK STATE */
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ===================== */
  /* LOGO CLICK HANDLER */
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
  /* OUTSIDE CLICK CLOSE */
  /* ===================== */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpenCategories(false);
        setOpenCat(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===================== */
  /* AUTO CLOSE ON SCROLL */
  /* ===================== */
  useEffect(() => {
    const handleScroll = () => {
      setOpenCategories(false);
      setOpenCat(null);
      setShowUserMenu(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ===================== */
  /* LOGOUT */
  /* ===================== */
  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken("");
    setShowUserMenu(false);
  };

  return (
    <div className="navbar">
      {/* ================= LEFT ================= */}
      <div className="navbar-left">
        {/* LOGO */}
        <img
          src={assets.logo}
          alt="logo"
          className="logo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        />

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

      {/* ================= RIGHT ================= */}
      <div className="navbar-right">
        <img
          onClick={() => {
            setShowSearch(true);
            navigate("/cats");
          }}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt="search"
        />

        <div className="navbar-search-icon">
          <Link to="/cart">
            <img
              src={assets.cart_icon}
              alt="Cart"
              className="nav-icon"
            />
          </Link>
          <div
            className={
              getTotalCartAmount() === 0 ? "" : "dot"
            }
          ></div>
        </div>

        {/* ================= USER MENU ================= */}
        {!token ? (
          <button onClick={() => setShowLogin(true)}>
            sign in
          </button>
        ) : (
          <div
            className="user-menu"
            onMouseEnter={
              !isMobile
                ? () => setShowUserMenu(true)
                : undefined
            }
            onMouseLeave={
              !isMobile
                ? () => setShowUserMenu(false)
                : undefined
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
              Account {showUserMenu ? "▲" : "▼"}
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
                  onClick={() => setShowUserMenu(false)}
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
      </div>
    </div>
  );
};

export default Navbar;
