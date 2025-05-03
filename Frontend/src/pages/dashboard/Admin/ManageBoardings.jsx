import React, { useState } from 'react'
import useBoarding from '../../../hooks/useBoarding'
import useListings from '../../../hooks/useListings'
import { FaEdit, FaTrashAlt, FaPhone, FaUser, FaVenusMars, FaChevronDown, FaChevronUp, FaHome, FaExclamationCircle } from 'react-icons/fa'
import { FcViewDetails } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const ManageBoardings = () => {
  const [boarding, boardingLoading, refetchBoarding] = useBoarding();
  const [listings, listingsLoading, refetchListings] = useListings();
  const axiosSecure = useAxiosSecure();
  const [expandedBoarding, setExpandedBoarding] = useState(null);
  const navigate = useNavigate();

  const toggleListings = (boardingId) => {
    if (expandedBoarding === boardingId) {
      setExpandedBoarding(null);
    } else {
      setExpandedBoarding(boardingId);
    }
  };

  const handleBoardingStatus = async (boardingId, status) => {
    const data = {
      status: status,
    };

    try {
      const response = await axiosSecure.patch(`/boarding/status//${boardingId}`, data);

      if (response.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Status Updated Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        refetchBoarding();
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'An error occurred while updating the status.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleListingStatus = async (listingId, status) => {
    const data = {
      status: status,
    };
    
    try {
      const response = await axiosSecure.patch(`/listing/status/${listingId}`, data);
      if (response.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Listing Status Updated Successfully',
          showConfirmButton: false,
          timer: 1500,
          background: '#ffffff',
          customClass: {
            title: 'text-xl font-bold text-gray-800'
          }
        });
        refetchListings();
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating the listing status.',
        showConfirmButton: true,
        background: '#ffffff'
      });
    }
  };

  const handleChat = async (sender, receiver) => {
    const chatData = {
      senderId: sender,
      receiverId: receiver,
    };
  
    try {
      const existingChat = await axiosSecure.get(`/chat/find/${receiver}/${sender}`);
      if (existingChat.data !== null) {
        navigate(`/chats?chatId=${existingChat.data._id}`);
        return;
      }
  
      const response = await axiosSecure.post(`/chat`, chatData);
  
      if (response.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Chat Created Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(`/chats?chatId=${response.data._id}`);
      }
    } catch (error) {
      console.error('Error creating or fetching chat:', error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while processing the chat request.',
        showConfirmButton: true,
      });
    }
  };

  if (boardingLoading || listingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (boarding.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          No Boarding Houses Found
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          You haven't uploaded any boarding houses yet.
        </p>
      </div>
    );
  }
  
  return (
    <div className='w-full px-4 mx-auto py-8'>
      {/* Header */}
      <div className="flex xl:flex-row flex-col items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="xl:mb-0 my-2 flex items-center text-green-600 hover:text-green-700 transition duration-200"
        >
          <IoIosArrowBack className="mr-2" /> Back
        </button>
        <h1 className="mx-2 text-3xl font-bold text-gray-800">
        Manage Uploaded <span className='text-green-500'>Boarding Houses</span>
        </h1>
        <div className="w-8"></div> 
      </div>

      {/* Add a summary banner at the top */}
      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6 rounded-r-lg">
        <div className="flex items-center">
          <FaExclamationCircle className="text-emerald-500 mr-3 text-xl" />
          <div>
            <p className="font-semibold text-emerald-800">
              Pending Approvals: {boarding.filter(l => l.status === 'Pending').length} boardings & {listings.filter(l => l.status === 'Pending').length} listings need your attention
            </p>
            <p className="text-sm text-emerald-600">
              Review and update the status of pending listings below
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
        {boarding.map((item, index) => {
          const boardingListings = listings.filter(listing => listing.owner === item.owner);
          const pendingListingsCount = boardingListings.filter(l => l.status === 'Pending').length;
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border-l-4 border-emerald-500">
              {/* Card Header */}
              <div className="bg-emerald-50 p-4 text-gray-600">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center bg-gray-300 bg-opacity-20 px-2 py-1 rounded">
                      <FaHome className="mr-1" />
                      {boardingListings.length} listings
                      {/* Add pending count badge if there are pending listings */}
                      {pendingListingsCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {pendingListingsCount} pending
                        </span>
                      )}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'Approved' ? 'bg-green-200 text-green-800' :
                      item.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="md:w-1/10">
                    <div className="rounded-lg overflow-hidden h-[140px] w-[200px]">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <FaPhone className="text-green-500 mr-2" />
                        <span className="font-medium">Phone:</span>
                        <span className="ml-2">{item.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <FaVenusMars className="text-green-500 mr-2" />
                        <span className="font-medium">Gender:</span>
                        <span className="ml-2 capitalize">{item.gender}</span>
                      </div>
                      <div className="flex items-center">
                        <FaUser className="text-green-500 mr-2" />
                        <span className="font-medium">Owner:</span>
                        <span className="ml-2">{item.owner}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between lg:flex-row flex-col items-center pt-4 border-t">

                      <button 
                        onClick={() => toggleListings(item._id)}
                        className={`${expandedBoarding === item._id && 'bg-emerald-50'} mb-2 lg:mb-0 flex items-center px-3 py-[7px] border border-green-500 rounded-lg font-semibold text-green-500 hover:bg-emerald-50 transition duration-200`}
                      >
                        {expandedBoarding === item._id ? (
                          <>
                            <FaChevronUp className="mr-2" />
                            <span>Hide Listings</span>
                          </>
                        ) : (
                          <>
                            <FaChevronDown className="mr-2" />
                            <span>Show Listings</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center space-x-4">

                        <Link 
                          to={`/dashboard/view-boarding/${item.owner}`}
                          className="flex items-center px-3 py-[8px] bg-emerald-400 rounded-lg font-semibold text-white hover:bg-emerald-500 transition duration-200"
                        >
                          <span>View</span>
                        </Link>

                        <button 
                          onClick={() => handleChat(user.email, item.owner)} 
                          className="flex items-center px-3 py-[8px] bg-emerald-400 rounded-lg font-semibold text-white hover:bg-emerald-500 transition duration-200"
                        >
                          Contact
                        </button>

                        <div className="flex items-center space-x-2">
                          <select
                            className="rounded-lg border-green-500 text-green-500 text-sm focus:ring-0 focus:border-green-500"
                            onChange={(e) => handleBoardingStatus(item._id, e.target.value)}
                            defaultValue={item.status}
                          >
                            <option value='Pending'>Pending</option>
                            <option value='Approved'>Approved</option>
                            <option value='Rejected'>Rejected</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Listings Section */}
                {expandedBoarding === item._id && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="font-bold text-lg mb-4 flex items-center">
                      Listings from this boarding
                      {pendingListingsCount > 0 && (
                        <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded-full">
                          {pendingListingsCount} need approval
                        </span>
                      )}
                    </h4>
                    
                    {boardingListings.length > 0 ? (
                      <div className="space-y-4">
                        {boardingListings.map((listing, idx) => (
                          <div 
                            key={idx} 
                            className={`p-4 rounded-lg ${listing.status === 'Pending' &&
                              'bg-red-50 border-l-4 border-red-500'} border-l-4 border-emerald-500 bg-emerald-50 max-h-96 overflow-hidden`}
                          >
                            {/* Top Row - Name, Status, and Pay Status */}
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center">
                                <h5 className="font-medium">
                                  {listing.name}
                                </h5>
                                {listing.status === 'Pending' && (
                                  <span className="ml-2 flex items-center text-red-600 text-xs">
                                    <FaExclamationCircle className="mr-1" />
                                    Needs Approval
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  listing.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                  listing.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {listing.status}
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {listing.payStatus || 'N/A'}
                                </span>
                              </div>
                            </div>

                            {/* Second Row - Image and Details */}
                            <div className="flex flex-col md:flex-row gap-4 mb-3">
                              {/* Left Side - Image */}
                              <div className="h-[110px] w-[200px]">
                                {listing.images?.length > 0 && (
                                  <img 
                                    src={listing.images[0]} 
                                    alt={listing.name} 
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                )}
                              </div>

                              {/* Right Side - Details */}
                              <div className="md:w-3/4">
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <div className="flex items-center">
                                    <span className="font-medium mr-1">Available:</span>
                                    <span>{listing.available || '0'} beds</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium mr-1">Price:</span>
                                    <span>Rs. {listing.price?.toLocaleString() || '0'}/mo</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium mr-1">Key Money:</span>
                                    <span>{listing.keyMoney === 0 ? 'No need' : `Rs. ${listing.keyMoney}`}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium mr-1">Type:</span>
                                    <span>{listing.type || 'N/A'}</span>
                                  </div>
                                </div>

                                {/* Amenities */}
                                {listing.amenities?.length > 0 && (
                                  <div className="mt-2">
                                    <div className="font-medium text-sm mb-1">Amenities:</div>
                                    <div className="flex flex-wrap gap-1">
                                      {listing.amenities.map((amenity, aIdx) => (
                                        <span 
                                          key={aIdx} 
                                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                                        >
                                          {amenity}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Third Row - Actions */}
                            <div className="flex justify-between items-center border-t pt-3">
                              <Link 
                                to={`/dashboard/view-listing/${listing._id}`}
                                className="flex items-center px-3 py-[5px] bg-emerald-400 rounded-lg font-semibold text-white hover:bg-emerald-500 transition duration-200"
                              >
                                <span>View Details</span>
                              </Link>
                              
                              <div className="flex items-center space-x-2">
                                <select
                                  className="rounded-lg border-green-500 text-green-500 text-sm focus:ring-0 focus:border-green-500 px-3 py-[5px]"
                                  defaultValue={listing.status}
                                  onChange={(e) => handleListingStatus(listing._id, e.target.value)}
                                >
                                  <option value='Pending'>Pending</option>
                                  <option value='Approved'>Approved</option>
                                  <option value='Rejected'>Rejected</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No listings found for this boarding house.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default ManageBoardings