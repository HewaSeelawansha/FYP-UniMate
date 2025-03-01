import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { MdDashboard, MdDashboardCustomize } from "react-icons/md";
import {FaEdit,FaLocationArrow,FaPlusCircle,FaQuestionCircle,FaRegUser,FaShoppingBag,FaUser,} from "react-icons/fa";
import logo from "/logon.png";
import { FaCartShopping } from "react-icons/fa6";
import Login from '../components/Login';
import useOwner from '../hooks/useOwner';
import useUser from '../hooks/useUser';
import useAuth from '../hooks/useAuth';
import { IoMdChatboxes } from "react-icons/io";
import { useForm } from 'react-hook-form';
import { FaUpload } from 'react-icons/fa';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';

const sharedLinks = (
  <>
    <li className='mt-3'><Link to="/chats"><IoMdChatboxes /> Chats</Link></li>
    <li><Link to="/"><MdDashboard /> Home</Link></li>
    <li><Link to="/menu"><FaCartShopping/> Listings</Link></li>
    <li><Link to="/menu"><FaQuestionCircle/> 24/7 Customer Support</Link></li>
  </>
)

const OwnerLayout = () => {
  const {user} = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lng, setLng] = useState(80.04161575881648); // Default longitude (e.g., Colombo, Sri Lanka)
  const [lat, setLat] = useState(6.822351667770194); // Default latitude (e.g., Colombo, Sri Lanka)
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [isOwner, isOwnerLoading] = useOwner()
  const [isUser, isUserLoading] = useUser()
  const navigate = useNavigate();

  const fetchListing = async () => {
    try {
      const response = await fetch(`http://localhost:3000/boarding/owner/${user.email}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch boarding: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
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

  if (boarding && boarding?.status!=="Approved") {
    return <div className="w-full lg:w-[780px] md:w-[520px] px-2 mx-auto py-4">
      <h2 className='text-3xl font-bold text-center mb-5'>
      Boarding House Validation - <span className='text-green font-extrabold'> {boarding?.status} </span>
      </h2>
      <button
        className="w-full font-bold bg-green text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 flex items-center justify-center gap-2"
        onClick={() => navigate(`/update-boarding/${boarding._id}`)}
      >
        Resubmit
      </button>
      <Link to="/">
        <div className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
        ✕
      </div></Link>
      </div>;
  }

  return (
    <div>
        {
          isOwner ? <div className="drawer sm:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col sm:items-start sm:justify-start">
              {/* Page content here */}
              <div className="flex items-center justify-between mx-4">
                  <label htmlFor="my-drawer-2" className="btn bg-blue-300 rounded-full drawer-button sm:hidden">
                  <MdDashboardCustomize/>
                  </label>
                  <button className='my-2 flex items-center gap-2 btn sm:hidden rounded-full px-6 bg-green text-white'><FaRegUser />Logout</button>
              </div>
              <div className='mt-5 sm:mt-2 mx-4'>
                  <Outlet />
              </div>
          </div>
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
              <li className='mt-3'><Link to="/owner"><MdDashboard /> Owner Dashboard</Link></li>
              <li><Link to={`/owner/view-boarding/${user.email}`}><FaPlusCircle /> View Hostel</Link></li>
              <li><Link to="/owner/add-listing"><FaPlusCircle /> Add Listing</Link></li>
              <li><Link to="/owner/manage-items"><FaEdit /> Manage Listings</Link></li>
              <li><Link className='mb-3' to="/owner"><FaShoppingBag /> Manage Booking</Link></li>
              <hr/>
              {
                sharedLinks 
              }
              </ul>
          </div>
          </div> : (loading ? <Login/> : isUser ?
          <div className='w-full lg:w-[780px] md:w-[520px] px-2 mx-auto py-4'>
            <div>
              <Link to="/">
              <div className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </div></Link>
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
                          className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        >
                          <option value=''>Pick one</option>
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
          </div>:
          <div className="h-screen flex justify-center items-center">
          <Link to="/">
          <button className="btn bg-green text-white">Back to Home</button>
          </Link>
      </div>
          )
        }
          
          {/*: (loading ? <Modal /> :
            <div className="h-screen flex justify-center items-center">
                <Link to="/">
                <button className="btn bg-green text-white">Back to Home</button>
                </Link>
            </div>
            )}*/}
          
          
    </div>
  )
}

export default OwnerLayout
