import React from 'react';
import { FaEdit, FaTrashAlt, FaPlusCircle, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
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
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

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
        <div className="flex xl:flex-row flex-col items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="xl:mb-0 my-2 flex items-center text-green-600 hover:text-green-700 transition duration-200"
          >
            <IoIosArrowBack className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Manage <span className="text-green-500">Listings</span>
          </h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {mylist.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              {/* Listing Image */}
              <div className="relative h-[300px] overflow-hidden">
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
      </div>
    </div>
  );
};

export default ManageListing;