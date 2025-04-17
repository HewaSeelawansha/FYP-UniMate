import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Carousel } from "flowbite-react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaUndoAlt, FaEdit, FaHome, FaUser, FaVenusMars, FaMoneyBillWave, FaCalendarAlt, FaCheck } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import useOwner from '../../../hooks/useOwner';
import useAdmin from '../../../hooks/useAdmin';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ViewListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isOwner, isOwnerLoading] = useOwner();
  const [isAdmin, isAdminLoading] = useAdmin();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:3000/listing/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch listing: ${response.statusText}`);
        }
        const data = await response.json();
        setListing(data); 
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchListing();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleListingStatus = async (listingId, status) => {
    const data = {
      status: status,
    };
    
    try {
      const response = await axiosSecure.patch(`/listing/status/${listingId}`, data);
      if (response.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Listing Status Updated Successfully',
          showConfirmButton: false,
          timer: 1500,
          background: '#ffffff',
          customClass: {
            title: 'text-xl font-bold text-gray-800'
          }
        });
      }
    } catch (error) {
      console.log(error)
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating the listing status.',
        showConfirmButton: true,
        background: '#ffffff'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Listing Not Found</h2>
          <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist or may have been removed.</p>
          <button 
            onClick={handleGoBack}
            className="btn bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <IoIosArrowBack /> Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center text-orange-600 hover:text-orange-700 transition duration-200"
          >
            <IoIosArrowBack className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {listing.name}
          </h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {/* Image Carousel */}
        <div className="rounded-xl overflow-hidden shadow-lg mb-8 h-64 sm:h-80 md:h-96 lg:h-[500px]">
          <Carousel slideInterval={5000} indicators={false}>
            {listing.images && listing.images.length > 0 ? (
              listing.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Listing ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ))
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No images available</span>
              </div>
            )}
          </Carousel>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Details */}
          <div className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaHome className="text-orange-500 mr-2" /> Basic Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <FaHome className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Boarding House</p>
                    <p className="font-medium">{listing.boarding}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <FaUser className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Owner</p>
                    <p className="font-medium">{listing.owner}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <FaVenusMars className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{listing.gender}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-600">{listing.description}</p>
            </div>

            {/* Distance Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Distance From the NSBM Green University</h2>
              <p className="text-green font-bold">{listing.distance} Km</p>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaMoneyBillWave className="text-orange-500 mr-2" /> Pricing
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Monthly Rental:</p>
                  <p className="font-bold text-orange-600">LKR {listing.price}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Key Money:</p>
                  <p className="font-bold">
                    {listing.keyMoney > 0 
                      ? `LKR ${listing.keyMoney}` 
                      : <span className="text-gray-500">Not Required</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Amenities Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaCalendarAlt className="text-orange-500 mr-2" /> Additional Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <FaCheck className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Listing Type</p>
                    <p className="font-medium">{listing.type}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <FaCalendarAlt className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created On</p>
                    <p className="font-medium">{new Date(listing.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          {isOwner &&
            <Link 
              to={`/owner/update-listing/${listing._id}`}
              className="flex-1 btn bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <FaEdit /> Edit Listing
            </Link>
          }
          {isAdmin &&
            <select
              className="flex-1 border-none focus:ring-green focus:border-green bg-green text-white rounded-lg gap-2"
              defaultValue={listing.status}
              onChange={(e) => handleListingStatus(listing._id, e.target.value)}
            >
              <option value='Pending'>Pending</option>
              <option value='Approved'>Approved</option>
              <option value='Rejected'>Rejected</option>
            </select>
          }
          <button 
            onClick={handleGoBack}
            className="flex-1 btn bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <FaUndoAlt /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewListing;