import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const ProductItem = ({
  id,
  image = [],
  name,
  sizes = [],
  isAvailable = true,
  rating = 4.5,
}) => {
  const { currency } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);

  const getPriceData = () => {
    if (!sizes.length) return { price: 0, mrp: 0, discount: 0 };
    const activeSize = selectedSize || sizes[0];
    const price = Number(activeSize.price);
    const mrp = Number(activeSize.mrp);
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    return { price, mrp, discount };
  };

  const { price, mrp, discount } = getPriceData();

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < Math.floor(rating) ? "text-[#F1C40F] text-xl" : "text-gray-300 text-xl"}
      >
        ★
      </span>
    ));
  };

  // Fixed Variation logic: String split bypass algorithm to output direct labels accurately
  const getWeightString = () => {
    if (!sizes.length) return "";
    
    // Pure strings ko as-it-is extract karenge (Jaise: "85 GM", "85 X 12 GM")
    const cleanLabels = sizes.map((s) => s.label.trim());
    
    if (cleanLabels.length === 1) return cleanLabels[0];
    
    const last = cleanLabels.pop();
    return `${cleanLabels.join(", ")}, and ${last}`;
  };

  return (
    // Main Container wrapper with structural padding constraint match
    <div className="bg-[#FCF9F4] rounded-[28px] border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-[360px] p-5 pb-6 flex flex-col justify-between font-sans h-full">
      
      <div>
        {/* PRODUCT IMAGE CONTAINER */}
        <div className="bg-white rounded-[24px] h-[260px] flex flex-col items-center justify-start mb-4 relative border border-gray-100 p-4 shadow-sm">
          
          {/* BRAND BADGE */}
          <div className="w-full flex items-center gap-2 mb-2 px-0.5">
            <span className="text-[#5D1951] text-2xl leading-none">🐾</span>
            <div className="flex flex-col leading-none">
              <span className="text-[#5D1951] font-black text-sm tracking-tight">Belim</span>
              <span className="text-[#5D1951] font-bold text-xs tracking-tight">Tails</span>
            </div>
          </div>

          {/* PRODUCT IMAGE LINK */}
          <Link
            to={`/product/${id}`}
            className="w-full flex-1 flex items-center justify-center min-h-0 mt-2"
          >
            <img
              src={image?.[0]}
              alt={name}
              className="max-w-full max-h-[180px] object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* CONTENT DETAILS SECTION */}
        <div className="flex flex-col text-left px-1">
          
          {/* PRODUCT TITLE */}
          <h2 className="text-[22px] font-bold text-[#1A1A1A] leading-[1.25] tracking-tight mb-1.5 line-clamp-2 min-h-[55px]">
            {name}
          </h2>

          {/* RATING SECTION */}
          <div className="flex items-center gap-1 mb-2.5">
            <div className="flex items-center leading-none">{renderStars()}</div>
            <span className="text-gray-700 text-xs font-bold mt-0.5 pl-0.5">
              ({rating}/5)
            </span>
          </div>

          {/* PRICE DISPLAY */}
          <div className="flex items-baseline gap-2 mb-4 flex-wrap">
            <span className="text-[32px] font-black text-[#be2b2b] tracking-tight">
              ₹{price}
            </span>
            <span className="text-gray-400 line-through text-xl font-medium pl-1">
              ₹{mrp}
            </span>
            {discount > 0 && (
              <span className="text-[#be2b2b] text-xl font-bold pl-1">
                ({discount}% OFF)
              </span>
            )}
          </div>

          {/* WEIGHT SELECTION SYSTEM */}
          <div className="mb-5">
            <p className="text-base font-bold text-[#1A1A1A] mb-3">
              Select Weight:
            </p>

            {/* Exact 3-Column Oval Capsule Grid Layout matching image spec */}
            {/* Buttons ko bada rakhne aur flexible width dene ke liye flex-wrap layout */}
<div className="flex flex-wrap gap-2.5">
  {sizes.map((size, index) => {
    const isSelected = selectedSize?.label === size.label;
    return (
      <button
        key={index}
        type="button"
        onClick={() => setSelectedSize(size)}
        // py-2.5 aur px-5 se button bada dikhega, aur rounded-[10px] se roundness kam ho jayegi
        className={`py-2.5 px-5 text-center text-[15px] font-black tracking-wide rounded-[10px] border-2 transition-all duration-200 inline-block min-w-[90px]
        ${
          isSelected
            ? "bg-white text-[#1A1A1A] border-[#1A1A1A] shadow-sm"
            : "bg-white text-[#1A1A1A] border-gray-400/80 hover:bg-gray-50"
        }`}
      >
        {size.label.toUpperCase()}
      </button>
    );
  })}
</div>

            {/* Fixed String interpolation note layout */}
            {sizes.length > 0 && (
              <p className="text-xs font-medium text-gray-500 mt-3 leading-snug">
                Weights available in variations of {getWeightString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="px-1">
        {isAvailable ? (
          <Link to={`/product/${id}`}>
            <button className="w-full bg-[#be2b2b] hover:bg-[#be2b2b] text-white py-3.5 rounded-[12px] text-xl font-extrabold uppercase tracking-widest transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 shadow-sm">
              BUY NOW
              <span className="text-xl">🛒</span>
            </button>
          </Link>
        ) : (
          <button
            disabled
            className="w-full bg-gray-200 text-gray-400 py-3.5 rounded-[12px] text-base font-bold uppercase cursor-not-allowed"
          >
            OUT OF STOCK
          </button>
        )}
      </div>

    </div>
  );
};

export default ProductItem;