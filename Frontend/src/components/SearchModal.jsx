import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import useAxiosPublic from "../hooks/useAxiosPublic"

const SearchModal = ({ isOpen, onClose, initialSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialSearchQuery);
      setTimeout(() => inputRef.current?.focus(), 100);
      if (initialSearchQuery.trim() !== '') {
        performSearch(initialSearchQuery);
      }
    } else {
      setResults([]);
      setError(null);
    }
  }, [isOpen, initialSearchQuery]);

  useEffect(() => {
    const searchDelay = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        performSearch(searchQuery);
      } else {
        setResults([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(searchDelay);
  }, [searchQuery]);

  const performSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axiosPublic.get(
        `/listing/search?q=${encodeURIComponent(query)}&minimal=true&limit=5`
      );
      // Handle both response formats (array or object with listings property)
      const searchResults = Array.isArray(response.data) 
        ? response.data 
        : response.data.listings || [];
      setResults(searchResults);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch search results");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="relative p-4 border-b">
                <div className="relative flex items-center">
                  <FaSearch className="absolute left-4 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search by name, location, or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 shadow-sm transition-all duration-300 text-base"
                  />
                  {(searchQuery || isLoading) && (
                    <button 
                      className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => {
                        setSearchQuery('');
                        setResults([]);
                        inputRef.current?.focus();
                      }}
                    >
                      {isLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTimes />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Search Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {error ? (
                  <div className="p-6 text-center text-red-500">
                    {error}
                  </div>
                ) : isLoading ? (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center">
                      <FaSpinner className="animate-spin mr-2" />
                      <span>Searching...</span>
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <ul>
                    {results.map((item) => (
                      <motion.li 
                        key={item._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                      >
                        <Link
                          to={`/listing/${item._id}`}
                          className="block p-4"
                          onClick={onClose}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden mr-4 border border-gray-200">
                              <img 
                                src={item.images?.[0] || '/placeholder-image.jpg'} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/placeholder-image.jpg';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                              <p className="text-sm text-gray-500 mb-1">
                                {item.location || 'No location specified'}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-green-600">
                                  LKR {item.price?.toLocaleString() || 'N/A'}
                                </span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {item.type || 'Unknown type'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                ) : searchQuery ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">
                      No results found for "<span className="font-medium">{searchQuery}</span>"
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try different keywords
                    </p>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <FaSearch className="mx-auto text-gray-300 text-4xl mb-3" />
                    <p className="text-gray-500">Search for boarding houses</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try name, location, or type
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 p-3 text-center text-sm text-gray-500 border-t">
                {results.length > 0 ? (
                  <>
                  <p>Showing {results.length} result{results.length !== 1 ? 's' : ''}</p>
                  <Link to='/browse' className='text-green-500 hover:text-green-600'>Browse All</Link>
                  </>
                ) : (
                  'Press ESC to close'
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;