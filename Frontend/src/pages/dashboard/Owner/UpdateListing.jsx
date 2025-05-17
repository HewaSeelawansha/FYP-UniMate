import React, { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaUndoAlt, FaUpload, FaSpinner } from 'react-icons/fa';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { Carousel } from "flowbite-react";
import { IoIosArrowBack } from 'react-icons/io';

const UpdateListing = () => {
  const item = useLoaderData();
  const [ltype, setLtype] = useState(item.type);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const lgender = item.gender;
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyMoneyRequired, setKeyMoneyRequired] = useState(item.keyMoney > 0);
  const [keyMoney, setKeyMoney] = useState(item.keyMoney || 0);
  
  const amenitiesList = [
    { id: 'wifi', label: 'WiFi' },
    { id: 'cctv', label: 'CCTV' },
    { id: 'study', label: 'Study Area' },
    { id: 'parking', label: 'Parking' },
    { id: 'gym', label: 'Gym' },
    { id: 'laundry', label: 'Laundry Service' },
    { id: 'kitchen', label: 'Shared Kitchen' },
    { id: 'A/C', label: 'Air Conditioning' },
    { id: 'cleaning', label: 'Room Cleaning' },
    { id: 'elevator', label: 'Elevator' },
    { id: 'security', label: 'Security Guard' },
    { id: 'water', label: 'Hot & Cold Water' },
    { id: 'tv', label: 'TV' },
    { id: 'balcony', label: 'Balcony' },
    { id: 'petfriendly', label: 'Pet Friendly' },
    { id: 'bed', label: 'Bed & Mattress' },
    { id: 'fan', label: 'Ceiling Fan' },
    { id: 'desk', label: 'Study Desk' }
  ];

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      gender: item.gender,
      description: item.description,
      type: item.type,
      price: item.price,
      amenities: item.amenities,
      available: item.available,
      ...amenitiesList.reduce((acc, amenity) => {
        acc[amenity.id] = item.amenities.includes(amenity.label);
        return acc;
      }, {})
    },
  });

  useEffect(() => {
    setKeyMoneyRequired(item.keyMoney > 0);
    setKeyMoney(item.keyMoney || 0);
  }, [item]);

  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imagePreviews.length > 5) {
      Swal.fire({
        icon: 'error',
        title: 'Too many images',
        text: 'You can upload a maximum of 5 images',
        confirmButtonColor: '#16a34a',
      });
      return;
    }
    
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index].preview);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [imagePreviews]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
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

      const selectedAmenities = amenitiesList.filter(amenity => data[amenity.id]).map(amenity => amenity.label);

      const updatedListing = {
        name: data.type + " for " + data.gender,
        gender: data.gender,
        description: data.description,
        type: data.type,
        images: imageUrls,
        amenities: selectedAmenities || item.amenities,
        price: data.price,
        available: data.available,
        keyMoney: keyMoney,
        status: 'Pending',
      };

      const response = await axiosSecure.patch(`/listing/${item._id}`, updatedListing);

      if (response.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Listing Updated Successfully!',
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
        text: error.message || 'An error occurred while updating the listing.',
        showConfirmButton: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => navigate(-1);

  return (
    <div className='w-full mx-auto p-4 sm:p-6'>
      <div className='overflow-hidden'>
        {/* Header */}
        <div className="flex xl:flex-row flex-col items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="xl:mb-0 my-2 flex items-center text-green-600 hover:text-green-700 transition duration-200"
          >
            <IoIosArrowBack className="mr-2" /> Back
          </button>
          <h1 className="mx-2 text-3xl font-bold text-gray-800">
            Update <span className='text-green-600'>{item.name}</span>
          </h1>
          <div className="w-8"></div>
        </div>

        {/* Image Carousel */}
        <div className=''>
          <div className='rounded-lg overflow-hidden bg-gray-100 xl:h-[700px] sm:h-80 md:h-96'>
            <Carousel slideInterval={3000}>
              {item.images.length > 0 ? (
                item.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Listing ${index + 1}`}
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
        <div className='py-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Listing Title */}
            <div className='form-control'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Listing Title
              </label>
              <input
                type='text'
                value={ltype && lgender ? `${ltype} for ${lgender}` : ""}
                disabled
                className='w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Listing Type */}
              <div className='form-control'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Listing Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('type', { required: 'Listing type is required' })}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                  onChange={(e) => setLtype(e.target.value)}
                >
                  <option value="">Select a type</option>
                  <option value='2-Person Shared Room'>2-Person Shared Room</option>
                  <option value='2 to 4-Person Shared Room'>2 to 4-Person Shared Room</option>
                  <option value='1-Person Boarding Room'>1-Person Boarding Room</option>
                  <option value='Whole House-Short Term'>Whole House-Short Term</option>
                  <option value='Whole House-Long Term'>Whole House-Long Term</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              {/* Gender (disabled) */}
              <div className='form-control'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Gender
                </label>
                <input
                  {...register('gender', { required: true })}
                  type='text'
                  defaultValue={item.gender}
                  disabled
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Available Beds */}
              <div className='form-control'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Available Beds <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('available', { 
                    required: 'Available beds is required',
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  type='number'
                  min="1"
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                />
                {errors.available && (
                  <p className="mt-1 text-sm text-red-600">{errors.available.message}</p>
                )}
              </div>

              {/* Price */}
              <div className='form-control'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Price (LKR) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be greater than 0' }
                  })}
                  type='number'
                  min="1"
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
            </div>

            {/* Key Money */}
            <div className="form-control">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Money Requirement
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={keyMoneyRequired ? 'yesk' : 'nok'}
                onChange={(e) => {
                  const isRequired = e.target.value === 'yesk';
                  setKeyMoneyRequired(isRequired);
                  if (!isRequired) setKeyMoney(0);
                }}
              >
                <option value="yesk">Required</option>
                <option value="nok">Not Required</option>
              </select>

              {keyMoneyRequired && (
                <div className="form-control mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Money Amount (LKR)
                  </label>
                  <input
                    type="number"
                    value={keyMoney}
                    onChange={(e) => setKeyMoney(Number(e.target.value))}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className='form-control'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description', { 
                  required: 'Description is required',
                  minLength: { value: 20, message: 'Description must be at least 20 characters' }
                })}
                rows='4'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className='form-control'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Add More Images
              </label>
              <div className='space-y-4'>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {imagePreviews.length}/5 images selected
                  </span>
                  {imagePreviews.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setImagePreviews([])}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>
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
                
                <label className='flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'>
                  <FaUpload className='text-green-600 text-2xl mb-2' />
                  <p className='text-sm text-gray-600'>Click to upload images</p>
                  <p className='text-xs text-gray-500'>JPEG, PNG (Max 5MB each)</p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    multiple
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {/* Amenities */}
            <div className='form-control'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Amenities
              </label>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3'>
                {amenitiesList.map((amenity) => (
                  <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register(amenity.id)}
                      className="border-gray-300 rounded text-green-600 focus:ring-0"
                    />
                    <span className="text-sm text-gray-700">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isSubmitting}
              className={`w-full ${
                isSubmitting ? 'bg-greem-600' : 'bg-green-500 hover:bg-green-600'
              } text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className='animate-spin' /> Updating...
                </>
              ) : (
                <>
                  <FaUpload /> Update Listing
                </>
              )}
            </button>
          </form>

          {/* Go Back Button */}
          <button
            onClick={handleGoBack}
            className='mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2'
          >
            <FaUndoAlt /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateListing;