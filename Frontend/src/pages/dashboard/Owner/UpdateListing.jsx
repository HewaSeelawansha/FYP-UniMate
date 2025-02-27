import React, { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaUndoAlt, FaUpload } from 'react-icons/fa';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { Carousel } from "flowbite-react";

const UpdateListing = () => {
  const item = useLoaderData();
  const [ltype, setLtype] = useState(item.type);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const lgender = item.gender;
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      gender: item.gender,
      description: item.description,
      type: item.type,
      price: item.price,
      amenities: item.amenities,
      available: item.available,
    },
  });
  const [keyMoneyRequired, setKeyMoneyRequired] = useState(item.keyMoney > 0);
  const [keyMoney, setKeyMoney] = useState(item.keyMoney || 0);
  useEffect(() => {
    // Initialize the form state based on the boarding data
    setKeyMoneyRequired(item.keyMoney > 0);
    setKeyMoney(item.keyMoney || 0);
  }, [item]);

  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
  
  const amenitiesList = ["wifi", "cctv", "study area", "parking", "gym"];

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

    const selectedAmenities = amenitiesList.filter(amenity => data[amenity]);

    const updatedListing = {
      name: data.type + " for " + data.gender,
      gender: data.gender,
      description: data.description,
      type: data.type,
      images: imageUrls,
      amenities: selectedAmenities,
      price: data.price,
      available: data.available,
      keyMoney:keyMoney
    };

    try {
      const response = await axiosSecure.patch(`/listing/${item._id}`, updatedListing);

      if (response.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Listing Updated Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/owner/manage-items');
      }
    } catch (error) {
      console.error('Error updating listing:', error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating the listing.',
        showConfirmButton: true,
      });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='w-full lg:w-[780px] md:w-[520px] px-2 mx-auto'>
      <h2 className='text-3xl font-bold my-4'>
        Update Listing <span className='text-green'>{item.name}</span>
      </h2>
      <div className="p-0.5 rounded-lg bg-green my-5 h-[500px] sm:h-[400px] xl:h-[600px] 2xl:h-[700px]">
      <Carousel slideInterval={3000}>
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
      <div className='bg-white p-6 rounded-lg shadow-lg'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-6'>

          <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Listing Title
              </label>
              <input
                type='text'
                value={ltype && lgender ? `${ltype} for ${lgender}` : ""}
                disabled
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Pick a Type
              </label>
              <select
                {...register('type', { required: true })}
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                onChange={(e) => setLtype(e.target.value)}
              >
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
                defaultValue={item.gender}
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
                  placeholder='Available Beds'
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

              <div className="form-control">
              <label className="block text-sm font-medium mb-2">
                Key Money
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={keyMoneyRequired ? 'yesk' : 'nok'}
                onChange={(e) => {
                  const isRequired = e.target.value === 'yesk';
                  setKeyMoneyRequired(isRequired);
                  if (!isRequired) {
                    setKeyMoney(0); // Reset keyMoney if not required
                  }
                }}
              >
                <option value="" disabled>
                  Pick one
                </option>
                <option value="yesk">Required</option>
                <option value="nok">Not Required</option>
              </select>

              {keyMoneyRequired && (
                <div className="form-control w-full mt-4">
                  <label className="block text-sm font-medium mb-2">
                    You selected 'Key Money Required.' Please specify the amount.
                  </label>
                  <input
                    type="number"
                    placeholder="Key Money"
                    value={keyMoney}
                    onChange={(e) => setKeyMoney(Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                placeholder='Description'
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

            <button className='w-full bg-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2'>
              Update <FaUpload />
            </button>

          </div>
        </form>
        <button onClick={handleGoBack} className="my-5 w-full bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 flex items-center justify-center gap-2">
          Go Back <FaUndoAlt />
        </button>
      </div>
    </div>
  );
};

export default UpdateListing;