import React, { useContext, useEffect, useState } from 'react'
import logo from '/logon.png';
import { FaRegUser, FaSearch } from 'react-icons/fa';
import { IoMdChatboxes } from "react-icons/io";
import Modal from './Modal';
import Profile from './Profile';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll function with smooth transitions
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setIsScrolled(true);
        setSticky(true);
      } else {
        setIsScrolled(false);
        setSticky(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = (
    <>
      <li><a href='/' className="hover:text-orange-500 transition-colors duration-200">Home</a></li>
      <li><a href='/browse' className="hover:text-orange-500 transition-colors duration-200">Browse</a></li>
    </>
  );

  return (
    <header className={`mx-auto fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'backdrop-blur-sm bg-white/90' : 'bg-transparent'}`}>
      <div className={`navbar xl:px-24 px-4 ${isSticky ? "shadow-lg bg-white/90 transition-all duration-500" : ""}`}>
        {/* Logo and Mobile Menu */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden hover:bg-orange-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-white rounded-box w-52 border border-gray-100">
              {navItems}
            </ul>
          </div>
          <Link to='/' className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 md:h-12 transition-all duration-300 hover:scale-105" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            {navItems}
          </ul>
        </div>

        {/* Right Side Icons and Buttons */}
        <div className="navbar-end gap-3">
          {/* Search Button */}
          <button 
            className="btn btn-circle btn-ghost hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-colors duration-200 hidden md:flex"
            aria-label="Search"
          >
            <FaSearch className="text-lg" />
          </button>

          {/* Chat Button */}
          <Link 
            to="/chats" 
            className="btn btn-circle btn-ghost hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-colors duration-200 relative"
            aria-label="Chats"
          >
            <IoMdChatboxes className="text-2xl" />
            {/* Optional notification badge */}
            {/* <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span> */}
          </Link>

          {/* User Button */}
          {user ? (
            <Profile user={user} />
          ) : (
            <button 
              onClick={() => document.getElementById('my_modal_5').showModal()} 
              className="btn bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 rounded-full px-6 text-white flex items-center gap-2 border-none shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FaRegUser /> 
              <span className="hidden sm:inline">Login</span>
            </button>
          )}
          
          <Modal />
        </div>
      </div>
    </header>
  )
}

export default Navbar