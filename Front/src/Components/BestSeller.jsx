import React, { useContext, useEffect, useState } from "react";
import ProductItem from "./ProductItem.jsx";
import { StoreContext } from "../context/StoreContext";

const BestSeller = () => {
  const { products = [] } = useContext(StoreContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const bestProduct = products.filter(
      (item) => item.bestseller && item.isAvailable
    );
    setBestSeller(bestProduct);
  }, [products]);

  const visibleProducts = showAll ? bestSeller : bestSeller.slice(0, 15);

  return (
    <div className="my-16 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* TITLE */}
      <div className="flex flex-col items-center text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-wide uppercase">
          BEST SELLERS
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-600 max-w-md">
          Explore our top picks, trusted by customers for their unmatched
          quality and popularity.
        </p>
      </div>
<br/>
      {/* PRODUCT GRID - Balanced spacing for rounded borders */}
      {/* PRODUCT GRID - Updated to show 4 columns on medium screens and up */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 gap-y-4 sm:gap-4 sm:gap-y-8">
  {visibleProducts.map((item) => (
    <ProductItem
      key={item._id}
      id={item._id}
      name={item.name}
      image={item.image}
      sizes={item.sizes}
      rating={item.rating}
      reviewsCount={item.reviewsCount}
    />
  ))}
</div>

      {/* SEE MORE BUTTON */}
      <div className="flex justify-center sm:justify-end mt-12">
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1.5 text-lg font-semibold text-red-600 hover:text-red-700 hover:underline transition-all"
        >
          {showAll ? "SHOW LESS" : "SEE MORE"}
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default BestSeller;