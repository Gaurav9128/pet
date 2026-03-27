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
    /* Card Container: Added m-2 for outside spacing */
    <div className="bg-white border border-gray-100 rounded-3xl flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 max-w-[380px] mx-auto m-2">

      {/* 1. IMAGE SECTION - Added p-6 to keep image away from card edges */}
      <Link to={`/product/${id}`} className="block w-full aspect-square bg-[#FBFBFB] p-6">
        <img
          src={image?.[0]}
          alt={name}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* 2. CONTENT SECTION - Increased horizontal padding to px-7 */}
      <div className="px-7 pt-2 pb-7 flex flex-col flex-1 text-left">

        {/* Product Title - Proper line height */}
        <h2 className="text-[20px] font-bold text-[#222] leading-[1.4] mb-4 line-clamp-2 min-h-[56px] text-center">
          {name}
        </h2>

        {/* Price Section - Bold & Spaced */}
        <div className="flex items-center justify-center gap-3 mb-5 flex-wrap">
          {/* justify-center se pura price block center ho jayega */}

          <span className="text-3xl font-black text-[#004D40]">
            ₹{currency}{price}
          </span>

          <span className="text-gray-400 line-through text-base font-medium">
            ₹{mrp}
          </span>

          {discount > 0 && (
            <span className="bg-[#4CAF50] text-white px-3 py-1  text-[13px] font-bold uppercase tracking-tight">
              ₹{savings} OFF ({discount}%)
            </span>
          )}
        </div>

        {/* Sizes - Fixed spacing between buttons */}
        <div className="mb-6">
          {/* Yahan 'justify-center' add kiya hai taaki buttons center ho jayein */}
          <div className="flex flex-wrap gap-2.5 justify-center">
            {sizes.map((size, index) => (
              <button
                key={index}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-1.5 text-[12px] font-bold border-2  transition-all ${selectedSize?.label === size.label
                  ? "border-black bg-white text-black shadow-sm"
                  : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-300"
                  }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        <br />

        {/* Action Button - Large and rounded with padding */}
        <div className="mt-auto pt-4 flex flex-col items-center">
          {isAvailable ? (
            /* Link ko sahi se band kiya gaya hai aur usme button wrap hai */
            <Link
              to={`/product/${id}`}
              className="w-[90%] flex justify-center no-underline"
            >
              <button className="w-full bg-[#1E5F74] text-white py-2.5 rounded-lg text-[13px] font-bold uppercase tracking-wider hover:bg-[#154656] transition-all flex justify-center items-center gap-2 shadow-md active:scale-95">
                <span className="text-base">🛒</span>
                ADD TO CART & BUY NOW
              </button>
            </Link>
          ) : (
            /* Out of stock button link ke bahar */
            <button
              disabled
              className="w-[90%] bg-gray-100 text-gray-400 py-2.5 rounded-lg text-[13px] font-bold uppercase cursor-not-allowed"
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