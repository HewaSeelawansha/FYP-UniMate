import React, { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMoneyBillWave, FaHome, FaCheckCircle, FaTimesCircle, FaFilter, FaExclamationCircle } from 'react-icons/fa';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useBoarding from '../../../hooks/useBoarding';
import useListings from '../../../hooks/useListings';

const ListingFees = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [selectedBoarding, setSelectedBoarding] = useState('all');
  const [selectedListingType, setSelectedListingType] = useState('all');
  const [filteredListings, setFilteredListings] = useState([]);
  const [boarding, boardingLoading, refetchBoarding] = useBoarding();
  const [listings, listingsLoading, refetchListings] = useListings();

  useEffect(() => {
    // First filter by boarding if selected
    let filtered = listings;
    if (selectedBoarding !== 'all') {
      filtered = listings.filter((item) => item.boarding === selectedBoarding);
    }
    
    // Then filter by listing type if selected
    if (selectedListingType !== 'all') {
      filtered = filtered.filter((item) => item.type === selectedListingType);
    }

    // Only show listings that have been paid
    filtered = filtered.filter((item) => item.payStatus === 'Done');
    
    setFilteredListings(filtered);
  }, [listings, selectedBoarding, selectedListingType]);

  const filterByBoarding = (boardingName) => {
    setSelectedBoarding(boardingName);
  };

  const filterByListingType = (type) => {
    setSelectedListingType(type);
  };

  // Calculate fees
  const calculateFees = (listings) => {
    const totalFees = listings.reduce((sum, listing) => sum + getPriceByType(listing.type), 0);
    
    return {
      totalFees,
      totalListings: listings.length
    };
  };

  const getPriceByType = (type) => {
    switch(type) {
      case '1-Person Boarding Room':
      case '2-Person Shared Room':
        return 500;
      case '2 to 4-Person Shared Room':
        return 1000;
      case 'Whole House-Short Term':
      case 'Whole House-Long Term':
        return 2000;
      default:
        return 0;
    }
  };

  const { totalFees, totalListings } = calculateFees(filteredListings);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const listingTypes = [
    '1-Person Boarding Room',
    '2-Person Shared Room',
    '2 to 4-Person Shared Room',
    'Whole House-Short Term',
    'Whole House-Long Term'
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start md:items-center mb-8">
          <div className=''>
            <button
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center text-green-600 hover:text-green-700 transition duration-200"
            >
              <IoIosArrowBack className="mr-2" /> Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              Listing Fees Collected from<span className="text-green-500"> Boarding Owners</span>
            </h1>
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-2 mx-6 mt-4 md:mt-0">
            <div className="mt-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-green-500" />
              </div>
              <select
                name="boardingFilter"
                id="boardingFilter"
                className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-10 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                onChange={(e) => filterByBoarding(e.target.value)}
                value={selectedBoarding}
              >
                <option value="all">All Boardings</option>
                {boarding.map((item, index) => (
                  <option key={index} value={item.name}>#{index+1} : {item.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className='flex items-center space-x-2 mx-6 mt-4 md:mt-0'>
            <div className="mt-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-green-500" />
              </div>
              <select
                name="listingType"
                id="listingType"
                className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-10 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                onChange={(e) => filterByListingType(e.target.value)}
                value={selectedListingType}
              >
                <option value="all">All Listing Types</option>
                {listingTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add a summary banner at the top */}
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <FaExclamationCircle className="text-emerald-500 mr-3 text-xl" />
            <div>
              <p className="font-semibold text-emerald-800">
                Total Fees Collected: Received fees for {totalListings} listings.
              </p>
              <p className="text-sm text-emerald-600">
                View listing fees collected from boarding owners below
              </p>
            </div>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Total Fees Collected</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalFees)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Total Listings</p>
                <p className="text-2xl font-bold text-gray-800">{totalListings}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaHome className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Listing Fee Cards */}
        {filteredListings.length > 0 ? (
          <div className="space-y-6">
            {filteredListings.map((listing, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                {/* Listing Header */}
                <div className="bg-emerald-50 border-l-4 border-green-500 px-6 py-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center mb-2 lg:mb-0">
                      <FaCheckCircle className="text-green-700 text-lg mr-2" />
                      <span className="font-medium text-gray-800">
                        Listing #{index + 1} - Fee Paid
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <FaCalendarAlt className="inline mr-1" />
                      {formatDate(listing.updatedAt)}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Fee Details */}
                    <div className="pb-2 border-b space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Fee Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Listing Type:</span>
                          <span className="font-medium">{listing.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fee Type:</span>
                          <span className="font-medium">Listing Fee</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-bold text-green-600">
                            {formatCurrency(getPriceByType(listing.type))}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Listing Details */}
                    <div className="pb-2 border-b space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Listing Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{listing.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gender:</span>
                          <span className="font-medium">{listing.gender}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Available Beds:</span>
                          <span className="font-medium">{listing.available}</span>
                        </div>
                      </div>
                    </div>

                    {/* Boarding Details */}
                    <div className="pb-2 border-b space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Boarding Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Boarding:</span>
                          <span className="font-medium">{listing.boarding}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Owner:</span>
                          <span className="font-medium">{listing.owner}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium text-green-500">
                            {listing.payStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={() => navigate(`/dashboard/boarding-details/${listing.boardingID}`)}
                      className="flex items-center text-green-600 hover:text-green-700 font-medium"
                    >
                      View Boarding Details <IoIosArrowForward className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FaTimesCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Paid Listings Found</h2>
            <p className="text-gray-600 mb-4">
              {selectedBoarding === "all" && selectedListingType === "all"
                ? "No listing fees have been collected yet. Paid listings will appear here." 
                : "No paid listings found matching your filters."}
            </p>
            <button
              onClick={() => {
                setSelectedBoarding('all');
                setSelectedListingType('all');
              }}
              className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingFees;