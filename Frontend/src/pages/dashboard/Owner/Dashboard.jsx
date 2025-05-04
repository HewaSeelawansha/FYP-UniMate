import React, { useState, useEffect } from 'react';
import { FaHome, FaMoneyBillWave, FaUsers, FaStar, FaRegCalendarAlt, FaChartLine, FaEdit, FaShoppingBag } from 'react-icons/fa';
import { MdOutlinePendingActions, MdPayments } from 'react-icons/md';
import { GiPayMoney } from 'react-icons/gi';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import useMyListing from '../../../hooks/useMyListing';
import { useQuery } from '@tanstack/react-query';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentPayments, setRecentPayments] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [listings, loadingListing] = useMyListing();-

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      try {
        const [bookingRes, paymentRes] = await Promise.all([
          axiosSecure.get(`/booking/owner/${user?.email}`),
          axiosSecure.get(`/payments/owner/${user?.email}`)
        ]);
  
        const bookings = bookingRes.data.bookings;
        const payments = paymentRes.data;
  
        const totalEarnings = payments.reduce((sum, p) => sum + (p.price || 0), 0);
        const pendingPayments = listings.filter(b => b.payStatus !== 'Done').length;
        const approvedListings = listings.filter(l => l.status === 'Approved').length;
        const pendingListings = listings.filter(l => l.status === 'Pending').length;
  
        const sortedPayments = [...payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        const sortedListings = [...listings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  
        setStats({
          totalEarnings,
          pendingPayments,
          approvedListings,
          pendingListings,
          totalListings: listings.length,
          totalBookings: bookings.length
        });
  
        setRecentPayments(sortedPayments);
        setRecentListings(sortedListings);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Dashboard load failed',
          showConfirmButton: false,
          timer: 1500
        });
      } finally {
        setLoading(false);
      }
    };
  
    if (user?.email && listings.length) fetchAllDashboardData();
  }, [user?.email, listings]);
  

  if (loading || loadingListing) {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard <span className='text-green-500'>Overview</span></h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Total Earnings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-800">Rs. {stats.totalEarnings?.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaMoneyBillWave size={24} />
              </div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaUsers size={24} />
              </div>
            </div>
          </div>

          {/* Pending Payments */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Listings to Pay</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pendingPayments}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <MdPayments size={24} />
              </div>
            </div>
          </div>

          {/* Approved Listings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved Listings</p>
                <p className="text-2xl font-bold text-gray-800">{stats.approvedListings}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaHome size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Payments</h2>
              <Link to="/owner/recent-payments" className="text-green-600 hover:text-green-700 text-sm font-medium">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentPayments.length > 0 ? (
                recentPayments.map((pay) => (
                  <div key={pay._id} className="bg-gray-50 flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition">
                    <div>
                      <p className="font-medium text-gray-800">{pay.email}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaRegCalendarAlt size={12} />
                        {new Date(pay.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${pay.paid === 'Rental' ? 'text-green-600' : 'text-yellow-600'}`}>
                        Rs. {pay.price?.toLocaleString()}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs ${pay.paid === 'Rental' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {pay.paid}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent bookings found</p>
              )}
            </div>
          </div>

          {/* Recent Listings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Your Listings</h2>
              <Link to="/owner/manage-items" className="text-green-600 hover:text-green-700 text-sm font-medium">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentListings.length > 0 ? (
                recentListings.map((listing) => (
                  <div key={listing._id} className="bg-gray-50 p-4 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition">
                    <div className="flex items-start space-x-3">
                      {listing.images?.length > 0 ? (
                        <img 
                          src={listing.images[0]} 
                          alt={listing.name} 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <FaHome className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{listing.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            listing.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            listing.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {listing.status}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <FaStar className="text-yellow-400 mr-1" />
                            {listing.rating || 'No reviews'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No listings found</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Link 
              to="/owner/add-listing" 
              className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition flex items-center gap-3"
            >
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <FaHome size={20} />
              </div>
              <span className="font-medium text-gray-700">Add New Listing</span>
            </Link>
            
            <Link 
              to="/owner/manage-items" 
              className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition flex items-center gap-3"
            >
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <FaEdit size={20} />
              </div>
              <span className="font-medium text-gray-700">Manage Listings</span>
            </Link>
            
            <Link 
              to="/owner/manage-booking" 
              className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition flex items-center gap-3"
            >
              <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                <FaShoppingBag size={20} />
              </div>
              <span className="font-medium text-gray-700">Manage Bookings</span>
            </Link>
            
            <Link 
              to="/owner/recent-payments" 
              className="p-4 border border-orange-200 rounded-lg hover:bg-orange-50 transition flex items-center gap-3"
            >
              <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                <FaChartLine size={20} />
              </div>
              <span className="font-medium text-gray-700">Received Payments</span>
            </Link>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Listing Fees Summary</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentListings.map((listing) => (
                  <tr key={listing._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {listing.images?.length > 0 ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={listing.images[0]} alt={listing.name} />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <FaHome className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{listing.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{listing.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        listing.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {listing.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Rs. {getPriceByType(listing.type)?.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        listing.payStatus === 'Done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {listing.payStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get listing price by type (from your example)
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

export default OwnerDashboard;