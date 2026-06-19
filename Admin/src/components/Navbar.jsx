import React from 'react';
import { Link } from 'react-router-dom';
// Import the logo directly from your assets folder
import logo_2 from '../assets/logo_2.png'; 

const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      
      {/* Clickable Logo */}
      <Link to="/">
        <img src={logo_2} alt="logo" className="logo w-32 md:w-35 cursor-pointer" />
      </Link>

      <button
        onClick={() => setToken('')}
        className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;