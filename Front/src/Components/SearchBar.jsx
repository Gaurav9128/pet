import React, { useContext, useEffect, useRef, useState } from 'react'
import { StoreContext } from '../context/StoreContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'

const SearchBar = () => {

  const { search, setSearch, showSearch, setShowSearch } = useContext(StoreContext)
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const searchRef = useRef(null)

  // Show only on cats / collection page
  useEffect(() => {
    setVisible(
      location.pathname.includes('cats') ||
      location.pathname.includes('collection')
    )
  }, [location])

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false)
      }
    }

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSearch, setShowSearch])

  if (!showSearch || !visible) return null

  return (
    <>
      {/* TOP GAP */}
      <div className="h-6"></div>

      {/* SEARCH BAR */}
      <div className="w-full px-6">
        <div
          ref={searchRef}
          className="flex items-center gap-4 border border-gray-300 rounded-full px-6 py-4 bg-white shadow-sm"
        >

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products, brands and more..."
            className="flex-1 text-base outline-none bg-transparent"
          />

          <button className="text-sm font-medium text-white bg-black px-6 py-2 rounded-full hover:bg-gray-800 transition">
            Search
          </button>

          <img
            onClick={() => setShowSearch(false)}
            src={assets.cross_icon}
            alt="close"
            className="w-4 cursor-pointer opacity-70 hover:opacity-100"
          />
        </div>
      </div>

      {/* BOTTOM GAP */}
      <div className="h-6"></div>
    </>
  )
}

export default SearchBar
