import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { MdDashboard, MdDashboardCustomize } from "react-icons/md";
import { FaEdit, FaPlusCircle, FaQuestionCircle, FaRegUser, FaShoppingBag, FaUpload } from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import logo from "/logon.png";
import { useForm } from 'react-hook-form';
import useOwner from '../hooks/useOwner';
import useUser from '../hooks/useUser';
import useAuth from '../hooks/useAuth';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';

// Configure default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const sharedLinks = (
  <>
    <li className='mt-3'><Link to="/chats" className="hover:bg-green-100 rounded-lg"><IoMdChatboxes className="text-green" /> Chats</Link></li>
    <li><Link to="/" className="hover:bg-green-100 rounded-lg"><MdDashboard className="text-green" /> Home</Link></li>
    <li><Link to="/menu" className="hover:bg-green-100 rounded-lg"><FaCartShopping className="text-green" /> Listings</Link></li>
    <li><Link to="/menu" className="hover:bg-green-100 rounded-lg"><FaQuestionCircle className="text-green" /> 24/7 Support</Link></li>
  </>
);

const OwnerLayout = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lng, setLng] = useState(80.04161575881648);
  const [lat, setLat] = useState(6.822351667770194);
  const [imagePreviews, setImagePreviews] = useState([]);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [isOwner, isOwnerLoading] = useOwner();
  const [isUser, isUserLoading] = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const NSBMLocation = [6.821380, 80.041691];

  const amenitiesList = [
    { id: 'wifi', label: 'WiFi' },
    { id: 'cctv', label: 'CCTV' },
    { id: 'study', label: 'Study Area' },
    { id: 'parking', label: 'Parking' },
    { id: 'gym', label: 'Gym' }
  ];

  const fetchListing = async () => {
    try {
      const response = await fetch(`http://localhost:3000/boarding/owner/${user.email}`);
      if (!response.ok) throw new Error(`Failed to fetch boarding: ${response.statusText}`);
      const data = await response.json();
      setBoarding(data); 
    } catch (error) {
      console.error("Error fetching boarding:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [user.email]);

  const refetchListing = () => {
    setLoading(true);
    fetchListing();
  };

  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  useEffect(() => {
    return () => {
      // Clean up the object URLs
      imagePreviews.forEach(item => URL.revokeObjectURL(item.preview));
    };
  }, [imagePreviews]);

  const Geocoder = () => {
    const map = useMap();

    useEffect(() => {
      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        provider,
        style: 'bar',
        autoComplete: true,
        showMarker: true,
        autoClose: true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: true,
        searchLabel: 'Enter address',
      });

      map.addControl(searchControl);

      map.on('geosearch/showlocation', (result) => {
        const { x: lng, y: lat } = result.location;
        setLng(lng);
        setLat(lat);
      });

      return () => map.removeControl(searchControl);
    }, [map]);

    return null;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance.toFixed(2); // Return with 2 decimal places
  };

  const handleSetLocation = () => {
    if (lng && lat) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Location Set Successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Create preview URLs for selected images
    const previews = files.map(file => ({
      file, // Store the actual file object
      preview: URL.createObjectURL(file) // Create preview URL
    }));
    
    setImagePreviews(previews);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const imageFiles = data.image;
    const uploadPromises = imagePreviews.map(async (item) => {
      const formData = new FormData();
      formData.append('image', item.file);
      const response = await axiosPublic.post(image_hosting_api, formData, {
        headers: { 'content-type': 'multipart/form-data' },
      });
      if (response.data.success) return response.data.data.display_url;
      throw new Error('Image upload failed');
    });

    try {
      const imageUrls = await Promise.all(uploadPromises);
      const selectedAmenities = amenitiesList.filter(amenity => data[amenity.id]).map(amenity => amenity.label);
      const distance = calculateDistance(
        NSBMLocation[0],  
        NSBMLocation[1],  
        lat,             
        lng               
      );

      const newItem = {
        name: data.name,
        owner: user.email,
        address: data.address,
        lng: lng,
        lat: lat,
        distance: distance,
        phone: data.phone,
        gender: data.gender,
        description: data.description,
        images: imageUrls,
        amenities: selectedAmenities,
        beds: data.beds,
        status: 'Pending',
      };

      const postNewItem = await axiosSecure.post('/boarding', newItem);

      if (postNewItem.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Boarding House Submitted Successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
        refetchListing();
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Submission Failed',
        text: error.message || 'An error occurred while submitting your boarding house.',
        showConfirmButton: true,
      });
    } finally {
      setIsSubmitting(false); 
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (boarding && boarding?.status !== "Approved") {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Boarding House Status: <span className={`${boarding?.status === "Approved" ? 'text-green-600' : 'text-yellow-600'}`}>
              {boarding?.status}
            </span>
          </h2>
          <p className="text-gray-600 mb-6">
            {boarding?.status === "Pending" 
              ? "Your submission is under review. We'll notify you once approved."
              : "Please update your boarding house details for approval."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-300 flex items-center gap-2"
              onClick={() => navigate(`/update-boarding/${boarding._id}`)}
            >
              <FaEdit /> Update Submission
            </button>
            <Link to="/" className="btn btn-outline border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg transition duration-300">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isOwner ? (
        <div className="drawer sm:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col sm:pl-0">
          {/* Mobile header */}
          <div className="flex items-center justify-between mx-4 sm:hidden">
            <label htmlFor="my-drawer-2" className="btn bg-blue-300 rounded-full drawer-button">
              <MdDashboardCustomize/>
            </label>
            <button className='my-2 flex items-center gap-2 btn rounded-full px-6 bg-green text-white'>
              <FaRegUser />Logout
            </button>
          </div>
          
          {/* Outlet container - takes full width on mobile, adjusts for sidebar on larger screens */}
          <div className='mt-5 sm:mt-0 mx-4 sm:ml-[calc(10px+1rem)] xl:ml-[calc(10px+2rem)] w-auto'>
            <Outlet />
          </div>
        </div>
        
        {/* Sidebar - fixed width */}
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
                <Link to="/dashboard" className="flex justify-start mb-3">
                <img src={logo} alt="" className="w-[150px]" />
                <span className="badge badge-primary">Owner</span>
                </Link>
            </li>
            <hr />
            <li className='mt-3'><Link className='hover:bg-green-100 rounded-lg' to="/owner"><MdDashboard className="text-green" /> Owner Dashboard</Link></li>
            <li><Link className='hover:bg-green-100 rounded-lg' to={`/owner/view-boarding/${user.email}`}><FaPlusCircle className="text-green" /> View Hostel</Link></li>
            <li><Link className='hover:bg-green-100 rounded-lg' to="/owner/add-listing"><FaPlusCircle className="text-green" /> Add Listing</Link></li>
            <li><Link className='hover:bg-green-100 rounded-lg' to="/owner/manage-items"><FaEdit className="text-green" /> Manage Listings</Link></li>
            <li  className='mb-3'><Link className='hover:bg-green-100 rounded-lg' to="/owner/manage-booking"><FaShoppingBag className="text-green" /> Manage Booking</Link></li>
            <hr/>
            {
              sharedLinks 
            }
            </ul>
        </div>
        </div>
      ) : isUser ? (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                  List Your <span className="text-green-600">Boarding House</span>
                </h1>
                <Link to="/" className="btn btn-circle btn-ghost text-red-500 hover:text-red-600">
                  ✕
                </Link>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
                    <input
                      {...register('owner', { required: true })}
                      type="text"
                      defaultValue={user.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Place Name*</label>
                    <input
                      {...register('name', { required: 'Place name is required' })}
                      type="text"
                      placeholder="Boarding House Name"
                      className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                  <input
                    {...register('address', { required: 'Address is required' })}
                    type="text"
                    placeholder="Full Address"
                    className={`w-full px-4 py-3 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender*</label>
                    <select
                      {...register('gender', { required: 'Please select gender' })}
                      className={`w-full px-4 py-3 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Girls">Girls Only</option>
                      <option value="Boys">Boys Only</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Beds*</label>
                    <input
                      {...register('beds', { 
                        required: 'Number of beds is required',
                        min: { value: 1, message: 'Must have at least 1 bed' }
                      })}
                      type="number"
                      placeholder="Number of beds"
                      className={`w-full px-4 py-3 border ${errors.beds ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.beds && <p className="mt-1 text-sm text-red-600">{errors.beds.message}</p>}
                  </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number*</label>
                    <input
                      {...register('phone', { 
                        required: 'Contact number is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Please enter a valid 10-digit phone number'
                        }
                      })}
                      type="tel"
                      placeholder="Contact Number"
                      className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                  </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                    <div className="grid grid-cols-2 gap-2">
                      {amenitiesList.map((amenity) => (
                        <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            {...register(amenity.id)}
                            className="checkbox checkbox-sm border-gray-300 rounded text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">{amenity.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Describe your boarding house (facilities, rules, etc.)"
                    rows="4"
                  ></textarea>
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photos*</label>
                  <div className="space-y-4">
                    {/* Image previews */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      {imagePreviews.map((item, index) => (
                        <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                          <img 
                            src={item.preview} 
                            alt={`Preview ${index}`} 
                            className="w-full h-full object-cover"
                          />
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedPreviews = [...imagePreviews];
                              updatedPreviews.splice(index, 1);
                              setImagePreviews(updatedPreviews);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Upload area */}
                    <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <FaUpload className="text-green-600 text-2xl mb-2" />
                      <p className="text-sm text-gray-600">Click to upload images</p>
                      <p className="text-xs text-gray-500">(JPEG, PNG, etc.)</p>
                      <input
                        {...register('image', { required: 'At least one image is required' })}
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                      />
                    </label>
                    {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Set Location*</label>
                  <div className="space-y-4">
                    <div style={{ height: '400px', borderRadius: '0.5rem', overflow: 'hidden' }}>
                      <MapContainer
                        center={[lat, lng]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker
                          position={[lat, lng]}
                          draggable
                          eventHandlers={{
                            dragend: (e) => {
                              const { lat, lng } = e.target.getLatLng();
                              setLat(lat);
                              setLng(lng);
                            },
                          }}
                        >
                          <Popup>Drag to adjust the location</Popup>
                        </Marker>
                        <Geocoder />
                      </MapContainer>
                    </div>
                    <button
                      type="button"
                      onClick={handleSetLocation}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                    >
                      Confirm Location
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full ${
                      isSubmitting ? 'bg-green-500' : 'bg-green-500 hover:bg-green-600'
                    } text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaUpload /> Submit Boarding
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
          <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">You need to be registered as an owner to access this page.</p>
            <Link to="/" className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-300">
              Back to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerLayout;