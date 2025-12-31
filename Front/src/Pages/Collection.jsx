import React, { useContext, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Title from '../Components/Title.jsx';
import ProductItem from '../Components/ProductItem.jsx';
import { StoreContext } from '../context/StoreContext';

const Collection = () => {
  const { products = [], search = '', showSearch = false } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const brandFromURL = searchParams.get('brand');

  const [showFilter, setShowFilter] = useState(false);

  // TEMP STATES (checkbox select ke liye)
  const [tempCategory, setTempCategory] = useState([]);
  const [tempSubCategory, setTempSubCategory] = useState([]);

  // APPLIED STATES (Done button ke baad)
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  const [sortType, setSortType] = useState('relavent');

  /* ---------- TOGGLE CATEGORY (TEMP) ---------- */
  const toggleCategory = (e) => {
    const value = e.target.value;
    setTempCategory(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  /* ---------- TOGGLE SUB CATEGORY (TEMP) ---------- */
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setTempSubCategory(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  /* ---------- APPLY FILTER (DONE BUTTON) ---------- */
  const applyFilters = () => {
    setCategory(tempCategory);
    setSubCategory(tempSubCategory);

    // ✅ Close filter section on mobile after clicking Done
    if (window.innerWidth < 640) {
      setShowFilter(false);
    }
  };

  /* ---------- LOWEST PRICE ---------- */
  const getLowestPrice = (product) => {
    if (!product?.sizes?.length) return 0;
    return Math.min(...product.sizes.map(s => Number(s.price) || 0));
  };

  /* ---------- FILTER + SORT ---------- */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // SEARCH
    if (showSearch && search) {
      const searchLower = search.toLowerCase();
      result = result.filter(item =>
        (item.name || '').toLowerCase().includes(searchLower)
      );
    }

    // BRAND
    if (brandFromURL) {
      const brandLower = brandFromURL.toLowerCase();
      result = result.filter(item =>
        (item.name || '').toLowerCase().includes(brandLower)
      );
    }

    // CATEGORY (APPLIED)
    if (category.length > 0) {
      result = result.filter(item =>
        category.some(cat =>
          (item.category || '').toLowerCase() === cat.toLowerCase()
        )
      );
    }

    // SUB CATEGORY (APPLIED)
    if (subCategory.length > 0) {
      result = result.filter(item =>
        subCategory.some(sub =>
          (item.subCategory || '').toLowerCase() === sub.toLowerCase()
        )
      );
    }

    // SORT
    if (sortType === 'low-high') {
      result.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    } else if (sortType === 'high-low') {
      result.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
    }

    return result;
  }, [products, search, showSearch, brandFromURL, category, subCategory, sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-10 pt-10 border-t">

      {/* ---------- LEFT FILTER ---------- */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden transition-transform ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt="dropdown"
          />
        </p>

        {/* CATEGORY */}
        <div className={`border pl-5 py-4 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-4 font-semibold">CATEGORIES</p>

          {[
            { label: 'Cat Food', value: 'cats' },
            { label: 'Dog Food', value: 'dogs' },
            { label: 'Small Pets', value: 'small-pets' },
            { label: 'Pet Parent', value: 'pet-parent' },
            { label: 'Henlo', value: 'henlo' },
            { label: 'Pharmacy', value: 'pharmacy' },
            { label: 'Consult a Vet', value: 'consult-vet' },
          ].map(item => (
            <label key={item.value} className="flex gap-3 mb-2">
              <input
                type="checkbox"
                value={item.value}
                onChange={toggleCategory}
                checked={tempCategory.includes(item.value)}
              />
              {item.label}
            </label>
          ))}
        </div>

        {/* SUB CATEGORY */}
        <div className={`border pl-5 py-4 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-4 font-semibold">TYPE</p>

          {[
            { label: 'Dry Food', value: 'dry-food' },
            { label: 'Wet Food', value: 'wet-food' },
            { label: 'Kitten Food', value: 'kitten-food' },
            { label: 'Premium Food', value: 'premium-food' },
            { label: 'Creamy Treats', value: 'creamy-treats' },
            { label: 'Jerky Treats', value: 'jerky-treats' },
            { label: 'Crunchy Treats', value: 'crunchy-treats' },
            { label: 'Puppy Food', value: 'puppy-food' },
            { label: 'Grain Free Food', value: 'grain-free-food' },
          ].map(item => (
            <label key={item.value} className="flex gap-3 mb-2">
              <input
                type="checkbox"
                value={item.value}
                onChange={toggleSubCategory}
                checked={tempSubCategory.includes(item.value)}
              />
              {item.label}
            </label>
          ))}

          {/* ✅ DONE BUTTON */}
          <button
            onClick={applyFilters}
            className="w-full bg-black text-white py-2 mt-4 rounded hover:bg-gray-800"
          >
            Done
          </button>
        </div>
      </div>

      {/* ---------- RIGHT PRODUCTS ---------- */}
      <div className="flex-1">
        <div className="flex justify-between mb-4 items-center">
          <Title text1="ALL" text2="COLLECTIONS" />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="relavent">Relevant</option>
            <option value="low-high">Low to High</option>
            <option value="high-low">High to Low</option>
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(item => (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                image={item.image}
                sizes={item.sizes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
