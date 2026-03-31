import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const ProductItem = ({ id, image = [], name, sizes = [], brand = "BRAND NAME", isAvailable = true }) => {
  const { currency } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);
  const [quantity, setQuantity] = useState(1);

  const getPriceData = () => {
    if (!sizes.length) return { price: 0, mrp: 0 };
    const activeSize = selectedSize || sizes[0];
    return {
      price: Number(activeSize.price),
      mrp: Number(activeSize.mrp)
    };
  };

  const { price, mrp } = getPriceData();

  return (
    /* h-full ensures all cards in a row stretch to the same height */
    <div className="bg-white border border-gray-100 rounded-xl flex flex-col h-full overflow-hidden shadow-sm relative group font-sans">

      {/* 1. IMAGE SECTION - Fixed Aspect Ratio */}
      <Link to={`/product/${id}`} className="block w-full aspect-[4/3] sm:aspect-square p-4 bg-[#f9f9f9] overflow-hidden">
        <img
          src={image?.[0]}
          alt={name}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* 2. CONTENT SECTION */}
      <div className="px-3 pt-3 flex flex-col flex-1">
        
        {/* TITLE - Fixed height for 2 lines to keep everything aligned */}
        <h2 className="text-[13px] font-semibold text-[#333] leading-[1.3] mb-2 line-clamp-2 h-[34px] text-center overflow-hidden">
          {name}
        </h2>

        {/* SIZE SELECTOR */}
        <div className="mb-2">
          <select
            className="w-full border border-gray-200 rounded py-1 px-2 text-[12px] text-gray-600 outline-none bg-gray-50 cursor-pointer"
            value={selectedSize?.label}
            onChange={(e) => setSelectedSize(sizes.find(s => s.label === e.target.value))}
          >
            {sizes.map((size, index) => (
              <option key={index} value={size.label}>{size.label}</option>
            ))}
          </select>
        </div>

        {/* PRICE & QUANTITY */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">Price</span>
            <span className="text-base font-bold text-[#111]">₹{price}</span>
          </div>

          <div className="flex items-center border border-gray-200 rounded bg-gray-50 scale-90">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 py-0.5 text-gray-500 hover:bg-gray-200">-</button>
            <span className="px-1 py-0.5 text-[12px] font-bold w-6 text-center border-x border-gray-200">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="px-2 py-0.5 text-gray-500 hover:bg-gray-200">+</button>
          </div>
        </div>

        {/* TOTAL INFO */}
        <div className="mb-3">
          <p className="text-[10px] text-gray-500 italic">
            Total: <span className="font-bold text-gray-700">₹{price * quantity}.00</span>
          </p>
        </div>

        {/* 3. BUTTON SECTION - Pushed to the absolute bottom */}
        <div className="mt-auto -mx-3"> 
          {isAvailable ? (
            <Link to={`/product/${id}`} className="no-underline">
              <button className="w-full bg-[#1E5F74] text-white py-3 text-[11px] font-bold uppercase tracking-wider hover:bg-[#154656] transition-all flex justify-center items-center gap-2">
                <span className="text-sm">🛒</span>
                ADD TO CART & BUY NOW
              </button>
            </Link>
          ) : (
            <button disabled className="w-full bg-gray-200 text-gray-400 py-3 text-[11px] font-bold uppercase cursor-not-allowed">
              OUT OF STOCK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;