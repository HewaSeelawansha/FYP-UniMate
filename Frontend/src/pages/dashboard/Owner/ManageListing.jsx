import React from 'react';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manage <span className="text-orange-600">Listings</span>
            </h1>
            <p className="text-gray-600 mt-2">
              View, edit, or delete your current listings
            </p>
          </div>
          <Link 
            to="/owner/add-listing"
            className="btn bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center gap-2 mt-4 sm:mt-0"
          >
            <FaPlusCircle /> Add Listing
          </Link>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-orange-500 to-orange-600">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    #
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Listing
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mylist.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-10 w-10">
                        {item.images && item.images.length > 0 ? (
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={item.images[0]} 
                            alt="Listing thumbnail" 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      LKR {item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Link 
                          to={`/owner/view-listing/${item._id}`}
                          className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-50 transition duration-200"
                          title="View Details"
                        >
                          <FcViewDetails className="w-5 h-5" />
                        </Link>
                        <Link 
                          to={`/owner/update-listing/${item._id}`}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition duration-200"
                          title="Edit"
                        >
                          <FaEdit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition duration-200"
                          title="Delete"
                        >
                          <FaTrashAlt className="w-5 h-5" />
                        </button>
                      </div>
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

export default ManageListing;