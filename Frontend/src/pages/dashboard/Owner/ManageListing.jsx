import React from 'react';
import { FaEdit, FaTrashAlt, FaPlusCircle, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import { FcViewDetails } from "react-icons/fc";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useMyListing from '../../../hooks/useMyListing';

const ManageListing = () => {
  const [mylist, loading, refetch] = useMyListing();
  const axiosSecure = useAxiosSecure();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your listings...</p>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manage <span className="text-green">Listings</span>
            </h1>
            <p className="text-gray-600 mt-2">
              View, edit, or delete your current listings
            </p>
          </div>
          <Link 
            to="/owner/add-listing"
            className="btn bg-green hover:bg-orange-500 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center gap-2 mt-4 sm:mt-0"
          >
            <FaPlusCircle /> Add Listing
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {mylist.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              {/* Listing Image */}
              <div className="relative h-48 overflow-hidden">
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
                <div className="absolute top-2 right-2 bg-emerald-500 text-white px-3 py-1 rounded-lg font-bold shadow-md">
                  <div>{item.status}</div>
                </div>

                {/* Price Tag */}
                <div className="absolute top-11 right-2 bg-orange-500 text-white px-3 py-1 rounded-lg font-bold shadow-md">
                  <div>LKR {item.price}</div>
                </div>

                {/* Payment */}
                <div className="absolute top-20 right-2 bg-blue-500 text-white px-3 py-1 rounded-lg font-bold shadow-md">
                  <div>Payment - {item.payStatus}</div>
                </div>
                
              </div>

              {/* Listing Details */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
{/*                 
                
                <div className="flex justify-between text-sm text-gray-500 mb-5">
                  <div className="flex items-center">
                    <FaBed className="mr-1 text-orange-500" />
                    <span>{item.totalBeds || 'N/A'} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <FaBath className="mr-1 text-orange-500" />
                    <span>{item.bathrooms || 'N/A'} Baths</span>
                  </div>
                  <div className="flex items-center">
                    <FaRulerCombined className="mr-1 text-orange-500" />
                    <span>{item.area || 'N/A'} sqft</span>
                  </div>
                </div> */}

                {/* Action Buttons */}
                <div className="flex justify-between border-t pt-4">
                  <Link 
                    to={`/owner/view-listing/${item._id}`}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
                    title="View Details"
                  >
                    <FcViewDetails className="w-5 h-5 mr-1" />
                    <span className="text-sm">Details</span>
                  </Link>
                  <Link 
                    to={`/owner/update-listing/${item._id}`}
                    className="flex items-center text-orange-500 hover:text-orange-700 transition duration-200"
                    title="Edit"
                  >
                    <FaEdit className="w-4 h-4 mr-1" />
                    <span className="text-sm">Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex items-center text-emerald-500 hover:text-emmerald-700 transition duration-200"
                    title="Pay"
                  >
                    <FaTrashAlt className="w-4 h-4 mr-1" />
                    <span className="text-sm">Pay</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    className="flex items-center text-rose-600 hover:text-rose-800 transition duration-200"
                    title="Delete"
                  >
                    <FaTrashAlt className="w-4 h-4 mr-1" />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageListing;