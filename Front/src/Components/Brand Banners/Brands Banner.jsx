import React from "react";
import { useNavigate } from "react-router-dom";
import "./BrandsInFocus.css";

const brands = [
  {
    name: "Farmina",
    img: "https://supertails.com/cdn/shop/files/frame_1707515186_2d5472e1-b03a-42da-951a-a364e36ab51f_1200x.webp?v=1762496743",
  },
  {
    name: "Matisse",
    img: "https://supertails.com/cdn/shop/files/frame_1707515452_7985fdf8-78db-4c3c-9706-e2c036bfe450_1200x.webp?v=1762496743",
  },
  {
    name: "Hearty",
    img: "https://supertails.com/cdn/shop/files/frame_1707515084_709b94fe-210b-4e74-b727-672150e3170c_1200x.webp?v=1762496743",
  },
  {
    name: "Carniwell",
    img: "https://supertails.com/cdn/shop/files/frame_1707515583_1200x.webp?v=1762496743",
  },
  {
    name: "Drools",
    img: "https://supertails.com/cdn/shop/files/frame_1707515584_1200x.webp?v=1762496743",
  },
  {
    name: "Orijen",
    img: "https://supertails.com/cdn/shop/files/frame_1707515450_630395f9-73c9-4077-a1ce-b071a4045b1c_1200x.webp?v=1762496743",
  },
];

export default function BrandsInFocus() {
  const navigate = useNavigate();

  const handleBrandClick = (brandName) => {
    // ✅ COLLECTION PAGE PE BRAND FILTER
    navigate(`/cats?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <div className="brands-container">
      <h2 className="brands-title">Brands in Focus</h2>

      <div className="brands-grid">
        {brands.map((brand, i) => (
          <div
            key={i}
            className="brand-card cursor-pointer"
            onClick={() => handleBrandClick(brand.name)}
          >
            <img
              src={brand.img}
              alt={brand.name}
              className="brand-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
