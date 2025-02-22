import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaUpload } from 'react-icons/fa';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import useAuth from '../../../hooks/useAuth';

// Fix for default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useNavigate } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const AddBoarding = () => {
  const {user} = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lng, setLng] = useState(80.04161575881648); // Default longitude (e.g., Colombo, Sri Lanka)
  const [lat, setLat] = useState(6.822351667770194); // Default latitude (e.g., Colombo, Sri Lanka)
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const fetchListing = async () => {
    try {
      const response = await fetch(`http://localhost:3000/boarding/owner/${user.email}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch boarding: ${response.statusText}`);
      }
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

  const owner = user.email;

  const amenitiesList = ["wifi", "cctv", "study area", "parking", "gym"];

  // Geocoder component for searching locations
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

      // Handle search results
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
        title: 'Location Set',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const onSubmit = async (data) => {
    const imageFiles = data.image;

    const uploadPromises = Array.from(imageFiles).map(async (file) => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosPublic.post(image_hosting_api, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return response.data.data.display_url;
      }
      throw new Error('Image upload failed');
    });

    try {
      const imageUrls = await Promise.all(uploadPromises);

      const selectedAmenities = amenitiesList.filter(amenity => data[amenity]);

      const newItem = {
        name: data.name,
        owner: data.owner,
        address: data.address,
        lng: lng,
        lat: lat,
        phone: data.phone,
        gender: data.gender,
        description: data.description,
        images: imageUrls,
        amenities: selectedAmenities,
        beds: data.beds,
        status: 'Pending',
      };

      console.log(newItem);

      const postNewItem = await axiosSecure.post('/boarding', newItem);

      if (postNewItem.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Successfully Uploaded',
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
        refetchListing(); 
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Upload Failed',
        text: 'An error occurred while uploading the images or the menu item.',
        showConfirmButton: true,
      });
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (boarding?.status!=="Approved") {
    return <div className="w-full lg:w-[780px] md:w-[520px] px-2 mx-auto py-4">
      <h2 className='text-3xl font-bold text-center mb-5'>
      Boarding House Is <span className='text-green'> {boarding?.status} </span>
      </h2>
      <button
        className="w-full font-bold bg-green text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 flex items-center justify-center gap-2"
        onClick={() => navigate(`/owner/update-boarding/${boarding._id}`)}
      >
        Resubmit
      </button>
      </div>;
  }

  if (boarding?.status==="Approved") {
    return <div className="w-full lg:w-[780px] md:w-[520px] px-2 mx-auto py-4">
      <h2 className='text-3xl font-bold text-center mb-5'>
      Boarding House <span className='text-green'>Already Uploaded</span>
      </h2>
      <button
        className="mb-5 w-full font-bold bg-green text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 flex items-center justify-center gap-2"
        onClick={() => navigate(`/owner/view-boarding/${user.email}`)}
      >
        View
      </button>
      <button
        className="w-full font-bold bg-green text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 flex items-center justify-center gap-2"
        onClick={() => navigate(`/owner/update-boarding/${boarding._id}`)}
      >
        Edit
      </button>
      </div>;
  }

  return (
    <div className='w-full lg:w-[780px] md:w-[520px] px-2 mx-auto py-4'>
      <h2 className='text-3xl font-bold text-center mb-8'>
        Upload Your <span className='text-green'>Boarding House</span>
      </h2>
      <div className='bg-white p-6 rounded-lg shadow-lg'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-6'>

            <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Owner
              </label>
              <input
                {...register('owner', { required: true })}
                type='text'
                defaultValue={owner}
                disabled
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Name of the Place
              </label>
              <input
                {...register('name', { required: true })}
                type='text'
                placeholder='Enter the Name'
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Address of the Place
              </label>
              <input
                {...register('address', { required: true })}
                type='text'
                placeholder='Enter the Address'
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            <div className='form-control w-full'>
                <label className='block text-sm font-medium mb-2'>
                  Gender
                </label>
                <select
                  {...register('gender', { required: true })}
                  defaultValue=''
                  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                >
                  <option value='' disabled>Pick one</option>
                  <option value='Girls'>Girls</option>
                  <option value='Boys'>Boys</option>
                  <option value='Unisex'>Unisex</option>
                </select>
              </div>

            <div className='flex gap-4'>

              <div className='form-control w-full'>
                <label className='block text-sm font-medium mb-2'>
                  Total Beds
                </label>
                <input
                  {...register('beds', { required: true })}
                  type='number'
                  placeholder='No of Total Beds'
                  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div>

              <div className='form-control w-full'>
                <label className='block text-sm font-medium mb-2'>
                  Contact
                </label>
                <input
                  {...register('phone', { required: true })}
                  type='number'
                  placeholder='Contact Number'
                  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div>
            </div>

            <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Description
              </label>
              <textarea
                {...register('description', { required: true })}
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                placeholder='Description of the Place'
                rows='4'
              ></textarea>
            </div>

            <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Add Images
              </label>
              <input
                {...register('image', { required: true })}
                type='file'
                className='w-full file-input file-input-bordered'
                multiple
              />
            </div>

            <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Amenities
              </label>
              <div className='flex flex-wrap gap-4'>
                {amenitiesList.map((amenity, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      {...register(amenity)}
                      className='checkbox checkbox-sm'
                    />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Set Location
              </label>
              <div style={{ height: '400px', position: 'relative' }}>
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
                className='w-full bg-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2 mt-4'
              >
                Set Location
              </button>
            </div>

            <button className='w-full bg-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2'>
              Upload <FaUpload />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBoarding;