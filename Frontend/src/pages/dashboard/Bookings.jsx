import React, { useEffect, useState } from 'react';
import { FaEdit, FaFilter, FaTrashAlt, FaCalendarAlt, FaUser, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaHome, FaExclamationCircle } from 'react-icons/fa';
import { FcViewDetails } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { TbSend2 } from 'react-icons/tb';
import { IoIosArrowBack } from 'react-icons/io';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const fetchBooking = async () => {
        try {
          const response = await axiosSecure.get(`/booking/user/${user.email}`);
          setBookings(response.data); 
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoading(false);
        }
    };
    fetchBooking();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Your <span className="text-green-500">Your Bookings</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            View all your booking and contact property owners.
          </p>
        </div>

        {/* Bookings Grid */}
        {bookings?.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
            {bookings.map((item, index) => (
              <div key={index} className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-200">
              {/* Booking Header */}
              <div className={`px-5 py-4 ${
                item.status === 'Approved' ? 'bg-green-200 border-l-4 border-green-500' :
                item.status === 'Rejected' ? 'bg-red-50 border-l-4 border-red-500' :
                'bg-yellow-50 border-l-4 border-yellow-500'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">Booking #{index + 1}</h3>
                    <p className="text-xs text-gray-700 mt-1 flex items-center">
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
            
                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Boarding House: <span className="text-xs font-medium text-gray-800 mt-1">{item.listing.boarding}</span></p>
                  </div>

                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Listing: <span className="text-xs font-medium text-gray-800 mt-1">{item.listing.name}</span></p>
                  </div>
                  
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Move-in Date: <span className="text-xs font-medium text-gray-800 mt-1">{item.movein}</span></p>
                  </div>
            
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method: <span className="text-xs font-medium text-gray-800 mt-1">{item.payvia}</span></p>
                  </div>
            
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status: <span className="text-xs font-medium text-gray-800 mt-1">{item.paystatus}</span></p>
                  </div>
            
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Special Needs: <span className="text-xs font-medium text-gray-800 mt-1">{item.needs.length>30?item.needs.slice(0, 33):item.needs}</span></p>
                  </div>
                </div>
            
                {/* Action Buttons */}
                <div className="flex w-full gap-2">
                <Link 
                    to={`/listing/${item.listing._id}`}
                    className="flex-1 inline-flex justify-center items-center text-sm font-medium rounded-lg bg-emerald-400 text-white hover:bg-emerald-500 transition duration-200 py-2"
                >
                    View Listing
                </Link>

                <button 
                    onClick={() => handleChat(user.email, item.listing.owner)}
                    className="flex-1 inline-flex justify-center items-center text-sm font-medium rounded-lg bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-100 transition duration-200 py-2"
                >
                    Contact Owner
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
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Bookings Found</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;