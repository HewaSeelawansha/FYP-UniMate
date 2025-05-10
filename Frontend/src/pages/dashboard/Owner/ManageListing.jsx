import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaPlusCircle, FaBed, FaBath, FaRulerCombined, FaFilter, FaHome, FaUser, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';
import { FcViewDetails } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useMyListing from '../../../hooks/useMyListing';
import { RiWechatPayLine } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";
import { IoIosArrowBack } from 'react-icons/io';

const ManageListing = () => {
  const [mylist, loading, refetch] = useMyListing();
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Calculate listing counts by type
  const calculateTypeCounts = () => {
    const counts = {
      'all': mylist.length,
      '1-Person Boarding Room': 0,
      '2-Person Shared Room': 0,
      '2 to 4-Person Shared Room': 0,
      'Whole House-Short Term': 0,
      'Whole House-Long Term': 0
    };

    mylist.forEach(item => {
      if (item.type in counts) {
        counts[item.type]++;
      }
    });

    return counts;
  };

  const typeCounts = calculateTypeCounts();

  useEffect(() => {
    setFilteredItems(mylist);
  }, [mylist]);

  const filterItems = (type) => {
    if (type === "all") {
      setFilteredItems(mylist);
    } else {
      const filtered = mylist.filter((item) => item.type === type);
      setFilteredItems(filtered);
    }
    setSelectedCategory(type);
  };

  const handleDelete = (item) => {
    Swal.fire({
      title: "Delete Listing?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      background: '#ffffff',
      customClass: {
        title: 'text-xl font-bold text-gray-800',
        confirmButton: 'px-4 py-2 rounded-lg',
        cancelButton: 'px-4 py-2 rounded-lg'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/listing/${item._id}`);
        if(res) {
          refetch();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Listing Deleted",
            showConfirmButton: false,
            timer: 1500,
            background: '#ffffff'
          });
        }
      }
    });
  };

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

  const makePayment = (id, feeType) => {
    const ListingFee = getPriceByType(feeType);
    navigate("/listing-fee", { state: { Listing: id, Fee: ListingFee} });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (mylist.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          No Listings Found
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          You haven't created any listings yet. Get started by adding your first listing!
        </p>
        <Link 
          to="/owner/add-listing"
          className="btn bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center gap-2"
        >
          <FaPlusCircle /> Add New Listing
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
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
              Manage <span className="text-green-500">Listings</span>
            </h1>
          </div>
          
          {/* Filter */}
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
                <option value="1-Person Boarding Room">1-Person Boarding Room</option>
                <option value="2-Person Shared Room">2-Person Shared Room</option>
                <option value="2 to 4-Person Shared Room">2 to 4-Person Shared Room</option>
                <option value="Whole House-Short Term">Whole House-Short Term</option>
                <option value="Whole House-Long Term">Whole House-Long Term</option>
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
                Pending Approvals: {mylist.filter(l => l.status === 'Pending').length} listings needed the admin's attention to goes live
              </p>
              <p className="font-semibold text-emerald-800">
                Pending Payments: {mylist.filter(l => l.payStatus !== 'Done').length} listings needed to pay the listing fee to goes live
              </p>
              <p className="text-sm text-emerald-600">
                Manage your existing listings below
              </p>
            </div>
          </div>
        </div>

        {/* Type Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {/* All Listings Card */}
          <div 
            className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${selectedCategory === 'all' ? 'border-green-500' : 'border-gray-300'} cursor-pointer transition duration-200 hover:shadow-lg`}
            onClick={() => filterItems('all')}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-500">All Listings</h3>
                <p className="text-2xl font-bold text-gray-800">{typeCounts.all}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <FaHome className="text-green-600" />
              </div>
            </div>
          </div>

          {/* 1-Person Boarding Room */}
          <div 
            className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${selectedCategory === '1-Person Boarding Room' ? 'border-blue-500' : 'border-gray-300'} cursor-pointer transition duration-200 hover:shadow-lg`}
            onClick={() => filterItems('1-Person Boarding Room')}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-500">1-Person</h3>
                <p className="text-2xl font-bold text-gray-800">{typeCounts['1-Person Boarding Room']}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <FaUser className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* 2-Person Shared Room */}
          <div 
            className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${selectedCategory === '2-Person Shared Room' ? 'border-purple-500' : 'border-gray-300'} cursor-pointer transition duration-200 hover:shadow-lg`}
            onClick={() => filterItems('2-Person Shared Room')}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-500">2-Person</h3>
                <p className="text-2xl font-bold text-gray-800">{typeCounts['2-Person Shared Room']}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <FaUser className="text-purple-600" />
              </div>
            </div>
          </div>

          {/* 2 to 4-Person Shared Room */}
          <div 
            className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${selectedCategory === '2 to 4-Person Shared Room' ? 'border-orange-500' : 'border-gray-300'} cursor-pointer transition duration-200 hover:shadow-lg`}
            onClick={() => filterItems('2 to 4-Person Shared Room')}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-500">2-4 Person</h3>
                <p className="text-2xl font-bold text-gray-800">{typeCounts['2 to 4-Person Shared Room']}</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-full">
                <FaUser className="text-orange-600" />
              </div>
            </div>
          </div>

          {/* Whole House */}
          <div 
            className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${selectedCategory.includes('Whole House') ? 'border-red-500' : 'border-gray-300'} cursor-pointer transition duration-200 hover:shadow-lg`}
            onClick={() => filterItems('Whole House-Short Term')}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Whole House</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {typeCounts['Whole House-Short Term'] + typeCounts['Whole House-Long Term']}
                </p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <FaHome className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item._id} className={`${
                item.status === 'Approved' ? 'bg-green-50' :
                item.status === 'Rejected' ? 'bg-red-50' :
                'bg-yellow-50 '
                } rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300`}>
                {/* Listing Image */}
                <div className={`relative h-[300px] overflow-hidden${
                item.status === 'Approved' ? 'bg-green-50 border-l-4 border-green-500' :
                item.status === 'Rejected' ? 'bg-red-50 border-l-4 border-red-500' :
                'bg-yellow-50 border-l-4 border-yellow-400'
                }`}>
                  {item.images && item.images.length > 0 ? (
                    <img 
                      className="w-full h-full object-cover transition duration-300 hover:scale-105" 
                      src={item.images[0]} 
                      alt={item.name} 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}

                  {/* Status */}
                  <div className="absolute text-xs top-2 right-2 bg-emerald-500 text-white px-3 py-1 rounded-lg font-bold shadow-md">
                    <div>{item.status}</div>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute text-xs top-9 right-2 bg-orange-500 text-white px-3 py-1 rounded-lg font-bold shadow-md">
                    <div>LKR {item.price}</div>
                  </div>

                  {/* Payment */}
                  <div className="absolute text-xs top-16 right-2 bg-blue-500 text-white px-3 py-1 rounded-lg font-bold shadow-md">
                    <div>Payment - {item.payStatus}</div>
                  </div>
                </div>

                {/* Listing Details */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row justify-between border-t pt-4">

                    <Link 
                      to={`/owner/view-listing/${item._id}`}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
                      title="View Details"
                    >
                      <FcViewDetails className="w-5 h-5 mr-1" />
                      <span className="text-md">Details</span>
                    </Link>

                    <Link 
                      to={`/owner/update-listing/${item._id}`}
                      className="flex items-center text-orange-500 hover:text-orange-700 transition duration-200"
                      title="Edit"
                    >
                      <FaEdit className="w-4 h-4 mr-1" />
                      <span className="text-md">Edit</span>
                    </Link>

                    {item.payStatus!=='Done'?(
                      <button
                        onClick={() => makePayment(item._id, item.type)}
                        disabled={!(item.status === 'Approved')}
                        className={`flex items-center ${
                          (item.status === 'Approved')
                            ? 'text-emerald-500 hover:text-emmerald-900 transition duration-200 cursor-pointer'
                            : 'text-gray-500 cursor-not-allowed'
                        }`}
                        title="Pay"
                      >
                        <MdOutlinePayment className="w-5 h-5 mr-1" />
                        <span className="text-md">Pay</span>
                      </button>
                      ):(
                      <div className='text-emerald-500 flex items-center'>
                        <RiWechatPayLine className="w-5 h-5 mr-1" />
                        <p className="text-md">Paid</p>
                      </div>
                    )}

                    <button
                      onClick={() => handleDelete(item)}
                      className="flex items-center text-rose-600 hover:text-rose-800 transition duration-200"
                      title="Delete"
                    >
                      <FaTrashAlt className="w-4 h-4 mr-1" />
                      <span className="text-md">Delete</span>
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
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Listings Found</h2>
            <p className="text-gray-600 mb-4">
              {selectedCategory === "all" 
                ? "You don't have any listings yet." 
                : "No listings found for this type."}
            </p>
            {selectedCategory !== "all" && (
              <button
                onClick={() => filterItems("all")}
                className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200"
              >
                View All Listings
              </button>
            )}
            <Link 
              to="/owner/add-listing"
              className="btn bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition duration-200 ml-4"
            >
              <FaPlusCircle className="mr-1" /> Add New Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageListing;