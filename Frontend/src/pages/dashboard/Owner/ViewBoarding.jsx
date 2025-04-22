import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Carousel } from "flowbite-react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useAuth from '../../../hooks/useAuth';
import useAdmin from '../../../hooks/useAdmin';
import { FaUndoAlt, FaEdit, FaMapMarkerAlt, FaPhone, FaUser, FaHome, FaBed, FaVenusMars, FaCalendarAlt } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';

// Fix for default marker icons in Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import useOwner from '../../../hooks/useOwner';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ViewBoarding = () => {
  const { user } = useAuth();
  const { email } = useParams();
  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isAdmin, isAdminLoading] = useAdmin();
  const [isOwner, isOwnerLoading] = useOwner();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axiosSecure.get(`/boarding/owner/${email}`);
        setBoarding(response.data);
      } catch (error) {
        console.error("Error fetching boarding:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchListing();
  }, [email]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBoardingStatus = async (boardingId, status) => {
    const data = {
      status: status || item.status,
    };

    try {
      const response = await axiosSecure.patch(`/boarding/status/${boardingId}`, data);

      if (response.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Status Updated Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'An error occurred while updating the status.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading boarding details...</p>
        </div>
      </div>
    );
  }

  if (!boarding) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Boarding House Not Found</h2>
          <p className="text-gray-600 mb-6">The boarding house you're looking for doesn't exist or may have been removed.</p>
          <button 
            onClick={handleGoBack}
            className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2"
          >
            <IoIosArrowBack /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Header Section */}

        <div className="flex xl:flex-row flex-col justify-between items-center mb-8">
          <button
            onClick={handleGoBack}
            className="xl:mb-0 my-2 flex items-center text-green-600 hover:text-green-700 transition duration-200"
          >
            <IoIosArrowBack className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {boarding.name}<span className='text-green-500'> Boarding</span>
          </h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {/* Image Carousel */}
        <div className="rounded-xl overflow-hidden shadow-lg mb-8 h-64 sm:h-80 md:h-96 xl:h-[700px]">
          <Carousel slideInterval={5000} indicators={false}>
            {boarding.images && boarding.images.length > 0 ? (
              boarding.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Boarding House ${index + 1}`}
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-600">{boarding.description}</p>
            </div>

            {/* Distance Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Distance From the NSBM Green University</h2>
              <p className="text-green font-bold">{boarding.distance} Km</p>
            </div>

            {/* Amenities Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {boarding.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Location</h2>
                <div className="h-64 xl:h-80 rounded-lg overflow-hidden border border-gray-200">
                  <MapContainer
                    center={[boarding.lat, boarding.lng]}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[boarding.lat, boarding.lng]}>
                      <Popup>
                        <div className="font-medium">
                          <p className="text-orange-600">{boarding.name}</p>
                          <p>{boarding.address}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-4">
            {/* Quick Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Info</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FaUser className="text-green-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Owner</p>
                    <p className="font-medium">{boarding.owner}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-green-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{boarding.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaPhone className="text-green-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{boarding.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaVenusMars className="text-green-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{boarding.gender}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaBed className="text-green-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Total Beds</p>
                    <p className="font-medium">{boarding.beds}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaCalendarAlt className="text-green-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Added On</p>
                    <p className="font-medium">{new Date(boarding.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isAdmin  &&
              <select
                className="w-full py-3 px-4 bg-green-400 rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500 py-1"
                defaultValue={boarding.status}
                onChange={(e) => handleBoardingStatus(boarding._id, e.target.value)}
              >
                <option value='Pending'>Pending</option>
                <option value='Approved'>Approved</option>
                <option value='Rejected'>Rejected</option>
              </select>
            }
            {isOwner && email === user.email &&
              <Link to={`/owner/update-boarding/${boarding._id}`}>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2">
                  <FaEdit /> Edit Your Boarding
                </button>
              </Link>
            }
            <button 
              onClick={handleGoBack}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <FaUndoAlt /> Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBoarding;