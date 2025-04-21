import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthProvider";

const Cards = ({ item }) => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const { _id, name, description, price, images } = item;
  const navigate = useNavigate();

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  return (
    <div className="card bg-white rounded-xl shadow-lg overflow-hidden w-[300px] h-[420px] relative border border-gray-200">
      {/* Heart Icon */}
      <div
        className={`absolute right-2 top-2 p-2 rounded-lg bg-green-400 ${
          isHeartFilled ? "text-blue-600" : "text-white"
        } transition duration-300 cursor-pointer`}
        onClick={handleHeartClick}
      >
        <FaHeart className="h-6 w-6" />
      </div>

      {/* Listing Image */}
      <Link to={`/listing/${_id}`}>
        <figure className="w-full h-[200px] bg-gray-100 flex items-center justify-center">
          <img
            src={
              images[0] ||
              "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/7eb8bd55408243.5982f1d13533f.jpg"
            }
            alt="Listing"
            className="w-full h-56"
          />
        </figure>
      </Link>

      {/* Listing Details */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <Link to={`/listing/${_id}`}>
          <h2 className="text-xl font-bold text-gray-800 mb-1">{name}</h2>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {description.length > 33 ? description.slice(0, 33) + "..." : description}
        
        </p>

        {/* Price */}
        <h5 className="font-bold text-lg text-blue-600 mb-2">
          ${price}
        </h5>
      </div>

      {/* Full-Width View Button */}
      <button
        className="w-full bg-green-500 text-white py-3 text-lg font-medium hover:bg-blue-500 transition duration-300"
        onClick={() => navigate(`/listing/${_id}`)}
      >
        View
      </button>
    </div>
  );
};

export default Cards;

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
