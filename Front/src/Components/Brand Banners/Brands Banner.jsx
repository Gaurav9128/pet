import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Optional: Animation ke liye install karein 'npm install framer-motion'
import "./BrandsInFocus.css";

const BRANDS = [
  { name: "Drools", img: "https://res.cloudinary.com/dess3pfpq/image/upload/v1775748084/download__3_-removebg-preview_1_vbtxgu.png" },

  { name: "Me-O", img: "https://res.cloudinary.com/dess3pfpq/image/upload/v1775748003/download__8_-removebg-preview_ks3sda.png" },
  { name: "Whiskas", img: "https://res.cloudinary.com/dess3pfpq/image/upload/v1775747704/download__6_-removebg-preview_t2ri20.png" },
  { name: "Royal Canin", img: "https://res.cloudinary.com/dess3pfpq/image/upload/v1775747835/download__2_-removebg-preview_cluo0h.png" },
  { name: "Sheba", img: "https://res.cloudinary.com/dess3pfpq/image/upload/v1775747916/download__7_-removebg-preview_xmoye4.png" },
  { name: "Pedigree", img: "https://res.cloudinary.com/dess3pfpq/image/upload/v1775748226/download__9_-removebg-preview_aog4uf.png" },
];

const BrandsInFocus = () => {
  const navigate = useNavigate();

  const handleBrandClick = (brandName) => {
    navigate(`/cats?brand=${encodeURIComponent(brandName.toLowerCase())}`);
  };

  return (
    <section className="brands-section">
      <div className="container">
        <div className="section-header">
          <h2 className="brands-title">Top Brands in Focus</h2>
          <p className="brands-subtitle">Trusted nutrition for your furry friends</p>
        </div>

        <div className="brands-grid">
          {BRANDS.map((brand, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="brand-card"
              onClick={() => handleBrandClick(brand.name)}
              role="button"
              aria-label={`View products from ${brand.name}`}
            >
              <div className="image-wrapper">
                <img
                  src={brand.img}
                  alt={`${brand.name} logo`}
                  className="brand-image"
                  loading="lazy"
                />
              </div>
              <span className="brand-label">{brand.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsInFocus;