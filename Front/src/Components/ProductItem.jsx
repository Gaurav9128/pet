import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const ProductItem = ({ id, image = [], name, sizes = [] }) => {
  const { currency } = useContext(StoreContext);

  /* ✅ SELECTED SIZE STATE */
  const [selectedSize, setSelectedSize] = useState(null);

  /* ✅ PRICE DATA (SELECTED SIZE FIRST, ELSE LOWEST PRICE) */
  const getPriceData = () => {
    if (!Array.isArray(sizes) || sizes.length === 0) {
      return { price: 0, mrp: 0, discount: 0 };
    }

    const validSizes = sizes.filter(
      s => Number(s.price) > 0 && Number(s.mrp) > 0
    );

    if (!validSizes.length) {
      return { price: 0, mrp: 0, discount: 0 };
    }

    // 👉 agar size selected hai
    const activeSize =
      selectedSize ||
      validSizes.reduce((min, curr) =>
        Number(curr.price) < Number(min.price) ? curr : min
      );

    const price = Number(activeSize.price);
    const mrp = Number(activeSize.mrp);

    const discount =
      mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    return { price, mrp, discount };
  };

  const { price, mrp, discount } = getPriceData();

  return (
    <div className="bg-white shadow-md rounded-md hover:shadow-lg transition-shadow duration-300">

      {/* 🖼 Product Image */}
      <Link
        to={`/product/${id}`}
        className="w-full h-48 bg-gray-100 rounded-t-md overflow-hidden block"
      >
        <img
          src={image?.[0]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* 📦 Product Info */}
      <div className="px-5 pt-4 pb-5 flex flex-col">

        <p className="text-sm font-semibold line-clamp-2 text-gray-800">
          <Link to={`/product/${id}`}>{name}</Link>
        </p>

        {/* 💰 PRICE */}
        {price > 0 ? (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xl font-bold text-black">
              ₹{currency}{price}
            </span>

            {mrp > price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{currency}{mrp}
              </span>
            )}

            {discount > 0 && (
              <span className="text-sm text-green-600 font-semibold">
                ({discount}% OFF)
              </span>
            )}
          </div>
        ) : (
          <p className="text-red-500 text-sm mt-1">Price not available</p>
        )}

        {/* 📏 Sizes */}
        {sizes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2.5">
            {sizes.map((size, index) => {
              const isActive = selectedSize?.label === size.label;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`
                    px-3.5 py-1.5
                    text-[13px] font-semibold
                    border-2 rounded-md
                    min-w-[70px]
                    transition-all
                    ${
                      isActive
                        ? "border-red-500 text-red-500 bg-red-50"
                        : "border-gray-400 text-gray-800 hover:border-red-500 hover:text-red-500"
                    }
                  `}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        )}

        {/* 🛒 Buy Now */}
        <Link
          to={`/product/${id}`}
          className="
            mt-4
            border border-red-500
            text-red-500
            bg-white
            py-3
            text-lg font-semibold
            rounded-lg
            text-center
            hover:bg-red-500 hover:text-white
            transition-all
          "
        >
          BUY NOW
        </Link>

      </div>
    </div>
  );
};

export default ProductItem;
