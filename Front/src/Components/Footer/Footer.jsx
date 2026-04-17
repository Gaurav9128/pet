import React from "react";
import "./Footer.css";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Footer = () => {
  const navigate = useNavigate();

  // Logo par click karne par home page par bhejne ke liye function
  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo(0, 0); // Click karne par page upar se start ho
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section: Logo & Tagline */}
        <div className="footer-section brand-info">
          <div className="logo-wrapper">
            <img
              src={assets.logo_3}
              alt="Belim Tails Logo"
              className="footer-logo-img"
              onClick={handleLogoClick}
              style={{
                cursor: "pointer",
                height: "120px",  /* Yahan se bhi height control kar sakte hain */
                width: "auto"
              }}
            />
          </div>
          <p className="tagline">
            Your product perfect to your side. We provide the health and happiness arts,
            making us to you and with momentous products.
          </p>
        </div>

        {/* Middle Section: Quick Links */}
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contactus">About</Link></li>
            <li><Link to="/privacypolicy">Privacy Policy</Link></li>
            <li><Link to="/termscondition">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Right Section: Contact Us */}
        <div className="footer-section">
          <h4 className="footer-heading">Contact Us</h4>
          <div className="contact-details">
            <p>Email: Rizwaanbhati.rb1004@gmail.com</p>
            <p>Ph: +91 7014021793</p>
            <p>Mahindra, Moe oenmation, India</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar (Stats & Copyright) */}
      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <p>© 2026 Belim Tails. All Rights Reserved.</p>
        </div>
        <div className="stats-container">
          <span className="stat-item">Visits: 1492</span>
          <span className="stat-item">Online: 5</span>
          <span className="stat-item admin-tag">Admin</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;