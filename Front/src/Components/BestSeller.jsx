import React, { useContext, useEffect, useState } from 'react'
import ProductItem from './ProductItem.jsx'
import { StoreContext } from '../context/StoreContext'

const BestSeller = () => {
  const { products = [] } = useContext(StoreContext)

  const [bestSeller, setBestSeller] = useState([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const bestProduct = products.filter(item => item.bestseller)
    setBestSeller(bestProduct)
  }, [products])

  const visibleProducts = showAll ? bestSeller : bestSeller.slice(0, 6)

  return (
    <div className="my-10 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">

      {/* ===== TITLE ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 mb-4">
        <div className="hidden sm:block"></div>

        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            BEST SELLERS
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-md">
            Explore our top picks, trusted by customers for their unmatched quality and popularity.
          </p>
        </div>
      </div>

      {/* ===== VIEW ALL (DESKTOP) ===== */}
      <div className="hidden sm:flex justify-end mb-4">
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-6 py-2 text-sm font-semibold text-orange-500 border-2 border-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition"
        >
          {showAll ? 'Show Less' : 'View All'}
        </button>
      </div>

      {/* ===== PRODUCTS ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 gap-y-7">
        {visibleProducts.map(item => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.image}
            sizes={item.sizes}   
          />
        ))}
      </div>

      {/* ===== VIEW ALL (MOBILE) ===== */}
      <div className="flex sm:hidden justify-center mt-6">
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-6 py-2 text-sm font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition"
        >
          {showAll ? 'Show Less' : 'View All'}
        </button>
      </div>

    </div>
  )
}

export default BestSeller
