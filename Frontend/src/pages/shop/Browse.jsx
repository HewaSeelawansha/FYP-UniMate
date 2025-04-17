import React, { useEffect, useState } from 'react';
import Cards from '../../components/Cards';
import { FaFilter, FaSearch, FaTimes, FaChevronDown, FaChevronUp, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Browse = () => {
  const [filteredItems, setFilteredItems] = useState([]);
const [totalListings, setTotalListings] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOptions, setSortOptions] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Keep this as 6 or change to 10 as needed
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data with search and filters
  const fetchListings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `http://localhost:3000/listing/search?page=${currentPage}&limit=${itemsPerPage}`;
      
      // Add search query if exists
      if (searchQuery) {
        url += `&q=${encodeURIComponent(searchQuery)}`;
      }
      
      // Add category filter if not "all"
      if (selectedCategory !== "all") {
        url += `&type=${encodeURIComponent(selectedCategory)}`;
      }
      
      // Add sorting if selected
      if (sortOptions) {
        url += `&sort=${sortOptions}`;
      }

      const response = await axios.get(url);
      setFilteredItems(response.data.listings || response.data); // Handle both formats
      setTotalListings(response.data.total || response.data.length); // Get total count
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to load listings. Please try again.");
      setFilteredItems([]);
      setTotalListings(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when filters, search or page changes
  useEffect(() => {
    fetchListings();
  }, [currentPage, searchQuery, selectedCategory, sortOptions]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const filterItems = (type) => {
    setSelectedCategory(type);
    setCurrentPage(1);
  };

  const showAll = () => {
    setSelectedCategory("all");
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSortChange = (option) => {
    setSortOptions(option);
    setCurrentPage(1);
  };

  // Categories for filter
  const categories = [
    { id: "all", name: "All" },
    { id: "1-Person Boarding Room", name: "1 Person" },
    { id: "2-Person Shared Room", name: "2 Person" },
    { id: "2 to 4-Person Shared Room", name: "2-4 Person" },
    { id: "Whole House-Short Term", name: "Whole House-ST" },
    { id: "Whole House-Long Term", name: "Whole House-LT" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-orange-100 pb-24 pt-32">
        <div className="absolute inset-0 bg-[url('/path/to/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="container mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
            >
              Find Your <span className="text-green-600">Perfect</span> Student Home
            </motion.h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Discover comfortable, affordable accommodations tailored for student life
            </p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, location or type"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-6 py-4 pr-12 rounded-full border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 shadow-sm transition-all duration-300"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors">
                  {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch className="text-xl" />}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto pt-20 px-4 -mt-16 relative z-20">
        {/* Filters & Sorting */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Mobile Filters Toggle */}
            <button 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="md:hidden flex items-center justify-between w-full px-4 py-3 bg-gray-100 rounded-lg"
            >
              <span className="font-medium">Filters</span>
              {isFiltersOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {/* Category Filters - Desktop */}
            <div className="hidden md:flex items-center flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => filterItems(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-green text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-3">
              <div className="flex border border-gray-300 items-center bg-gray-100 rounded-lg overflow-hidden">
                <div className="px-3 py-3 bg-gray-800 text-white">
                  <FaFilter className="text-sm" />
                </div>
                <select
                  name="sort"
                  id="sort"
                  onChange={(e) => handleSortChange(e.target.value)}
                  value={sortOptions}
                  className="bg-white px-3 py-2 text-sm font-medium focus:outline-none"
                  disabled={isLoading}
                >
                  <option value="">Sort by</option>
                  <option value="newly">Newest First</option>
                  <option value="A-Z">A-Z</option>
                  <option value="Z-A">Z-A</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="d-l2h">Distance: Low to High</option>
                  <option value="d-h2l">Distance: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        filterItems(category.id);
                        setIsFiltersOpen(false);
                      }}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-green text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex justify-center my-12">
            <FaSpinner className="animate-spin text-4xl text-green-600" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && !error && (
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredItems.length}</span> properties
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <button
                onClick={showAll}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                Clear filters
                <FaTimes className="ml-1" />
              </button>
            )}
          </div>
        )}

        {/* Property Grid */}
        {!isLoading && !error && (
          <>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Cards item={item} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No properties found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                <button
                  onClick={showAll}
                  className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
      {!isLoading && !error && totalListings > itemsPerPage && (
        <div className="flex justify-center my-12">
          <nav className="flex items-center gap-1">
            {/* <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-full font-medium bg-green text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              //&lt;
              Prev
            </button> */}
            
            {Array.from({ length: Math.ceil(totalListings / itemsPerPage) }).map(
              (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-colors ${
                    currentPage === index + 1
                      ? 'bg-green text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}
            
            {/* <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === Math.ceil(totalListings / itemsPerPage)}
              className="w-10 h-10 flex items-center justify-center rounded-full font-medium bg-green text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
              //&gt;
            </button> */}
          </nav>
        </div>
      )}
      </div>
    </div>
  );
};

export default Browse;