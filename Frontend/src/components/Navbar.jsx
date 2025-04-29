import React, { useEffect, useState } from 'react';
import logo from '/logon.png';
import { FaRegUser, FaSearch } from 'react-icons/fa';
import { IoMdChatboxes } from "react-icons/io";
import Modal from './Modal';
import Profile from './Profile';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SearchModal from './SearchModal'; 
import useAxiosSecure from '../hooks/useAxiosSecure';

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const { user, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); 
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only run if user exists and has an email
    if (user?.email) {
      const fetchPerson = async () => {
        setIsLoading(true);
        try {
          const response = await axiosSecure.get(`/users/${user.email}`);
          setPerson(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPerson();
    }
  }, [user?.email]);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className={`mx-auto fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'backdrop-blur-sm bg-white/90' : 'bg-transparent'}`}>
        <div className={`xl:px-24 px-4 ${isSticky ? "shadow-lg bg-white/90 transition-all duration-500" : ""}`}>
          <div className='navbar container mx-auto'>
          {/* Logo and Mobile Menu */}
          <div className="navbar-start">
            <Link to='/' className="flex items-center">
              <img src={logo} alt="Logo" className="h-10 md:h-12 transition-all duration-300 hover:scale-105" />
            </Link>
          </div>

          {/* Right Side Icons and Buttons */}
          <div className="navbar-end gap-3">
            {/* Search Button */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="btn btn-circle btn-ghost bg-emerald-500 text-white hover:bg-emerald-600 transition-colors duration-200 relative"
              aria-label="Search"
            >
              <FaSearch className="text-lg" />
            </button>

            {/* Chat Button */}
            <Link 
              to="/chats" 
              className="btn btn-circle btn-ghost bg-emerald-500 hover:bg-emerald-600 text-white transition-colors duration-200 relative"
              aria-label="Chats"
            >
              <IoMdChatboxes className="text-2xl" />
            </Link>

            {/* User Button */}
            {user && person ? (
              <Profile user={user} role={person.role} />
            ) : isLoading? 
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2  border-green-500"></div>
            : (
              <button 
                onClick={() => document.getElementById('my_modal_5').showModal()} 
                className="btn text-white hover:bg-emerald-600 bg-emerald-500 rounded-full px-6 text-white flex items-center gap-2 border-none shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FaRegUser /> 
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
            
            <Modal />
          </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

export default Navbar;