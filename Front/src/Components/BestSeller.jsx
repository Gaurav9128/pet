import React, { useContext, useEffect, useState } from "react";
import ProductItem from "./ProductItem.jsx";
import { StoreContext } from "../context/StoreContext";

const BestSeller = () => {

  const { products = [] } = useContext(StoreContext);

  const [bestSeller, setBestSeller] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Only bestseller products that are available
    const bestProduct = products.filter(
      (item) => item.bestseller && item.isAvailable
    );
    setBestSeller(bestProduct);
  }, [products]);

  const visibleProducts = showAll ? bestSeller : bestSeller.slice(0, 15);

  return (
    <div className="my-12 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">

      {/* TITLE */}
      <div className="flex flex-col items-center text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 tracking-wide">
          BEST SELLERS
        </h2>

        <p className="mt-2 text-sm md:text-base text-gray-600 max-w-md">
          Explore our top picks, trusted by customers for their unmatched
          quality and popularity.
        </p>
      </div>

      {/* SEE MORE BUTTON DESKTOP */}
      <div className="hidden sm:flex justify-end mb-12">
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 text-lg font-semibold
          text-red-500 hover:underline transition"
        >
          {showAll ? "SHOW LESS" : "SEE MORE"}
          <span>→</span>
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-8">
        {visibleProducts.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.image}
            sizes={item.sizes}
          />
        ))}
      </div>

      {/* SEE MORE BUTTON MOBILE */}
      <div className="flex sm:hidden justify-center mt-10">
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 text-lg font-semibold
          text-red-500 hover:underline transition"
        >
          {showAll ? "SHOW LESS" : "SEE MORE"}
          <span>→</span>
        </button>
      </div>

    </div>
  );
};

export default BestSeller;