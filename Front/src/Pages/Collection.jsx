import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import Title from '../Components/Title.jsx';
import ProductItem from '../Components/ProductItem.jsx';
import { StoreContext } from '../context/StoreContext';

const Collection = () => {

  const { products, search, showSearch } = useContext(StoreContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);

  // ✅ FINAL APPLIED FILTERS
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  // ⏳ TEMP FILTERS
  const [tempCategory, setTempCategory] = useState([]);
  const [tempSubCategory, setTempSubCategory] = useState([]);

  const [sortType, setSortType] = useState('relavent');

  /* =======================
     TOGGLE TEMP CATEGORY
     ======================= */
  const toggleCategory = (e) => {
    const value = e.target.value;
    setTempCategory(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setTempSubCategory(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  /* =======================
     DONE BUTTON
     ======================= */
  const handleDone = () => {
    setCategory(tempCategory);
    setSubCategory(tempSubCategory);
    setShowFilter(false); // ✅ ONLY HERE FILTER CLOSES
  };

  /* =======================
     APPLY FILTER
     ======================= */
  const applyFilter = () => {
    let productsCopy = [...products];

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item =>
        category.some(cat =>
          cat.toLowerCase().trim() === item.category.toLowerCase().trim()
        )
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item =>
        subCategory.some(sub =>
          sub.toLowerCase().trim() === item.subCategory.toLowerCase().trim()
        )
      );
    }

    setFilterProducts(productsCopy);
  };

  /* =======================
     SORT PRODUCT
     ======================= */
  const sortProduct = () => {
    let fpCopy = [...filterProducts];

    switch (sortType) {
      case 'low-high':
        fpCopy.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        fpCopy.sort((a, b) => b.price - a.price);
        break;
      default:
        applyFilter();
        return;
    }

    setFilterProducts(fpCopy);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">

      {/* LEFT FILTER */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* CATEGORY */}
        <div className={`border border-gray-300 pl-5 py-4 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-4 font-semibold">CATEGORIES</p>

          {['Cat Food','Dog Food','Small Pets','Pet Parent','Henlo','Pharmacy','Consult a Vet']
            .map(item => (
              <label key={item} className="flex items-center gap-3 mb-2 text-gray-700">
                <input
                  type="checkbox"
                  value={item}
                  onChange={toggleCategory}
                  checked={tempCategory.includes(item)}
                />
                {item}
              </label>
          ))}
        </div>

        {/* SUB CATEGORY */}
        <div className={`border border-gray-300 pl-5 py-4 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-4 font-semibold">TYPE</p>

          {[
            'DryFood','WetFood','KittenFood','PremiumFood','CreamyTreats',
            'JerkyTreats','CrunchyTreats','PuppyFood','GrainFreeFood',
            'BakedDryFood','PremiumDogFood','Biscuits&Cookies','Bones&Chews',
            'SkinCare','JointCare','KidneyCare','LiverCare','CardiacCare','Eye&EarCare'
          ].map(item => (
            <label key={item} className="flex items-center gap-3 mb-2 text-gray-700">
              <input
                type="checkbox"
                value={item}
                onChange={toggleSubCategory}
                checked={tempSubCategory.includes(item)}
              />
              {item.replace(/&/g, ' & ')}
            </label>
          ))}

          {/* DONE BUTTON */}
          <button
            onClick={handleDone}
            className="mt-4 w-full bg-black text-white py-2 rounded"
          >
            Done
          </button>
        </div>
      </div>

      {/* RIGHT PRODUCTS */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Collection;
