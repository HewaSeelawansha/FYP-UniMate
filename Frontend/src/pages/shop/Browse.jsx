import React, { useEffect, useState } from 'react';
import Cards from '../../components/Cards';
import { FaFilter, FaSearch, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Browse = () => {
  const [hostel, setHostel] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOptions, setSortOptions] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/listing');
        const data = await response.json();
        const availableItems = data.filter((item) => item.available >= 0);
        setHostel(availableItems);
        setFilteredItems(availableItems);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  // Filter functions remain the same
  const filterItems = (type) => {
    const filtered = type === "all" ? hostel : hostel.filter((item) => item.type === type);
    setFilteredItems(filtered);
    setSelectedCategory(type);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    applyFilters(selectedCategory, event.target.value);
    setCurrentPage(1);
  };

  const showAll = () => {
    setFilteredItems(hostel);
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  const applyFilters = (category, search) => {
    let filtered = category === "all" ? hostel : hostel.filter((item) => item.type === category);
    if (search.trim() !== '') {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredItems(filtered);
  };

  const handleSortChange = (option) => {
    setSortOptions(option);
    let sortedItems = [...filteredItems];
    switch(option) {
      case "newly":
        sortedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "A-Z":
        sortedItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z-A":
        sortedItems.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "low-high":
        sortedItems.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        sortedItems.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilteredItems(sortedItems);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      <div className="relative bg-gradient-to-r from-green-50 to-gray-50 pb-24 pt-32">
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
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-6 py-4 pr-12 rounded-full border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 shadow-sm transition-all duration-300"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors">
                  <FaSearch className="text-xl" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
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
              <div className="flex border border-black items-center bg-gray-100 rounded-lg overflow-hidden">
                <div className="px-3 py-3 bg-black text-white">
                  <FaFilter className="text-sm" />
                </div>
                <select
                  name="sort"
                  id="sort"
                  onChange={(e) => handleSortChange(e.target.value)}
                  value={sortOptions}
                  className="bg-green px-3 py-2 text-sm font-medium focus:outline-none"
                >
                  <option value="" disabled>Sort by</option>
                  <option value="newly">Newest First</option>
                  <option value="A-Z">A-Z</option>
                  <option value="Z-A">Z-A</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
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
                          ? 'bg-green-600 text-white'
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

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{currentItems.length}</span> of{' '}
            <span className="font-semibold">{filteredItems.length}</span> properties
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                showAll();
              }}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              Clear search
              <FaTimes className="ml-1" />
            </button>
          )}
        </div>

        {/* Property Grid */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {currentItems.map((item) => (
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
              className="px-4 py-2 bg-green text-white rounded-full hover:bg-green-700 transition-colors"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredItems.length > itemsPerPage && (
          <div className="flex justify-center my-12">
            <nav className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map(
                (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
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
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;