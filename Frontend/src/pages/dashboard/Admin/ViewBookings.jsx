import React, { useEffect, useState } from 'react';
import { FaEdit, FaFilter, FaTrashAlt, FaCalendarAlt, FaUser, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaHome, FaExclamationCircle } from 'react-icons/fa';
import { FcViewDetails } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import useMyListing from '../../../hooks/useMyListing';
import { TbSend2 } from 'react-icons/tb';
import { IoIosArrowBack } from 'react-icons/io';
import useBoarding from '../../../hooks/useBoarding';

const ViewBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const axiosSecure = useAxiosSecure();
  const [nstatus, setNstatus] = useState('Pending');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  const navigate = useNavigate();
  const [boarding, boardingLoading, refetchBoarding] = useBoarding();

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
      const response = await axiosSecure.get(`/booking`);
      setBookings(response.data); 
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

  const filterItems = (type) => {
    if (type === "all") {
      setFilteredItems(bookings);
    } else {
      const filtered = bookings.filter((item) => item.listing.boarding === type);
      setFilteredItems(filtered);
    }
    setSelectedCategory(type);
  };

  // const uniqueList = Array.from(
  //   new Map(mylist.map(item => [item.name, item])).values()
  // );

  if (loading || boardingLoading) {
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
        <div className="flex flex-col lg:flex-row justify-between items-start md:items-center mb-8">
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
          
          {/* Filters */}
          <div className="flex items-center space-x-2 mx-6 mt-4 md:mt-0">
            <div className="mt-4 relative">
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
                <option value="all">All Boardings</option>
                {boarding.map((item, index) => (
                  <option key={index} value={item.name}>#{index+1} : {item.name}</option>
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
                Pending Approvals: {bookings.filter(b => b.status === 'Pending').length} bookings need that belonged owner's attention
              </p>
              <p className="text-sm text-emerald-600">
                Review and update the status of pending bookings below
              </p>
            </div>
          </div>
        </div>

        {/* Bookings Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredItems.map((item, index) => (
              <div key={index} className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-200">
              {/* Booking Header */}
              <div className={`px-5 py-4 ${
                item.status === 'Approved' ? 'bg-green-50 border-l-4 border-green-500' :
                item.status === 'Rejected' ? 'bg-red-50 border-l-4 border-red-500' :
                'bg-yellow-50 border-l-4 border-yellow-500'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">Booking #{index + 1}</h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      {new Date(item.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    item.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            
              {/* Booking Content */}
              <div className="p-5">
                {/* Property Info */}
                <div className="flex items-start mb-4">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <FaHome className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{item.listing?.name || 'Property'}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Requested by <span className="text-blue-600">{item.email}</span>
                    </p>
                  </div>
                </div>
            
                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-4 mb-4">
                  {/* Move-in Date */}
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Move-in Date</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">{item.movein}</p>
                  </div>
            
                  {/* Special Needs */}
                  {item.needs && (
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Special Needs</p>
                      <p className="text-sm font-medium text-gray-800 mt-1">{item.needs}</p>
                    </div>
                  )}
            
                  {/* Payment Method */}
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">{item.payvia}</p>
                  </div>
            
                  {/* Payment Status */}
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">{item.paystatus}</p>
                  </div>
                </div>
            
                {/* Payment Amount */}
                {/* <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">Total Amount</p>
                    <p className="text-lg font-bold text-green-600">LKR {item.payment}</p>
                  </div>
                </div> */}
            
                {/* Action Buttons */}
                <div className="flex flex-col w-full sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
  <div className="flex w-full space-x-3">
    <Link 
      to={`/owner/view-listing/${item.listing._id}`}
      className="w-1/2 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition duration-200"
    >
      <FcViewDetails className="mr-2" />
      View Listing
    </Link>

    <button 
      onClick={() => handleChat(user.email, item.email)}
      className="w-1/2 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition duration-200"
    >
      <TbSend2 className="mr-2" />
      Message
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
            {selectedCategory !== "all"?
            <button
              onClick={() => filterItems("all")}
              className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              View All Bookings
            </button>:<></>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBookings;