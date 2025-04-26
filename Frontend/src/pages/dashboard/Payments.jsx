import React from 'react';
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMoneyBillWave, FaHome, FaUser, FaCheckCircle, FaCreditCard } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Payments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [] } = useQuery({
    queryKey: ['payments', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/${user?.email}`);
      return res.data;
    },
  });

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

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Your <span className="text-green-500">Payment History</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            View all your completed transactions and booking details
          </p>
        </div>

        {/* Payment Cards */}
        {payments.length > 0 ? (
          <div className="space-y-6">
            {payments.map((payment, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                {/* Payment Header */}
                <div className="bg-green-400 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <FaCheckCircle className="text-green-700 text-lg mr-2" />
                      <span className="font-medium text-gray-800">
                        Payment #{index + 1} - {payment.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <FaCalendarAlt className="inline mr-1" />
                      {formatDate(payment.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Payment Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Transaction Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ID:</span>
                          <span className="font-medium">{payment.transactionId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium flex items-center">
                            <FaCreditCard className="mr-1" /> Card
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount Paid:</span>
                          <span className="font-bold text-green-600">
                            {formatCurrency(payment.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Booking Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booking ID:</span>
                          <span className="font-medium">
                            {payment.booking?._id || 'Booking Not Found'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Status:</span>
                          <span className={`font-medium ${
                            payment.booking?.paystatus === 'Done' 
                              ? 'text-green-500' 
                              : 'text-yellow-500'
                          }`}>
                            {payment.booking?.paystatus || 'Booking Not Found'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booking Status:</span>
                          <span className={`font-medium ${
                            payment.booking?.status === 'Approved' 
                              ? 'text-green-500' 
                              : 'text-yellow-500'
                          }`}>
                            {payment.booking?.status || 'Booking Not Found'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Listing Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Accommodation
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Boarding:</span>
                          <span className="font-medium">{payment.listing?.boarding}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Room Type:</span>
                          <span className="font-medium">{payment.listing?.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment For:</span>
                          <span className="font-medium">{payment.paid}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  
                  {/* {payment.listing?.amenities?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-700 mb-2">Amenities Included:</h4>
                      <div className="flex flex-wrap gap-2">
                        {payment.listing.amenities.map((amenity, idx) => (
                          <span 
                            key={idx} 
                            className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )} */}

                  {/* Action Button */}
                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={() => handleChat(user.email, payment.listing.owner)} 
                      className="flex items-center text-green-600 hover:text-green-700 font-medium"
                    >
                      Contact Owner <IoIosArrowForward className="ml-1" />
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white rounded-xl shadow-sm py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-medium text-gray-800 mb-3">No Payments Found</h3>
              <p className="text-gray-600 mb-6">
                You haven't made any payments yet. Your payment history will appear here.
              </p>
              <Link 
                to="/browse" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Browse Listings
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;