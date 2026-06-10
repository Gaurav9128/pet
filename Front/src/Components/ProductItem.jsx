import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const ProductItem = ({
  id,
  image = [],
  name,
  sizes = [],
  isAvailable = true,
  rating = 0,
}) => {
  const { currency } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);

  const getPriceData = () => {
    if (!sizes.length) return { price: 0, mrp: 0, discount: 0 };

    const activeSize = selectedSize || sizes[0];
    const price = Number(activeSize.price);
    const mrp = Number(activeSize.mrp);

    const discount =
      mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    return { price, mrp, discount };
  };

  const { price, mrp, discount } = getPriceData();

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={
          i < rating
            ? "text-yellow-500 text-sm"
            : "text-gray-300 text-sm"
        }
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-[#F8F4F4] rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-[350px] h-full flex flex-col overflow-hidden p-4">

      {/* PRODUCT IMAGE SECTION */}
      <div className="bg-white rounded-xl h-[260px] flex items-center justify-center mb-3 relative group shadow-sm border border-gray-100 p-4">

        {/* BRAND BADGE */}
        <div className="absolute top-2.5 left-2.5 bg-white px-3 py-1 rounded-full flex items-center gap-1.5 z-10 shadow-sm border border-gray-200">
          <span className="text-[#BE3C25] text-xs">🐾</span>
          <h2 className="text-[#C02626] font-bold text-[10px] uppercase tracking-wider">
            Belim Tails
          </h2>
        </div>

        {/* PRODUCT IMAGE */}
        <Link
          to={`/product/${id}`}
          className="w-full h-full flex items-center justify-center"
        >
          <img
            src={image?.[0]}
            alt={name}
            className="w-full h-[220px] object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 justify-between px-2 text-center">

        <div>

          {/* TITLE */}
          <h2 className="text-[18px] font-semibold text-gray-800 leading-snug min-h-[56px] line-clamp-2 mb-2">
            {name}
          </h2>

          {/* RATING */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex">{renderStars()}</div>
            <span className="text-gray-500 text-sm font-medium">
              ({rating}/5)
            </span>
          </div>

          {/* PRICE */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-3">
            <span className="text-4xl font-extrabold text-[#C02626]">
              ₹{currency}
              {price}
            </span>

            <span className="text-gray-500 line-through text-lg">
              ₹{mrp}
            </span>

            {discount > 0 && (
              <span className="text-[#C02626] text-lg font-bold">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* WEIGHT SELECTION */}
          <div className="mb-4">

            <p className="text-sm font-semibold text-gray-800 mb-2">
              Select Weight:
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {sizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200
                  ${
                    selectedSize?.label === size.label
                      ? "bg-[#C02626] text-white border-[#C02626]"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Weights available in multiple variations.
            </p>

          </div>
        </div>

        {/* BUTTON */}
        <div>
          {isAvailable ? (
            <Link to={`/product/${id}`}>
              <button className="w-full bg-[#C02626] hover:bg-[#A31E1E] text-white py-4 rounded-2xl text-base font-black uppercase tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg">
                BUY NOW
                <span className="text-lg">🛒</span>
              </button>
            </Link>
          ) : (
            <button
              disabled
              className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl text-sm font-bold uppercase cursor-not-allowed"
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