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
    <div className="card bg-white rounded-xl shadow-lg overflow-hidden w-[300px] relative border border-gray-200">
      {/* Heart Icon */}
      <div
        className={`absolute right-2 top-2 p-2 rounded-lg bg-green ${
          isHeartFilled ? "text-sky-300" : "text-white"
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
        <h5 className="font-semibold text-lg text-blue-700 mb-2">
          ${price}
        </h5>
      </div>

      {/* Full-Width View Button */}
      <button
        className="w-full bg-green text-white py-3 text-lg font-medium hover:bg-sky-300 transition duration-300"
        onClick={() => navigate(`/listing/${_id}`)}
      >
        View
      </button>
    </div>
  );
};

export default Cards;
