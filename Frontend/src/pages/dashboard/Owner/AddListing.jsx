import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUpload } from 'react-icons/fa';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AddListing = () => {
  const {user} = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ltype, setLtype] = useState("");
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [keyMoneyRequired, setKeyMoneyRequired] = useState(false);

  //const boarding = "LPC Hostels";
  const owner = user.email;
  const listingtitle = ltype && boarding?.gender ? `${ltype} for ${boarding?.gender}` : "";

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:3000/boarding/owner/${owner}`);
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
  
    fetchListing();
  }, [owner]);

  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const amenitiesList = ["wifi", "cctv", "study area", "parking", "gym"];

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

      const menuItem = {
        boarding: boarding.name,
        owner: user.email,
        name: data.type + " for " + data.gender,
        gender: data.gender,
        description: data.description,
        type: data.type,
        images: imageUrls,
        amenities: selectedAmenities,
        price: data.price,
        keyMoney: data.kmoney,
        available: data.available,
      };

      const postMenuItem = await axiosSecure.post('/listing', menuItem);

      if (postMenuItem.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Successfully Uploaded',
          showConfirmButton: false,
          timer: 1500,
        });
        setLtype("");
        reset();
        navigate('/owner/manage-items');
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
        Resubmit the Boarding House
      </button>
      </div>;
  }

  if (!boarding) {
    return (
      <div className='w-full lg:w-[780px] md:w-[520px] px-2 mx-auto py-4'>
        <h2 className='text-3xl font-bold text-center'>Please Add Your <button onClick={() => navigate('/owner/add-boarding')} className='text-green underline'>Boarding House</button> Before Add Listings</h2>
      </div>
    );
  }

  return (
    <div className='w-full lg:w-[780px] md:w-[520px] px-2 mx-auto'>
      <h2 className='text-3xl font-bold my-4'>
        Upload A New <span className='text-green'>Listing</span>
      </h2>
      <div className='bg-gray-100 p-6 rounded-lg shadow-lg'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-6'>
            <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Boarding
              </label>
              <input
                type='text'
                defaultValue={boarding.name}
                disabled
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Owner
              </label>
              <input
                type='text'
                defaultValue={owner}
                disabled
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Listing Title
              </label>
              <input
                type='text'
                placeholder='Pick a type to generate'
                defaultValue={listingtitle}
                disabled
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            {/*<div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Name of the Item*
              </label>
              <input
                {...register('name', { required: true })}
                type='text'
                placeholder='Name'
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>*/}

            <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Pick a Type
              </label>
              <select
                {...register('type', { required: true })}
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                defaultValue=''
                onChange={(e) => setLtype(e.target.value)}
              >
                <option value='' disabled>Pick one</option>
                <option value='2-Person Shared Room'>2-Person Shared Room</option>
                <option value='2 to 4-Person Shared Room'>2 to 4-Person Shared Room</option>
                <option value='1-Person Boarding Room'>1-Person Boarding Room</option>
                <option value='Whole House-Short Term'>Whole House-Short Term</option>
                <option value='Whole House-Long Term'>Whole House-Long Term</option>
              </select>
            </div>

            <div className='flex gap-4'>
              <div className='form-control w-full'>
                <label className='block text-sm font-medium mb-2'>
                  Gender
                </label>
                <input
                {...register('gender', { required: true })}
                type='text'
                defaultValue={boarding.gender}
                disabled
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
              />
              </div>

              <div className='form-control w-full'>
                <label className='block text-sm font-medium mb-2'>
                  Available Beds
                </label>
                <input
                  {...register('available', { required: true })}
                  type='number'
                  defaultValue={boarding.beds}
                  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div>
            </div>

            <div className='form-control w-full'>
                <label className='block text-sm font-medium mb-2'>
                  Price
                </label>
                <input
                  {...register('price', { required: true })}
                  type='number'
                  placeholder='Price'
                  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div>

              <div className='form-control'>
                <label className='block text-sm font-medium mb-2'>
                  Key Money
                </label>
                <select
                  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  defaultValue=''
                  onChange={(e) => setKeyMoneyRequired(e.target.value === 'yesk')}
                >
                  <option value='' disabled>Pick one</option>
                  <option value='yesk'>Required</option>
                  <option value='nok'>Not Required</option>
                </select>

                {keyMoneyRequired && (
                  <div className='form-control w-full mt-4'>
                    <label className='block text-sm font-medium mb-2'>
                      You selected 'Key Money Required' Please specify the amount.
                    </label>
                    <input
                      {...register('kmoney')}
                      type='number'
                      placeholder='Key Money'
                      className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    />
                  </div>
                )}
              </div>

            <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Description
              </label>
              <textarea
                {...register('description', { required: true })}
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                placeholder='Description of the Listing'
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

            <button className='w-full bg-green text-white px-4 py-2 rounded-lg hover:bg-sky-300 hover:text-black transition duration-300 flex items-center justify-center gap-2'>
              Upload <FaUpload />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListing;