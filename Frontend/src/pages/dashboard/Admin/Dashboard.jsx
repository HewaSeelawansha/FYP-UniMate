import React from 'react';
import { FaUsers, FaHome, FaMoneyBillWave, FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import { FcViewDetails } from 'react-icons/fc';
import { IoIosArrowBack } from 'react-icons/io';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    }
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await axiosSecure.get('/booking');
      return res.data;
    }
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const res = await axiosSecure.get('/payments');
      return res.data;
    }
  });

  const { data: boardings = [] } = useQuery({
    queryKey: ['boardings'],
    queryFn: async () => {
      const res = await axiosSecure.get('/boarding');
      return res.data;
    }
  });

  const { data: listings = [] } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const res = await axiosSecure.get('/listing');
      return res.data;
    }
  });
  
  // Calculate statistics
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const pendingListings = listings.filter(l => l.status === 'Pending').length;
  const pendingBoardings = boardings.filter(b => b.status === 'Pending').length;
  const pendingFees = listings.filter(l => l.payStatus !== 'Done').length;
  
  const totalEarnings = payments.reduce((sum, payment) => sum + payment.price, 0);
  const rentalEarnings = payments.filter(p => p.paid === 'Rental').reduce((sum, p) => sum + p.price, 0);
  const keyMoneyEarnings = payments.filter(p => p.paid === 'Key Money').reduce((sum, p) => sum + p.price, 0);
  
  const studentCount = users.filter(u => u.role === 'user').length;
  const ownerCount = users.filter(u => u.role === 'owner').length;

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

  const totalFees = listings.reduce((sum, listing) => sum + getPriceByType(listing.type), 0);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard <span className='text-green-500'>Overview</span></h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Users Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                <div className="flex space-x-2 mt-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Students: {studentCount}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Owners: {ownerCount}</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaUsers className="text-green-600 text-xl" />
              </div>
            </div>
            <Link 
              to="/dashboard/users" 
              className="mt-4 inline-flex items-center text-sm text-green-600 hover:text-green-700"
            >
              View all users <IoIosArrowForward className="ml-1" />
            </Link>
          </div>

          {/* Listings Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Total Listings</p>
                <p className="text-2xl font-bold text-gray-800">{listings.length}</p>
                <div className="flex space-x-2 mt-2">
                  <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">Pending: {pendingListings}</span>
                </div>
              </div>
              <div className="bg-pink-100 p-3 rounded-full">
                <FaHome className="text-pink-600 text-xl" />
              </div>
            </div>
            <Link 
              to="/dashboard/manage-boarding" 
              className="mt-4 inline-flex items-center text-sm text-pink-600 hover:text-pink-700"
            >
              View all listings <IoIosArrowForward className="ml-1" />
            </Link>
          </div>

          {/* Bookings Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
                <div className="flex space-x-2 mt-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Pending: {pendingBookings}</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaCalendarAlt className="text-blue-600 text-xl" />
              </div>
            </div>
            <Link 
              to="/dashboard/bookings" 
              className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              View all bookings <IoIosArrowForward className="ml-1" />
            </Link>
          </div>

          {/* Boardings Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Total Boardings</p>
                <p className="text-2xl font-bold text-gray-800">{boardings.length}</p>
                <div className="flex space-x-2 mt-2">
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Pending: {pendingBoardings}</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaHome className="text-purple-600 text-xl" />
              </div>
            </div>
            <Link 
              to="/dashboard/manage-boarding" 
              className="mt-4 inline-flex items-center text-sm text-purple-600 hover:text-purple-700"
            >
              View all boardings <IoIosArrowForward className="ml-1" />
            </Link>
          </div>

          {/* Transaction - Booking Earning Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Booking Earnings</p>
                <p className="text-2xl font-bold text-gray-800">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'LKR'
                  }).format(totalEarnings)}
                </p>
                <div className="flex space-x-2 mt-2">
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Rental: {new Intl.NumberFormat('en-US', {style: 'currency', currency: 'LKR'}).format(rentalEarnings)}</span>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Key Money: {new Intl.NumberFormat('en-US', {style: 'currency', currency: 'LKR'}).format(keyMoneyEarnings)}</span>
                </div>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-amber-600 text-xl" />
              </div>
            </div>
            <Link 
              to="/dashboard/transactions" 
              className="mt-4 inline-flex items-center text-sm text-amber-600 hover:text-amber-700"
            >
              View all transactions <IoIosArrowForward className="ml-1" />
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-lime-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Listing Fee Earnings</p>
                <p className="text-2xl font-bold text-gray-800">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'LKR'
                  }).format(totalFees)}
                </p>
                <div className="flex space-x-2 mt-2">
                  <span className="text-xs bg-lime-100 text-lime-800 px-2 py-1 rounded">Pending: {pendingFees}</span>
                </div>
              </div>
              <div className="bg-lime-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-lime-600 text-xl" />
              </div>
            </div>
            <Link 
              to="/dashboard/listing-fees" 
              className="mt-4 inline-flex items-center text-sm text-lime-600 hover:text-lime-700"
            >
              View all listing fee earnings <IoIosArrowForward className="ml-1" />
            </Link>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            <Link 
              to="/dashboard/manage-boarding" 
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200 flex items-center"
            >
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaHome className="text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Review Boardings</h3>
                <p className="text-sm text-gray-500">{pendingBoardings} pending approval</p>
              </div>
            </Link>

            <Link 
              to="/dashboard/bookings" 
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200 flex items-center"
            >
              <div className="bg-pink-100 p-3 rounded-full mr-4">
                <FaCalendarAlt className="text-pink-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Review Bookings</h3>
                <p className="text-sm text-gray-500">{pendingBookings} pending approval</p>
              </div>
            </Link>

            <Link 
              to="/dashboard/transactions" 
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200 flex items-center"
            >
              <div className="bg-sky-100 p-3 rounded-full mr-4">
                <FcViewDetails className="text-xl text-sky-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Review Transactions</h3>
                <p className="text-sm text-gray-500">{pendingListings} pending approval</p>
              </div>
            </Link>

            <Link 
              to="/dashboard/users" 
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200 flex items-center"
            >
              <div className="bg-amber-100 p-3 rounded-full mr-4">
                <FaUsers className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Manage Users</h3>
                <p className="text-sm text-gray-500">{users.length} total users</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          
          <div className="space-y-4">
            {/* Recent Payments */}
            <div>
              <h3 className="font-medium bg-green-100 px-3 py-1 rounded-lg text-gray-700 mb-2 flex items-center">
                <FaMoneyBillWave className="text-green-500 mr-2" />
                Latest Payments
              </h3>
              {payments.slice(0, 3).map((payment, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">{payment.listing?.name || 'Unknown Listing'} in {payment.listing?.boarding}</p>
                    <p className="text-sm text-gray-500">{payment.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'LKR'
                      }).format(payment.price)}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {payments.length === 0 && (
                <p className="text-gray-500 text-sm py-2">No recent payments found</p>
              )}
              {payments.length > 0 && (
                <Link 
                  to="/dashboard/manage-transactions" 
                  className="mt-2 inline-flex items-center text-sm text-green-600 hover:text-green-700"
                >
                  View all payments <IoIosArrowForward className="ml-1" />
                </Link>
              )}
            </div>

            {/* Recent Bookings */}
            <div>
              <h3 className="font-medium bg-green-100 px-3 py-1 rounded-lg  text-gray-700 mb-2 flex items-center">
                <FaCalendarAlt className="text-green-500 mr-2" />
                Latest Bookings
              </h3>
              {bookings.slice(0, 3).map((booking, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">{booking.listing?.name || 'Unknown Listing'} in {booking.listing?.boarding}</p>
                    <p className="text-sm text-gray-500">{booking.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="text-gray-500 text-sm py-2">No recent bookings found</p>
              )}
              {bookings.length > 0 && (
                <Link 
                  to="/dashboard/view-bookings" 
                  className="mt-2 inline-flex items-center text-sm text-green-600 hover:text-green-700"
                >
                  View all bookings <IoIosArrowForward className="ml-1" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;