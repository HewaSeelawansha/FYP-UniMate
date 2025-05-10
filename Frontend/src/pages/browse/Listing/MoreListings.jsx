import React from 'react';
import { RiHotelFill } from 'react-icons/ri';
import { TbListDetails } from 'react-icons/tb';
import { Link } from 'react-router-dom';

const MoreListings = ({ listings = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {listings.map((listingItem, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Listing Image */}
                      <div className="h-48 overflow-hidden">
                        {listingItem.images?.length > 0 ? (
                          <img 
                            src={listingItem.images[0]} 
                            alt={listingItem.name} 
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <RiHotelFill className="text-gray-400 text-4xl" />
                          </div>
                        )}
                      </div>
                      
                      {/* Listing Details */}
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-gray-900 truncate">
                            {listingItem.name}
                          </h3>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-2">
                          <RiHotelFill className="mr-2 text-green-500" />
                          <span>{listingItem.boarding}</span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-sm text-gray-500">Price: </span>
                            <span className="font-bold text-green-500">LKR {listingItem.price?.toLocaleString()}/month</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Key Money: </span>
                            <span className={listingItem.keyMoney === 0 ? "text-blue-500" : "text-orange-500"}>
                              {listingItem.keyMoney === 0 ? 'None' : `LKR ${listingItem.keyMoney}`}
                            </span>
                          </div>
                        </div>
                        
                        {/* Amenities */}
                        {listingItem.amenities?.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-1">Amenities</h4>
                            <div className="flex flex-wrap gap-2">
                              {listingItem.amenities.slice(0, 2).map((amenity, aIdx) => (
                                <span 
                                  key={aIdx} 
                                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-lg"
                                >
                                  {amenity}
                                </span>
                              ))}
                              {listingItem.amenities.length > 2 && (
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-lg">
                                  +{listingItem.amenities.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <Link
                          to={`/listing/${listingItem._id}`}
                          className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                          <TbListDetails className="mr-2" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
  );
};

export default MoreListings;