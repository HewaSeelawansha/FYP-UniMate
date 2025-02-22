import React, { useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaCloudUploadAlt, FaUndoAlt, FaUpload } from 'react-icons/fa';
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

// Fix for default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import useOwner from '../../../hooks/useOwner';
import { FaMapLocationDot } from 'react-icons/fa6';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const UpdateBoarding = () => {
  const { user } = useAuth();
  const [isOwner, isOwnerLoading] = useOwner();
  const item = useLoaderData(); 
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [lng, setLng] = useState(item.lng);
  const [lat, setLat] = useState(item.lat); 
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
        name: item.name,
        address: item.address,
        lng: item.lan,
        lat: item.lat,
        phone: item.phone,
        gender: item.gender,
        description: item.description,
        beds: item.beds,
    },
  });

  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const amenitiesList = ['wifi', 'cctv', 'study area', 'parking', 'gym'];

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
    let imageUrls = item.images; // Fallback to the existing images

    // If new images are uploaded, host them
    if (data.image && data.image.length > 0) {
      const uploadPromises = Array.from(data.image).map(async (file) => {
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
        imageUrls = await Promise.all(uploadPromises);
      } catch (error) {
        console.error('Error uploading images:', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Image Upload Failed',
          text: 'An error occurred while uploading the images.',
          showConfirmButton: true,
        });
        return;
      }
    }

    const selectedAmenities = amenitiesList.filter((amenity) => data[amenity]);

    const updatedBoarding = {
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
        status: item.status,
    };

    try {
      const response = await axiosSecure.patch(`/boarding/${item._id}`, updatedBoarding);

      if (response.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Boarding Updated Successfully',
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
        text: 'An error occurred while updating the boarding.',
        showConfirmButton: true,
      });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if(item?.owner !== user?.email) {
    return (
      <div className='w-full lg:w-[780px] md:w-[520px] px-2 mx-auto py-4'>
        <h2 className='text-3xl font-bold text-center mb-8'>
          Your Access to Edit This <span className='text-green'>Denied</span>
        </h2>
      </div>
    );
  }

  return (
    <div className='w-full 2xl:w-[1320px] xl:w-[1080px] lg:w-[780px] md:w-[520px] px-2 mx-auto py-4'>
      <h2 className={isOwner? 'text-3xl font-bold':'text-3xl font-bold text-center mb-4'}>
        Update <span className='text-green'>{item.name}</span>
      </h2>
      {isOwner?<></>:
      <Link to="/owner">
      <div className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
      ✕
      </div></Link>
      }
      <div className="p-0.5 rounded-lg bg-green my-5 h-[500px] sm:h-[500px] xl:h-[600px] 2xl:h-[700px]">
        <Carousel slideInterval={5000}>
          {item.images && item.images.length > 0 ? (
            item.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full"
              />
            ))
          ) : (
            <img
              src="https://via.placeholder.com/800x500?text=No+Image+Available"
              alt="No images"
            />
          )}
        </Carousel>
      </div>
      <div className='bg-gray-100 p-6 rounded-lg'>
      <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-6'>

            <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Owner
              </label>
              <input
                {...register('owner', { required: true })}
                type='text'
                defaultValue={item.owner}
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
                  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  onChange={(e) => setLgender(e.target.value)}
                >
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
                {...register('image')}
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
                      defaultChecked={item.amenities.includes(amenity)}
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
                className='w-full bg-green text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 flex items-center justify-center gap-2 mt-5'
              >
                Set Location <FaMapLocationDot />
              </button>
            </div>

            <button className='w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 flex items-center justify-center gap-2'>
              Save Changes <FaCloudUploadAlt />
            </button>

          </div>
        </form>
        {isOwner?<button onClick={handleGoBack} className="my-5 w-full bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 flex items-center justify-center gap-2">
          Discard Changes <FaUndoAlt />
        </button>:<></>}
      </div>
    </div>
  );
};

export default UpdateBoarding;