import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const ProductItem = ({ id, image = [], name, sizes = [], isAvailable = true }) => {
  const { currency } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState(null);

  const getPriceData = () => {
    if (!sizes.length) return { price: 0, mrp: 0, discount: 0 };
    const validSizes = sizes.filter(s => Number(s.price) > 0 && Number(s.mrp) > 0);
    if (!validSizes.length) return { price: 0, mrp: 0, discount: 0 };

    const activeSize = selectedSize || validSizes.reduce((min, curr) => Number(curr.price) < Number(min.price) ? curr : min);
    const price = Number(activeSize.price);
    const mrp = Number(activeSize.mrp);
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    return { price, mrp, discount };
  };

  const { price, mrp, discount } = getPriceData();

  return (
    <div className="bg-white flex flex-col h-full overflow-hidden group">
      <br/>
      {/* IMAGE SECTION - Reference style (Gray background behind image) */}
      <Link
        to={`/product/${id}`}
        className="bg-[#F7F7F7] rounded-lg aspect-square flex items-center justify-center overflow-hidden p-4"
      >
        <img
          src={image?.[0]}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
<br/>
      {/* CONTENT SECTION - Padding adjusted to match reference */}
      <div className="px-1 py-3 flex flex-col flex-1">
        
        {/* Name - Reference has dark, clean text */}
        <p className="text-[14px] sm:text-[15px] font-normal text-[#212121] line-clamp-2 leading-snug min-h-[40px]">
          <Link to={`/product/${id}`}>{name}</Link>
        </p>
         <br/>
        {/* PRICE - Styled like the reference image */}
        <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            ₹{price}
          </span>
          {mrp > price && (
            <span className="text-xs sm:text-sm text-gray-500 line-through font-normal">
              ₹{mrp}
            </span>
          )}
          {discount > 0 && (
            <span className="text-[11px] sm:text-xs text-green-600 font-bold">
              {discount}% OFF
            </span>
          )}
        </div>
        <br/>
        {/* SIZES - Minimalist buttons */}
        {sizes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {sizes.map((size, index) => {
              const isActive = selectedSize?.label === size.label;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`px-2 py-0.5 text-[15px] border rounded transition-all
                    ${isActive 
                      ? "border-black bg-black text-white" 
                      : "border-gray-300 text-gray-600 hover:border-gray-800"
                    }`}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        )}
        <br/>
        {/* ACTION BUTTON - Pushed to bottom */}
        <div className="mt-auto pt-3">
          {isAvailable ? (
            <Link
              to={`/product/${id}`}
              className="block w-full border border-[#e0e0e0] text-gray-800 py-1.5 text-xs sm:text-sm font-semibold rounded-md text-center hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              BUY NOW
            </Link>
          ) : (
            <span className="block w-full bg-gray-100 text-gray-400 py-1.5 text-xs sm:text-sm font-medium rounded-md text-center">
              OUT OF STOCK
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;