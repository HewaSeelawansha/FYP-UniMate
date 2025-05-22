import React, { useState, useEffect, useMemo } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMoneyBillWave, FaHome, FaUser, FaCheckCircle, FaCreditCard, FaTimesCircle, FaChartLine, FaFilter, FaExclamationCircle } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { IoIosArrowBack } from 'react-icons/io';
import useMyListing from '../../../hooks/useMyListing';

const RecentPayments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure(); 
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPaymentType, setSelectedPaymentType] = useState('all');
  const [myListings, myListingsLoading] = useMyListing();

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['orders', user?.email],
    queryFn: async () => {
      if (!user?.email) return []; // Add this check
      const res = await axiosSecure.get(`/payments/owner/${user.email}`);
      return res.data;
    },
  });

  // Fix: Use useMemo for derived state
  const filteredPayments = useMemo(() => {
    let filtered = payments;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => 
        item.listing?._id === selectedCategory
      );
    }
    
    if (selectedPaymentType !== 'all') {
      filtered = filtered.filter((item) => 
        item.paid === selectedPaymentType
      );
    }
    
    return filtered;
  }, [payments, selectedCategory, selectedPaymentType]);

  const filterItems = (type) => {
    setSelectedCategory(type);
  };

  const filterPaymentType = (type) => {
    setSelectedPaymentType(type);
  };

  // Calculate earnings
  const calculateEarnings = (payments) => {
    const totalEarnings = payments.reduce((sum, payment) => sum + payment.price, 0);
    const rentalEarnings = payments
      .filter(payment => payment.paid === 'Rental')
      .reduce((sum, payment) => sum + payment.price, 0);
    const keyMoneyEarnings = payments
      .filter(payment => payment.paid === 'Key Money')
      .reduce((sum, payment) => sum + payment.price, 0);

    return {
      totalEarnings,
      rentalEarnings,
      keyMoneyEarnings
    };
  };

  const { totalEarnings, rentalEarnings, keyMoneyEarnings } = calculateEarnings(filteredPayments);

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

  const paidListingIds = payments.map(payment => payment.listing._id.toString());

  const filteredListings = myListings.filter(item => 
    paidListingIds.includes(item._id.toString())
  );

  if (myListingsLoading) {
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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
              Payments You <span className="text-green-500">Received</span>
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
              <option value="all">All Listings</option>
              {filteredListings.map((item, index) => (
                <option key={index} value={item._id}>#{index + 1} : {item.name}</option>
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
                  name="paymentType"
                  id="paymentType"
                  className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-10 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  onChange={(e) => filterPaymentType(e.target.value)}
                  value={selectedPaymentType}
                >
                  <option value="all">All Payments</option>
                  <option value="Rental">Rental Only</option>
                  <option value="Key Money">Key Money Only</option>
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
                Total Payments: You had received total {payments.length} payments recently.
              </p>
              <p className="text-sm text-emerald-600">
                View your recently received payments for your listings below
              </p>
            </div>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalEarnings)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Rental Earnings</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(rentalEarnings)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaHome className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Key Money Earnings</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(keyMoneyEarnings)}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaCreditCard className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Cards */}
        {filteredPayments.length > 0 ? (
          <div className="space-y-6">
            {filteredPayments.map((payment, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                {/* Payment Header */}
                <div className="bg-green-200 px-6 py-4 border-l-4 border-green-500">
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
                            {payment.booking?.movein || 'Booking Not Found'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">
                            {payment?.email}
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
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FaTimesCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Payments Found</h2>
            <p className="text-gray-600 mb-4">
              {selectedCategory === "all" && selectedPaymentType === "all"
                ? "You haven't received any payments yet. Your payment history will appear here." 
                : "No payments found matching your filters."}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPaymentType('all');
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

export default RecentPayments;