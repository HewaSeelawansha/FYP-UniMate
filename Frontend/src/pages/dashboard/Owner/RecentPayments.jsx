import React from 'react';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMoneyBillWave, FaHome, FaUser, FaCheckCircle, FaCreditCard } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { IoIosArrowBack } from 'react-icons/io';

const RecentPayments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [] } = useQuery({
    queryKey: ['orders', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/owner/${user?.email}`);
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

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex xl:flex-row flex-col justify-between items-center mb-8">
          <button
            onClick={handleGoBack}
            className="xl:mb-0 my-2 flex items-center text-green-600 hover:text-green-700 transition duration-200"
          >
            <IoIosArrowBack className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Payments You <span className='text-green-500'>Received</span>
          </h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {/* Payment Cards */}
        {payments.length > 0 ? (
          <div className="space-y-6">
            {payments.map((payment, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                {/* Payment Header */}
                <div className="bg-green-200 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center mb-2 lg:mb-0">
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
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
                          <span className="text-gray-600">For:</span>
                          <span className="font-medium">{payment.paid}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-bold text-green-600">
                            {formatCurrency(payment.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Student Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Booking Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Move-in Date:</span>
                          <span className="font-medium">
                            {payment.booking?.movein || 'Not specified'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">
                            {payment?.email || 'Not specified'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booking Status:</span>
                          <span className={`font-medium ${
                            payment.booking?.status === 'Approved' 
                              ? 'text-green-500' 
                              : 'text-yellow-500'
                          }`}>
                            {payment.booking?.status}
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
                          <span className="text-gray-600">Listing:</span>
                          <span className="font-medium">{payment.listing?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Room Type:</span>
                          <span className="font-medium">{payment.listing?.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Available beds:</span>
                          <span className="font-medium">{payment.listing?.available}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={() => handleChat(user.email, payment.listing.owner)} 
                      className="flex items-center text-green-600 hover:text-green-700 font-medium"
                    >
                      Contact Student <IoIosArrowForward className="ml-1" />
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
                You haven't received any payments yet. Your payment history will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentPayments;