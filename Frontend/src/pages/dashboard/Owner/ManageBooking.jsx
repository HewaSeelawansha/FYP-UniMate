import React, { useEffect, useState } from 'react';
import { FaEdit, FaFilter, FaTrashAlt, FaCalendarAlt, FaUser, FaMoneyBillWave, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { FcViewDetails } from "react-icons/fc";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import useMyListing from '../../../hooks/useMyListing';

const ManageBooking = () => {
  const [mylist, listingLoading] = useMyListing();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const axiosSecure = useAxiosSecure();
  const [nstatus, setNstatus] = useState('Pending');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`http://localhost:3000/booking/owner/${user.email}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch bookings`);
      }
      const data = await response.json();
      setBookings(data.bookings); 
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
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manage <span className="text-orange-600">Bookings</span>
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all booking requests
            </p>
          </div>
          
          {/* Filter */}
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-orange-500" />
              </div>
              <select
                name="sort"
                id="sort"
                className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-10 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-orange-500 to-orange-600">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      <FaCalendarAlt className="inline mr-1" /> Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      <FaUser className="inline mr-1" /> Sender
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Move In
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Needs
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      <FaMoneyBillWave className="inline mr-1" /> Payment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.movein}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.needs}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span>Method: {item.payvia}</span>
                          <span>Status: {item.paystatus}</span>
                          <span>Amount: LKR {item.payment}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          item.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Link 
                            to={`/owner/view-listing/${item.listing._id}`}
                            className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-50 transition duration-200"
                            title="View Details"
                          >
                            <FcViewDetails className="w-5 h-5" />
                          </Link>
                          <div className="flex items-center">
                            <select
                              className="mr-2 rounded-lg border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
                              onChange={(e) => setNstatus(e.target.value)}
                              defaultValue={item.status}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                            <button 
                              onClick={() => handleStatus(item)}
                              className="text-white bg-orange-600 hover:bg-orange-700 p-2 rounded-full transition duration-200"
                              title="Update Status"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
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
                className="btn bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition duration-200"
              >
                View All Bookings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBooking;