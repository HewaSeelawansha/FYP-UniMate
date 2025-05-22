import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaAngleLeft, FaAngleRight, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';

const PopularPlaces = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const slider = useRef(null);
  const axiosPublic = useAxiosPublic();

  // Fetch listing data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosPublic.get('/listing');
        const data = response.data;
        // Filter for approved, paid listings with high ratings
        const highestRating = data.filter(
          item => item.status === "Approved" && 
                 item.payStatus === "Done" && 
                 item.rating > 2
        );
        
        // Sort by rating (highest first)
        highestRating.sort((a, b) => b.rating - a.rating);
        setListings(highestRating);
      } catch (error) {
        console.error("Error fetching listings: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosPublic]);

  const settings = {
    dots: false,
    infinite: listings.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1433,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Custom Card component
  const PropertyCard = ({ item }) => {
    return (
      <motion.div
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        className="mx-2 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col"
      >
        {/* Image container with overlay for price */}
        <div className="relative h-48 md:h-56 overflow-hidden">
          <img
            src={item.images?.[0] || ""}
            alt={item.name || "Property"}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "";
            }}
          />

          {/* Price tag */}
          <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-1 rounded-full font-semibold shadow-lg">
            ${item.price || 0}/mo
          </div>

          {/* Rating */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-yellow-500 px-3 py-1 rounded-full font-semibold flex items-center shadow-lg">
            <FaStar className="mr-1" />
            {item.rating?.toFixed(1) || "4.0"}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-1">
            {item.name || "Untitled Property"}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item?.description?.length > 33
              ? item?.description?.slice(0, 33) + "..."
              : item.description || "No Description Available"}
          </p>

          {/* Amenities */}
          {item.amenities?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Amenities
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.amenities.slice(0, 2).map((amenity, aIdx) => (
                  <span
                    key={aIdx}
                    className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-lg"
                  >
                    {amenity.slice(0, 15)}
                  </span>
                ))}
                {item.amenities.length > 2 && (
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-lg">
                    +{item.amenities.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-auto">
            <Link
              to={`/listing/${item._id}`}
              className="block text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl transition-colors duration-300"
            >
              View Details
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-6 relative">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="text-xl font-semibold uppercase text-green-500 mb-2"
            >
              Featured Places
            </motion.p>
            <motion.h2 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
              }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            >
              Popular Boarding Houses
            </motion.h2>
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
              }}
              className="text-gray-600 max-w-lg"
            >
              Discover top-rated student accommodations with excellent amenities and prime locations.
            </motion.p>
          </div>
          
          {/* Navigation arrows */}
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.5, delay: 0.3 } }
            }}
            className="flex mt-6 md:mt-0"
          >
            <button 
              onClick={() => slider?.current?.slickPrev()} 
              className="w-12 h-12 rounded-full bg-white text-green-500 hover:bg-green-500 hover:text-white border border-green-500 flex items-center justify-center transition-all duration-300 mr-3 shadow-md"
              aria-label="Previous slide"
            >
              <FaAngleLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => slider?.current?.slickNext()} 
              className="w-12 h-12 rounded-full bg-green-500 text-white hover:bg-green-600 flex items-center justify-center transition-all duration-300 shadow-md"
              aria-label="Next slide"
            >
              <FaAngleRight className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
        
        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
          </div>
        ) : (
          // Slider component
          <Slider ref={slider} {...settings} className="property-slider">
            {listings.length > 0 ? (
              listings.map((item, i) => (
                <div key={item._id || i} className="p-2">
                  <PropertyCard item={item} />
                </div>
              ))
            ) : (
              // Empty state
              <div className="text-center p-12 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-500">No properties found. Check back soon!</p>
              </div>
            )}
          </Slider>
        )}
        
        {/* View all button */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } }
          }}
          className="mt-12 text-center"
        >
          <Link 
            to="/browse" 
            className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
          >
            View All Properties
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PopularPlaces;