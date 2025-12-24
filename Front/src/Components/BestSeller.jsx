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

  const visibleProducts = showAll ? bestSeller : bestSeller.slice(0, 5)

  return (
    <div className="my-10 px-4">

      {/* TITLE + BUTTON */}
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 mb-6">

        {/* LEFT SPACER */}
        <div className="hidden sm:block"></div>

        {/* CENTER TEXT */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            BEST SELLERS
          </h2>

          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-md">
            Explore our top picks, trusted by customers for their unmatched quality and popularity.
          </p>
        </div>
      </div>
      <div className="flex justify-center sm:justify-end -mt-2">
  <button
    onClick={() => setShowAll(!showAll)}
    className="
      min-w-[100px] min-h-[35px]
      px-7 py-2.5
      text-base font-semibold
      text-orange-500
      bg-white
      border-2 border-orange-500
      hover:bg-orange-500 hover:text-white
      transition-all duration-300
    "
  >
    {showAll ? 'Show Less' : 'View All'}
  </button>
</div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {visibleProducts.map(item => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))}
      </div>

    </div>
    
  )
}

export default BestSeller
