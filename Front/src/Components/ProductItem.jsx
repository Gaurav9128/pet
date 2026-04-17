import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const ProductItem = ({ id, image = [], name, sizes = [], isAvailable = true, rating = 0 }) => {
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
      <span key={i} className={i < rating ? "text-yellow-500 text-sm" : "text-gray-300 text-sm"}>
        ★
      </span>
    ));
  };

  return (
    <div className="bg-[#F8F4F4] rounded-2xl shadow-md hover:shadow-xl transition duration-300 w-full max-w-[320px] h-full flex flex-col overflow-hidden p-4">

      {/* IMAGE */}
      <div className="bg-white rounded-xl h-[180px] flex items-center justify-center mb-3 relative group shadow-sm border border-gray-100 p-3">

        {/* BADGE */}
        <div className="absolute top-2.5 left-2.5 bg-white px-3 py-1 rounded-full flex items-center gap-1.5 z-10 shadow-sm border border-gray-200">
          <span className="text-[#BE3C25] text-xs">🐾</span>
          <h2 className="text-[#BE3C25] font-bold text-[10px] uppercase tracking-wider">
            Belim Tails
          </h2>
        </div>

        {/* IMAGE */}
        <Link to={`/product/${id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={image?.[0]}
            alt={name}
            className="max-h-[140px] max-w-full object-contain hover:scale-105 transition duration-500"
          />
        </Link>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 justify-between px-5 py-3 items-center text-center">

        <div>
          {/* TITLE */}
          <h2 className="text-[16px] font-semibold text-gray-800 leading-snug line-clamp-2 min-h-[42px] mb-2">
            {name}
          </h2>

          {/* Rating */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex scale-110 origin-left">{renderStars()}</div>
            <span className="text-gray-500 text-sm font-medium">({rating}/5)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-center gap-3 mb-3 flex-wrap">
            <span className="text-3xl font-extrabold text-[#BE3C25]">
              ₹{currency}{price}
            </span>

            <span className="text-gray-500 line-through text-base">
              ₹{mrp}
            </span>

            {discount > 0 && (
              <span className="text-[#E0804B] text-lg font-bold">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* SIZE */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-800 mb-2 pl-1">
              Select Weight:
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {sizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2.5 text-[15px] font-semibold rounded-lg border transition-all
      ${selectedSize?.label === size.label
                      ? "bg-[#BE3C25] text-white border-[#BE3C25]"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                    }`}
                >
                  {size.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Weights available in variations of 1, 2, 3, 5, and 10 Kilograms
            </p>
          </div>
        </div>

        {/* BUTTON */}


      </div>
      <div>
        {isAvailable ? (
          <Link to={`/product/${id}`}>
            <button className="w-full mt-4 bg-gradient-to-r from-[#BE3C25] via-[#D9552E] to-[#E0804B] text-white py-4 rounded-2xl text-base font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2">
              BUY NOW <span className="text-xl">🛒</span>
            </button>
          </Link>
        ) : (
          <button disabled className="w-full mt-4 bg-gray-100 text-gray-400 py-4 rounded-2xl text-sm font-bold uppercase cursor-not-allowed">
            OUT OF STOCK
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductItem;