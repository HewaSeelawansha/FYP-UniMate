import React, { useEffect, useState } from 'react';
import { FaEdit, FaFilter, FaTrashAlt, FaCalendarAlt, FaUser, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaHome } from 'react-icons/fa';
import { FcViewDetails } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import useMyListing from '../../../hooks/useMyListing';
import { TbSend2 } from 'react-icons/tb';
import { IoIosArrowBack } from 'react-icons/io';

const ManageBooking = () => {
  const [mylist, listingLoading] = useMyListing();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const axiosSecure = useAxiosSecure();
  const [nstatus, setNstatus] = useState('Pending');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  const navigate = useNavigate();

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

  const fetchBooking = async () => {
    try {
      const response = await axiosSecure.get(`/booking/owner/${user.email}`);
      setBookings(response.data.bookings); 
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  useEffect(() => {
    setFilteredItems(bookings);
  }, [bookings]);

  const refetchReview = () => {
    setLoading(true);
    fetchBooking();
  }

  const handleStatus = async (item) => {
    const data = {
      status: nstatus || item.status,
    };
    try {
      const response = await axiosSecure.patch(`/booking/status/${item._id}`, data);
      if (response.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Status Updated Successfully',
          showConfirmButton: false,
          timer: 1500,
          background: '#ffffff',
          customClass: {
            title: 'text-xl font-bold text-gray-800'
          }
        });
        refetchReview();
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating the status.',
        showConfirmButton: true,
        background: '#ffffff'
      });
    }
  };

  const filterItems = (type) => {
    if (type === "all") {
      setFilteredItems(bookings);
    } else {
      const filtered = bookings.filter((item) => item.listing._id === type);
      setFilteredItems(filtered);
    }
    setSelectedCategory(type);
  };

  if (loading || listingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6 lg:px-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className=''>
            <button
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center text-green-600 hover:text-green-700 transition duration-200"
            >
              <IoIosArrowBack className="mr-2" /> Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              Manage <span className="text-green-500">Bookings</span>
            </h1>
          </div>
          
          {/* Filter */}
          <div className="flex items-center space-x-2 mx-6 mt-4 md:mt-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-green-500" />
              </div>
              <select
                name="sort"
                id="sort"
                className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-10 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                onChange={(e) => filterItems(e.target.value)}
                value={selectedCategory}
              >
                <option value="all">All Listings</option>
                {mylist.map((item) => (
                  <option key={item._id} value={item._id}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Grid */}
        {filteredItems.length > 0 ? (
          <div className="w-full gap-6">
            {filteredItems.map((item, index) => (
              <div key={index} className="mb-4 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-100">
                {/* Booking Header */}
                <div className="bg-green-200 p-4 text-black">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Booking #{index + 1}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      item.status === 'Approved' ? 'bg-green-300 text-green-800' :
                      item.status === 'Rejected' ? 'bg-red-300 text-red-800' :
                      'bg-yellow-300 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm mt-1 flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Booking Details */}
                <div className="p-5">
                  {/* Property Info */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <FaHome className="text-green-500 mr-2" />
                      {item.listing?.name || 'Property'}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Requested by: {item.email}
                    </p>
                  </div>

                  {/* Move-in Date */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800">Move-in Date</h4>
                    <p className="text-sm text-gray-600">{item.movein}</p>
                  </div>

                  {/* Special Needs */}
                  {item.needs && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800">Special Needs</h4>
                      <p className="text-sm text-gray-600">{item.needs}</p>
                    </div>
                  )}

                  {/* Payment Info */}
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <FaMoneyBillWave className="text-green-500 mr-2" />
                      Payment Details
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <span className="text-gray-500">Method:</span>
                        <span className="ml-2 font-medium">{item.payvia}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className="ml-2 font-medium">{item.paystatus}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Amount:</span>
                        <span className="ml-2 font-medium text-green-600">LKR {item.payment}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex font-semibold justify-between items-center pt-4 border-t">
                    <Link 
                      to={`/owner/view-listing/${item.listing._id}`}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200 text-md"
                      title="View Details"
                    >
                      <FcViewDetails className="w-4 h-4 mr-1" />
                      Related Listing Details
                    </Link>

                    <button 
                        onClick={() => handleChat(user.email, item.email)}
                        className="text-orange-500 hover:text-orange-600 px-3 py-2 rounded-lg transition duration-200 text-md flex items-center"
                        title="Update Status"
                      >
                        <TbSend2 className="mr-2" />
                        Chat
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <select
                        className="text-sm rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                        onChange={(e) => setNstatus(e.target.value)}
                        defaultValue={item.status}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <button 
                        onClick={() => handleStatus(item)}
                        className="text-white bg-green-500 hover:bg-green-600 px-3 py-2 rounded-lg transition duration-200 text-sm flex items-center"
                        title="Update Status"
                      >
                        <FaEdit className="w-3 h-3 mr-1" />
                        Update
                      </button>
                    </div>
                    
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
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Bookings Found</h2>
            <p className="text-gray-600 mb-4">
              {selectedCategory === "all" 
                ? "You don't have any bookings yet." 
                : "No bookings found for this listing."}
            </p>
            <button
              onClick={() => filterItems("all")}
              className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              View All Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooking;