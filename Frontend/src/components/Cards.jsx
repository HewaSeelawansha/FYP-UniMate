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
      {/* Image container with overlay for price */}
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
        
        {/* Price tag */}
        <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-1 rounded-full font-semibold shadow-lg">
          LKR {price?.toLocaleString() || 0}/mo
        </div>
        
        {/* Rating */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-yellow-500 px-3 py-1 rounded-full font-semibold flex items-center shadow-lg">
          <FaStar className="mr-1" />{rating?.toFixed(1) || "4.0"}
        </div>
        
        {/* Heart Icon */}
        <div
          className={`absolute bottom-4 right-4 p-2 rounded-full ${
            isHeartFilled ? "bg-red-500 text-white" : "bg-white text-gray-400"
          } hover:scale-110 shadow-lg transition duration-300 cursor-pointer`}
          onClick={handleHeartClick}
        >
          <FaHeart className="h-5 w-5" />
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-1">
          {name || "Untitled Property"}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {description.length > 33 ? description.slice(0, 33) + "..." : description || 'No Description Available'}
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

// import React, { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaHeart } from "react-icons/fa";
// import { AuthContext } from "../contexts/AuthProvider";

// const Cards = ({ item }) => {
//   const [isHeartFilled, setIsHeartFilled] = useState(false);
//   const { _id, name, description, price, images } = item;
//   const navigate = useNavigate();

//   const handleHeartClick = () => {
//     setIsHeartFilled(!isHeartFilled);
//   };

//   return (
//     <div className="card bg-white rounded-xl shadow-lg overflow-hidden w-[300px] h-[420px] relative border border-gray-200">
//       {/* Heart Icon */}
//       <div
//         className={`absolute right-2 top-2 p-2 rounded-lg hover:scale-105 bg-emerald-400 ${
//           isHeartFilled ? "text-blue-600" : "text-white"
//         } transition duration-300 cursor-pointer`}
//         onClick={handleHeartClick}
//       >
//         <FaHeart className="h-6 w-6" />
//       </div>

//       {/* Listing Image */}
//       <Link to={`/listing/${_id}`}>
//         <figure className="w-full h-[200px] bg-gray-100 flex items-center justify-center">
//           <img
//             src={
//               images[0] ||
//               "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/7eb8bd55408243.5982f1d13533f.jpg"
//             }
//             alt="Listing"
//             className="w-full h-56"
//           />
//         </figure>
//       </Link>

//       {/* Listing Details */}
//       <div className="p-4 flex flex-col justify-between flex-grow">
//         <Link to={`/listing/${_id}`}>
//           <h2 className="text-xl font-bold text-gray-800 mb-1">{name}</h2>
//         </Link>
//         <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//         {description.length > 33 ? description.slice(0, 33) + "..." : description}
        
//         </p>

//         {/* Price */}
//         <h5 className="font-bold text-lg text-blue-600 mb-2">
//           LKR {price?.toLocaleString()}/month
//         </h5>
//       </div>

//       {/* Full-Width View Button */}
//       <button
//         className="w-full bg-emerald-500 text-white py-3 text-lg font-medium hover:bg-emerald-600 transition duration-300"
//         onClick={() => navigate(`/listing/${_id}`)}
//       >
//         View
//       </button>
//     </div>
//   );
// };

// export default Cards;

// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";
// import { IoBedOutline, IoSquareOutline } from "react-icons/io5";

// const Cards = ({ item }) => {
//   const [isHeartFilled, setIsHeartFilled] = useState(false);
//   const { _id, name, description, price, images, location, bedrooms, area } = item;
//   const navigate = useNavigate();

//   const handleHeartClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsHeartFilled(!isHeartFilled);
//   };

//   return (
//     <div 
//       className="card bg-white rounded-xl shadow-xl overflow-hidden w-[300px] h-[420px] relative border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
//       onClick={() => navigate(`/listing/${_id}`)}
//     >
//       {/* Heart Icon */}
//       <div
//         className={`absolute right-3 top-3 z-10 p-2 rounded-full ${
//           isHeartFilled ? "bg-red-500 text-white" : "bg-white/90 text-gray-400"
//         } shadow-md transition-all duration-300 hover:scale-110`}
//         onClick={handleHeartClick}
//       >
//         <FaHeart className="h-5 w-5" />
//       </div>

//       {/* Listing Image with Gradient Overlay */}
//       <div className="relative w-full h-[200px] overflow-hidden">
//         <img
//           src={
//             images[0] ||
//             "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
//           }
//           alt="Listing"
//           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//       </div>

//       {/* Listing Details */}
//       <div className="p-5 flex flex-col h-[220px]">
//         <div className="flex-grow">
//           <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
//             {name}
//           </h2>
          
//           <div className="flex items-center text-gray-600 mb-3">
//             <FaMapMarkerAlt className="mr-1 text-green-500" size={14} />
//             <span className="text-sm line-clamp-1">{location || "Unknown location"}</span>
//           </div>
          
//           <p className="text-gray-500 text-sm mb-4 line-clamp-2">
//             {description}
//           </p>
          
//           <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//             <div className="flex items-center">
//               <IoBedOutline className="mr-1" size={16} />
//               <span>{bedrooms || "N/A"} beds</span>
//             </div>
//             <div className="flex items-center">
//               <IoSquareOutline className="mr-1" size={16} />
//               <span>{area || "N/A"} sqft</span>
//             </div>
//           </div>
//         </div>

//         {/* Price and View Button */}
//         <div className="flex items-center justify-between mt-auto">
//           <div>
//             <span className="text-sm text-gray-500">Price</span>
//             <h5 className="font-bold text-lg text-green-600">
//               ${price.toLocaleString()}
//               <span className="text-sm font-normal text-gray-500">/mo</span>
//             </h5>
//           </div>
          
//           <button
//             className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate(`/listing/${_id}`);
//             }}
//           >
//             View Details
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cards;
