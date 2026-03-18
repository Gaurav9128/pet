import React, { useContext, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Title from '../Components/Title.jsx';
import ProductItem from '../Components/ProductItem.jsx';
import { StoreContext } from '../context/StoreContext';
import "./Collection.css";

const CATEGORY_OPTIONS = [
  { label: 'Cat Food', value: 'cats' },
  { label: 'Dog Food', value: 'dogs' },
  { label: 'Small Pets', value: 'small-pets' },
  { label: 'Pet Parent', value: 'pet-parent' },
  { label: 'Henlo', value: 'henlo' },
  { label: 'Pharmacy', value: 'pharmacy' },
  { label: 'Consult a Vet', value: 'vet' },
];

const SUBCATEGORY_OPTIONS = [
  { label: 'Dry Food', value: 'dry-food' },
  { label: 'Wet Food', value: 'wet-food' },
  { label: 'Kitten Food', value: 'kitten-food' },
  { label: 'Premium Food', value: 'premium-food' },
  { label: 'Creamy Treats', value: 'creamy-treats' },
  { label: 'Jerky Treats', value: 'jerky-treats' },
  { label: 'Crunchy Treats', value: 'crunchy-treats' },
  { label: 'Puppy Food', value: 'puppy-food' },
  { label: 'Grain Free Food', value: 'grain-free' },
];

const Collection = () => {

  const {
    products = [],
    searchQuery   // ✅ ADD THIS
  } = useContext(StoreContext);

  const [searchParams] = useSearchParams();

  const searchFromURL = searchParams.get('search') || '';
  const categoryFromURL = searchParams.get('category');

  const [showFilter, setShowFilter] = useState(false);

  const [tempCategory, setTempCategory] = useState([]);
  const [tempSubCategory, setTempSubCategory] = useState([]);

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  const [sortType, setSortType] = useState('relavent');

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  useEffect(() => {
    if (categoryFromURL) {
      setCategory([categoryFromURL]);
      setTempCategory([categoryFromURL]);
    }
  }, [categoryFromURL]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setTempCategory(prev =>
      prev.includes(value)
        ? prev.filter(i => i !== value)
        : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setTempSubCategory(prev =>
      prev.includes(value)
        ? prev.filter(i => i !== value)
        : [...prev, value]
    );
  };

  const applyFilters = () => {
    setCategory(tempCategory);
    setSubCategory(tempSubCategory);
    setCurrentPage(1);

    if (window.innerWidth < 640) {
      setShowFilter(false);
    }
  };

  const resetFilters = () => {
    setTempCategory([]);
    setTempSubCategory([]);
    setCategory([]);
    setSubCategory([]);
    setCurrentPage(1);
  };

  const getLowestPrice = (product) => {
    if (!product?.sizes?.length) return 0;
    return Math.min(...product.sizes.map(s => Number(s.price) || 0));
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredProducts = useMemo(() => {

    let result = [...products];

    result = result.filter(p => p.isAvailable);

    // ✅ URL search + Navbar search combine
    const finalSearch = (searchQuery || searchFromURL).toLowerCase();

    if (finalSearch) {
      result = result.filter(p =>
        (p.name || '').toLowerCase().includes(finalSearch)
      );
    }

    if (category.length > 0) {
      result = result.filter(p =>
        category.includes(p.category)
      );
    }

    if (subCategory.length > 0) {
      result = result.filter(p =>
        subCategory.includes(p.subCategory)
      );
    }

    if (sortType === 'low-high') {
      result.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    }

    else if (sortType === 'high-low') {
      result.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
    }

    return result;

  }, [products, searchQuery, searchFromURL, category, subCategory, sortType]);

  /* PAGINATION */
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (

    <div className="flex flex-col sm:flex-row gap-10 pt-10 border-t">

      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden transition-transform ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        <div className={`border pl-5 py-4 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-4 font-semibold">CATEGORIES</p>

          {CATEGORY_OPTIONS.map(cat => (
            <label key={cat.value} className="flex gap-3 mb-2">
              <input
                type="checkbox"
                value={cat.value}
                checked={tempCategory.includes(cat.value)}
                onChange={toggleCategory}
              />
              {cat.label}
            </label>
          ))}
        </div>

        <div className={`border pl-5 py-4 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-4 font-semibold">TYPE</p>

          {SUBCATEGORY_OPTIONS.map(sub => (
            <label key={sub.value} className="flex gap-3 mb-2">
              <input
                type="checkbox"
                value={sub.value}
                checked={tempSubCategory.includes(sub.value)}
                onChange={toggleSubCategory}
              />
              {sub.label}
            </label>
          ))}

          <div className="flex gap-2 mt-4">
            <button onClick={applyFilters} className="w-full bg-black text-white py-2 rounded">
              Done
            </button>
            <button onClick={resetFilters} className="w-full border py-2 rounded">
              Reset
            </button>
          </div>
        </div>
      </div>

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
          <p className="text-center text-gray-500 mt-10">
            No products found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map(item => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  image={item.image}
                  sizes={item.sizes}
                />
              ))}
            </div>

            <br />

            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                  ◀ Prev
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      className={currentPage === page ? "active-page" : ""}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                })}

                <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                  Next ▶
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default Collection;