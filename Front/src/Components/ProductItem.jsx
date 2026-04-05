import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const ProductItem = ({ id, image = [], name, sizes = [], isAvailable = true }) => {
  const { currency } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);

  const getPriceData = () => {
    if (!sizes.length) return { price: 0, mrp: 0, discount: 0, savings: 0 };
    const activeSize = selectedSize || sizes[0];
    const price = Number(activeSize.price);
    const mrp = Number(activeSize.mrp);
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    const savings = mrp - price;
    return { price, mrp, discount, savings };
  };

  const { price, mrp, discount, savings } = getPriceData();

  return (
    <div className="bg-white border border-gray-100 rounded-3xl flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 max-w-[380px] mx-auto m-2">
      
      {/* 1. IMAGE SECTION */}
      <Link to={`/product/${id}`} className="block w-full aspect-square bg-[#FBFBFB] p-6">
        <img
          src={image?.[0]}
          alt={name}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* 2. CONTENT SECTION */}
      {/* flex-1 aur flex-col yahan buttons ko bottom mein push karne mein help karega */}
      <div className="px-7 pt-4 pb-7 flex flex-col flex-1">
        
        {/* Title: min-h-14 ensures 2 lines space always */}
        <h2 className="text-[18px] font-bold text-[#222] leading-[1.4] mb-3 line-clamp-2 min-h-[50px] text-center">
          {name}
        </h2>

        {/* Price: min-h-12 ensures space is consistent even if discount is missing */}
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap min-h-[48px]">
          <span className="text-2xl font-black text-[#004D40]">
            ₹{currency}{price}
          </span>
          <span className="text-gray-400 line-through text-sm font-medium">
            ₹{mrp}
          </span>
          {discount > 0 && (
            <span className="bg-[#4CAF50] text-white px-2 py-0.5 text-[11px] font-bold uppercase">
              ₹{savings} OFF ({discount}%)
            </span>
          )}
        </div>

        {/* Sizes: min-h ensures size buttons don't shift the layout */}
        <div className="mb-4 min-h-[60px] flex items-center justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            {sizes.map((size, index) => (
              <button
                key={index}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 text-[11px] font-bold border-2 transition-all ${
                  selectedSize?.label === size.label
                    ? "border-black bg-white text-black shadow-sm"
                    : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-300"
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. BUTTON SECTION - mt-auto pushes this to the very bottom */}
        <div className="mt-auto pt-2 flex justify-center">
          {isAvailable ? (
            <Link to={`/product/${id}`} className="w-full flex justify-center no-underline">
              <button className="w-full bg-[#1E5F74] text-white py-3 rounded-xl text-[12px] font-bold uppercase tracking-wider hover:bg-[#154656] transition-all flex justify-center items-center gap-2 shadow-md active:scale-95">
                <span className="text-base">🛒</span>
                ADD TO CART & BUY NOW
              </button>
            </Link>
          ) : (
            <button
              disabled
              className="w-full bg-gray-100 text-gray-400 py-3 rounded-xl text-[12px] font-bold uppercase cursor-not-allowed"
            >
              OUT OF STOCK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;