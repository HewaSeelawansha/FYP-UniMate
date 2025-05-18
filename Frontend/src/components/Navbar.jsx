import React, { useEffect, useState, useRef } from "react";
import logo from "/logon.png";
import { FaRegUser, FaSearch } from "react-icons/fa";
import { FaTimes } from "react-icons/fa"; 
import { IoMdChatboxes } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Modal from "./Modal";
import Profile from "./Profile";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import useAuth from "../hooks/useAuth";
import SearchModal from "./SearchModal";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const { user, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); 
  const axiosSecure = useAxiosSecure();
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ref for the entire search container
  const searchContainerRef = useRef(null);

  useEffect(() => {
    if (user?.email) {
      const fetchPerson = async () => {
        setIsLoading(true);
        try {
          const response = await axiosSecure.get(`/users/${user.email}`);
          setPerson(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsSearchExpanded(false);
      }
    };

    // Click outside to close search
    const handleClickOutside = (e) => {
      if (
        isSearchExpanded &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsSearchExpanded(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchExpanded]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(true);
    }
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
    }
  };

  // Function to scroll to section
  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Add a small delay to allow navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Navigation links array for easier management
  const navLinks = [
    { name: "Stats", sectionId: "stats-section" },
    { name: "Featured Places", sectionId: "popular-places" },
    { name: "Interactive Map", sectionId: "locator" },
    { name: "Essential Amenities", sectionId: "amenities-spotlight" },
    { name: "UniMate Advantages", sectionId: "features-grid" },
  ];

  // Determine which navigation links to show based on current path
  const isHomePage = location.pathname === '/';

  return (
    <>
      <header
        className={`mx-auto fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "backdrop-blur-xl bg-white/80 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div
          className={`px-4 md:px-8 lg:px-12 xl:px-16 py-3 ${
            isSticky ? "shadow-lg bg-white/95 transition-all duration-300" : ""
          }`}
        >
          <div className="flex items-center justify-between container mx-auto">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">

              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-11 md:h-13 transition-all duration-300 hover:scale-105"
                />
              </Link>
            </div>

            {/* Right-aligned elements */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Desktop Search - Expands to the left */}
              <div
                ref={searchContainerRef}
                className="relative hidden md:block"
              >
                <motion.div
                  className="flex items-center justify-end"
                  initial={false}
                  animate={{ width: isSearchExpanded ? "20rem" : "3rem" }} // Increased width
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <AnimatePresence>
                    {isSearchExpanded && (
                      <motion.form
                        onSubmit={handleSearchSubmit}
                        className="absolute right-0 flex items-center w-full"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "100%" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search boarding houses..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full h-12 pl-4 pr-12 rounded-full border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 shadow-sm transition-all duration-300 text-base"
                        />

                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-14 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <FaTimes size={16} />
                          </button>
                        )}
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <button
                    type={isSearchExpanded ? "submit" : "button"}
                    onClick={
                      isSearchExpanded ? handleSearchSubmit : toggleSearch
                    }
                    className={`flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors duration-200 z-10`}
                    aria-label={
                      isSearchExpanded ? "Submit search" : "Open search"
                    }
                  >
                    <FaSearch size={18} className={"text-white"} />
                  </button>
                </motion.div>
              </div>

              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden flex items-center justify-center h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 transition-colors duration-200"
                aria-label="Search"
              >
                <FaSearch className="text-white" />
              </button>

              {/* Chat Button */}
              <Link
                to="/chats"
                className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition-colors duration-200"
                aria-label="Chats"
              >
                <IoMdChatboxes className="text-xl" />
              </Link>

              {/* User Button */}
              {user && person ? (
                <Profile user={user} role={person.role} />
              ) : isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
              ) : (
                <button
                  onClick={() =>
                    document.getElementById("my_modal_5").showModal()
                  }
                  className="flex items-center gap-2 py-2 px-4 md:px-5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <FaRegUser className="text-sm" />
                  <span className="hidden sm:inline py-1 text-sm">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-white shadow-lg"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-3">
                  {isHomePage && (
                    // Home page mobile navigation - section scrolling
                    navLinks.map((link) => (
                      <button
                        key={link.sectionId}
                        onClick={() => scrollToSection(link.sectionId)}
                        className="py-2 px-3 text-gray-700 font-medium text-sm hover:bg-gray-50 hover:text-emerald-500 rounded-lg transition-colors duration-200 text-left"
                      >
                        {link.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal for mobile */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery("");
        }}
        initialSearchQuery={searchQuery}
      />

      <Modal />
    </>
  );
};

export default Navbar;