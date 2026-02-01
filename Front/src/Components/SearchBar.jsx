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
      <div className="h-6"></div>

      <div className="w-full px-6">
        <div
          ref={searchRef}
          className="flex items-center gap-3 border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for cat food"
            className="flex-1 text-base outline-none bg-transparent"
          />

          {/* Search Button - optional, since we filter live */}
          <button
            className="flex items-center justify-center bg-[#D2F04A] text-black px-4 py-2 rounded-full hover:bg-[#C0E93D] transition"
            onClick={() => setShowSearch(true)} // keeps search open
          >
            <img src={assets.search_icon} alt="search" className="w-4 h-4" />
          </button>

          <img
            onClick={() => setShowSearch(false)}
            src={assets.cross_icon}
            alt="close"
            className="w-4 cursor-pointer opacity-70 hover:opacity-100"
          />
        </div>
      </div>

      <div className="h-6"></div>
    </>
  )
}

export default SearchBar
