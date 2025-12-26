import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Title from '../Components/Title.jsx';
import ProductItem from '../Components/ProductItem.jsx';
import { StoreContext } from '../context/StoreContext';

const Collection = () => {

  const { products, search, showSearch } = useContext(StoreContext);

  const [searchParams] = useSearchParams();
  const brandFromURL = searchParams.get('brand');

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  const [tempCategory, setTempCategory] = useState([]);
  const [tempSubCategory, setTempSubCategory] = useState([]);

  const [sortType, setSortType] = useState('relavent');

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

  const handleDone = () => {
    setCategory(tempCategory);
    setSubCategory(tempSubCategory);
    setShowFilter(false);
  };

  /* =======================
     APPLY FILTER
     ======================= */
  const applyFilter = () => {
    let productsCopy = [...products];

    // 🔍 SEARCH BAR FILTER
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 🏷 BRAND FILTER FROM NAME (CASE INSENSITIVE)
    if (brandFromURL) {
      const brandLower = brandFromURL.toLowerCase();
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(brandLower)
      );
    }

    // 📦 CATEGORY
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item =>
        category.some(cat =>
          cat.toLowerCase() === item.category.toLowerCase()
        )
      );
    }

    // 🧩 SUB CATEGORY
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item =>
        subCategory.some(sub =>
          sub.toLowerCase() === item.subCategory.toLowerCase()
        )
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = [...filterProducts];

    if (sortType === 'low-high') {
      fpCopy.sort((a, b) => a.price - b.price);
    } else if (sortType === 'high-low') {
      fpCopy.sort((a, b) => b.price - a.price);
    } else {
      applyFilter();
      return;
    }

    setFilterProducts(fpCopy);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products, brandFromURL]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-10 pt-10 border-t">

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

        <div className={`border pl-5 py-4 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-4 font-semibold">CATEGORIES</p>
          {['Cat Food','Dog Food','Small Pets','Pet Parent','Henlo','Pharmacy','Consult a Vet']
            .map(item => (
              <label key={item} className="flex gap-3 mb-2">
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

        <div className={`border pl-5 py-4 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-4 font-semibold">TYPE</p>
          {[
            'DryFood','WetFood','KittenFood','PremiumFood','CreamyTreats',
            'JerkyTreats','CrunchyTreats','PuppyFood','GrainFreeFood',
            'BakedDryFood','PremiumDogFood','Biscuits&Cookies','Bones&Chews',
            'SkinCare','JointCare','KidneyCare','LiverCare','CardiacCare','Eye&EarCare'
          ]
            .map(item => (
              <label key={item} className="flex gap-3 mb-2">
                <input
                  type="checkbox"
                  value={item}
                  onChange={toggleSubCategory}
                  checked={tempSubCategory.includes(item)}
                />
                {item}
              </label>
          ))}
          <button onClick={handleDone} className="mt-4 w-full bg-black text-white py-2">
            Done
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1">
        <div className="flex justify-between mb-4">
          <Title text1="ALL" text2="COLLECTIONS" />
          <select onChange={(e) => setSortType(e.target.value)}>
            <option value="relavent">Relavent</option>
            <option value="low-high">Low to High</option>
            <option value="high-low">High to Low</option>
          </select>
        </div>

        {brandFromURL && (
          <p className="mb-4 text-sm">
            Showing results for brand: <b>{brandFromURL}</b>
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filterProducts.map(item => (
            <ProductItem
              key={item._id}
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
