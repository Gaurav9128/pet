import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const ProductItem = ({ id, image = [], name, sizes = [], isAvailable = true }) => {
  const { currency } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState(null);

  const getPriceData = () => {
    if (!sizes.length) return { price: 0, mrp: 0, discount: 0 };

    const validSizes = sizes.filter(
      s => Number(s.price) > 0 && Number(s.mrp) > 0
    );

    if (!validSizes.length) return { price: 0, mrp: 0, discount: 0 };

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
    <div className="bg-white shadow-md rounded-md hover:shadow-lg 
                    transition-shadow flex flex-col h-full">

      {/* IMAGE */}
      <Link
        to={`/product/${id}`}
        className="w-full h-48 bg-gray-100 rounded-t-md overflow-hidden"
      >
        <img
          src={image?.[0]}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </Link>

      {/* CONTENT */}
      <div className="px-4 pt-4 flex flex-col flex-1">

        <p className="text-sm font-semibold line-clamp-2 text-gray-800">
          <Link to={`/product/${id}`}>{name}</Link>
        </p>

        {/* PRICE */}
        {price > 0 ? (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-lg font-bold">
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

        {/* SIZES */}
        {sizes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((size, index) => {
              const isActive = selectedSize?.label === size.label;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`
                    px-3 py-1 text-xs font-semibold
                    border rounded-md min-w-[60px]
                    transition-all
                    ${isActive
                      ? "border-red-500 text-red-500 bg-red-50"
                      : "border-gray-400 hover:border-red-500 hover:text-red-500"}
                  `}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* BUY NOW / UNAVAILABLE BUTTON */}
      {isAvailable ? (
        <Link
          to={`/product/${id}`}
          className="mx-4 mb-4
                     border border-red-500
                     text-red-500
                     py-2.5
                     text-base font-semibold
                     rounded-lg text-center
                     hover:bg-red-500 hover:text-white
                     transition-all"
        >
          BUY NOW
        </Link>
      ) : (
        <button
          disabled
          className="mx-4 mb-4
                     border border-gray-400
                     bg-gray-400
                     text-white
                     py-2.5
                     text-base font-semibold
                     rounded-lg text-center
                     cursor-not-allowed"
        >
          UNAVAILABLE
        </button>
      )}

    </div>
  );
};

export default ProductItem;
