import React, { useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaCloudUploadAlt, FaUndoAlt, FaUpload, FaSpinner } from 'react-icons/fa';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { Carousel } from 'flowbite-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import useAuth from '../../../hooks/useAuth';
import useOwner from '../../../hooks/useOwner';
import { FaMapLocationDot } from 'react-icons/fa6';

// NSBM location coordinates
const NSBMLocation = [6.821380, 80.041691];

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const UpdateBoarding = () => {
  const { user } = useAuth();
  const [isOwner] = useOwner();
  const item = useLoaderData();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [lng, setLng] = useState(item.lng);
  const [lat, setLat] = useState(item.lat);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: item.name,
      address: item.address,
      phone: item.phone,
      gender: item.gender,
      description: item.description,
      beds: item.beds,
      wifi: item.amenities.includes('wifi'),
      cctv: item.amenities.includes('cctv'),
      'study area': item.amenities.includes('study area'),
      parking: item.amenities.includes('parking'),
      gym: item.amenities.includes('gym'),
    },
  });

  const amenitiesList = ['wifi', 'cctv', 'study area', 'parking', 'gym'];
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(2); // Distance in km with 2 decimal places
  };

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  // Remove image preview
  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index].preview);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [imagePreviews]);

  // Geocoder component for map
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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Upload new images if any
      let imageUrls = item.images;
      if (imagePreviews.length > 0) {
        const uploadPromises = imagePreviews.map(async (image) => {
          const formData = new FormData();
          formData.append('image', image.file);
          const response = await axiosPublic.post(image_hosting_api, formData);
          if (response.data.success) return response.data.data.display_url;
          throw new Error('Image upload failed');
        });
        imageUrls = await Promise.all(uploadPromises);
      }

      // Calculate distance from NSBM
      const distance = calculateDistance(NSBMLocation[0], NSBMLocation[1], lat, lng);

      // Prepare updated boarding data
      const selectedAmenities = amenitiesList.filter(amenity => data[amenity]);
      const updatedBoarding = {
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
        status: item.status,
      };

      // Submit to backend
      const response = await axiosSecure.patch(`/boarding/${item._id}`, updatedBoarding);

      if (response.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Boarding Updated Successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(-1);
      }
    } catch (error) {
      console.error('Error updating boarding:', error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'An error occurred while updating the boarding.',
        showConfirmButton: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => navigate(-1);

  if (item?.owner !== user?.email) {
    return (
      <div className='w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md'>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-6'>
          Access <span className='text-red-500'>Denied</span>
        </h2>
        <p className='text-center text-gray-600 mb-6'>
          You don't have permission to edit this boarding.
        </p>
        <div className='flex justify-center'>
          <Link to="/" className='btn bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg'>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full mx-auto p-4 sm:p-6'>
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        {/* Header */}
        <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-800'>
            Update <span className='text-green-500'>{item.name}</span>
          </h2>
          {!isOwner && (
            <Link to="/owner" className='text-gray-500 hover:text-gray-700'>
              <span className='text-2xl'>×</span>
            </Link>
          )}
        </div>

        {/* Image Carousel */}
        <div className='p-4'>
          <div className='rounded-lg overflow-hidden bg-gray-100 xl:h-[700px] sm:h-80 md:h-96'>
            <Carousel slideInterval={5000}>
              {item.images.length > 0 ? (
                item.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Boarding ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                ))
              ) : (
                <div className='flex items-center justify-center h-full bg-gray-200'>
                  <span className='text-gray-500'>No images available</span>
                </div>
              )}
            </Carousel>
          </div>
        </div>

        {/* Update Form */}
        <div className='p-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Owner Email */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Owner Email</label>
                <input
                  {...register('owner')}
                  type='text'
                  defaultValue={user.email}
                  disabled
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100'
                />
              </div>

              {/* Place Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Place Name*</label>
                <input
                  {...register('name', { required: true })}
                  type='text'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Address*</label>
              <input
                {...register('address', { required: true })}
                type='text'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Gender */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Gender*</label>
                <select
                  {...register('gender', { required: true })}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                >
                  <option value="Girls">Girls Only</option>
                  <option value="Boys">Boys Only</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              {/* Beds */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Total Beds*</label>
                <input
                  {...register('beds', { required: true, min: 1 })}
                  type='number'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Contact Number*</label>
              <input
                {...register('phone', { required: true })}
                type='tel'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
              />
            </div>

            {/* Description */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Description*</label>
              <textarea
                {...register('description', { required: true })}
                rows='4'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
              ></textarea>
            </div>

            {/* Amenities */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Amenities</label>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3'>
                {amenitiesList.map((amenity) => (
                  <label key={amenity} className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      {...register(amenity)}
                      className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
                    />
                    <span className='text-sm text-gray-700 capitalize'>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Add More Images</label>
              <div className='space-y-4'>
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className='flex flex-wrap gap-4'>
                    {imagePreviews.map((image, index) => (
                      <div key={index} className='relative group'>
                        <img
                          src={image.preview}
                          alt={`Preview ${index}`}
                          className='w-24 h-24 object-cover rounded-lg border border-gray-200'
                        />
                        <button
                          type='button'
                          onClick={() => removeImage(index)}
                          className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Upload Area */}
                <label className='flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'>
                  <FaUpload className='text-green-600 text-2xl mb-2' />
                  <p className='text-sm text-gray-600'>Click to upload images</p>
                  <p className='text-xs text-gray-500'>JPEG, PNG (Max 5MB each)</p>
                  <input
                    {...register('image')}
                    type='file'
                    className='hidden'
                    onChange={handleImageChange}
                    multiple
                    accept='image/*'
                  />
                </label>
              </div>
            </div>

            {/* Map Location */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Set Location*</label>
              <div className='h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border border-gray-300'>
                <MapContainer
                  center={[lat, lng]}
                  zoom={15}
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
                    <Popup>Drag to adjust location</Popup>
                  </Marker>
                  <Geocoder />
                </MapContainer>
              </div>

              <button
                type='button'
                onClick={handleSetLocation}
                className='mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2'
              >
                <FaMapLocationDot /> Confirm Location
              </button>
            </div>

            {/* Submit Button */}
            <div className='pt-4'>
              <button
                type='submit'
                disabled={isSubmitting}
                className={`w-full ${
                  isSubmitting ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'
                } text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className='animate-spin' /> Processing...
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt /> Update Listing
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Discard Button for Owners */}
          {isOwner && (
            <button
              onClick={handleGoBack}
              className='mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2'
            >
              <FaUndoAlt /> Discard Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateBoarding;