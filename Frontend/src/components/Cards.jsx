import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Cards = ({ item }) => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const { _id, name, description, price, images, location, rating } = item;
  const navigate = useNavigate();

  const handleHeartClick = (e) => {
    e.stopPropagation();
    setIsHeartFilled(!isHeartFilled);
  };

  return (
    <motion.div 
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col"
    >
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img 
          src={images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
          alt={name || "Property"}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        
        <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-1 rounded-full font-semibold shadow-lg">
          LKR {price?.toLocaleString() || 0}/mo
        </div>
        
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-yellow-500 px-3 py-1 rounded-full font-semibold flex items-center shadow-lg">
          <FaStar className="mr-1" />{rating?.toFixed(1) || "4.0"}
        </div>
        
        <div
          className={`absolute bottom-4 right-4 p-2 rounded-full ${
            isHeartFilled ? "bg-red-500 text-white" : "bg-white text-gray-400"
          } hover:scale-110 shadow-lg transition duration-300 cursor-pointer`}
          onClick={handleHeartClick}
        >
          <FaHeart className="h-5 w-5" />
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-1">
          {name || "Untitled Property"}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {description.length > 33 ? description.slice(0, 33) + "..." : description || 'No Description Available'}
        </p>

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
            to={`/listing/${_id}`}
            className="block text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl transition-colors duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Cards;

