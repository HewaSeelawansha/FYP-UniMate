import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUpload, FaHome, FaUser, FaMoneyBillWave, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AddListing = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ltype, setLtype] = useState("");
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [keyMoneyRequired, setKeyMoneyRequired] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const owner = user.email;
  const listingtitle = ltype && boarding?.gender ? `${ltype} for ${boarding?.gender}` : "";

  useEffect(() => {
    const fetchBoarding = async () => {
      try {
        const response = await axiosSecure.get(`/boarding/owner/${owner}`);
        setBoarding(response.data); 
      } catch (error) {
        console.error("Error fetching boarding:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBoarding();
  }, [owner]);

  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const amenitiesList = [
    { id: 'wifi', label: 'WiFi' },
    { id: 'cctv', label: 'CCTV' },
    { id: 'study', label: 'Study Area' },
    { id: 'parking', label: 'Parking' },
    { id: 'gym', label: 'Gym' }
  ];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
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

      const newItem = {
        boarding: boarding?.name,
        distance: boarding?.distance,
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

      const postNewItem = await axiosSecure.post('/listing', newItem);

      if (postNewItem.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Listing Created Successfully!',
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
        text: error.message || 'An error occurred while creating the listing.',
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
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (boarding?.status !== "Approved") {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Boarding House Status: <span className="text-green-600">{boarding?.status}</span>
          </h2>
          <p className="text-gray-600 mb-6">
            {boarding?.status === "Pending" 
              ? "Your boarding house is under review. Please wait for approval before adding listings."
              : "Please update your boarding house details for approval."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-300 flex items-center gap-2"
              onClick={() => navigate(`/owner/update-boarding/${boarding._id}`)}
            >
              Update Boarding House
            </button>
            <button 
              onClick={() => navigate('/')}
              className="btn btn-outline border-green-600 text-green-600 hover:bg-orange-50 px-6 py-3 rounded-lg transition duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!boarding) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Boarding House Found</h2>
          <p className="text-gray-600 mb-6">You need to register your boarding house before adding listings.</p>
          <button
            onClick={() => navigate('/owner/add-boarding')}
            className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2"
          >
            <FaHome /> Register Boarding House
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="">
        <div className="flex xl:flex-row flex-col items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="xl:mb-0 my-2 flex items-center text-green-600 hover:text-green-700 transition duration-200"
          >
            <IoIosArrowBack className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Create New <span className="text-green-500">Listing</span>
          </h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Boarding Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaHome className="text-green-500 mr-2" /> Boarding Name
                </label>
                <input
                  type="text"
                  defaultValue={boarding.name}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaUser className="text-green-500 mr-2" /> Owner Email
                </label>
                <input
                  type="text"
                  defaultValue={owner}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaInfoCircle className="text-green-500 mr-2" /> Listing Title
              </label>
              <input
                type="text"
                placeholder="Will be generated after selecting type"
                defaultValue={listingtitle}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-100"
              />
            </div>

            {/* Listing Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type*</label>
                <select
                  {...register('type', { required: 'Listing type is required' })}
                  className={`w-full px-4 py-3 border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  defaultValue=""
                  onChange={(e) => setLtype(e.target.value)}
                >
                  <option value="" disabled>Select Listing Type</option>
                  <option value="2-Person Shared Room">2-Person Shared Room</option>
                  <option value="2 to 4-Person Shared Room">2 to 4-Person Shared Room</option>
                  <option value="1-Person Boarding Room">1-Person Boarding Room</option>
                  <option value="Whole House-Short Term">Whole House-Short Term</option>
                  <option value="Whole House-Long Term">Whole House-Long Term</option>
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <input
                  {...register('gender', { required: true })}
                  type="text"
                  defaultValue={boarding.gender}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Beds*</label>
                <input
                  {...register('available', { 
                    required: 'Available beds is required',
                    min: { value: 1, message: 'Must have at least 1 bed' }
                  })}
                  type="number"
                  defaultValue={boarding.beds}
                  className={`w-full px-4 py-3 border ${errors.available ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                />
                {errors.available && <p className="mt-1 text-sm text-red-600">{errors.available.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price (LKR)*</label>
                <input
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be greater than 0' }
                  })}
                  type="number"
                  placeholder="Enter monthly price"
                  className={`w-full px-4 py-3 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
              </div>
            </div>

            {/* Key Money Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Money Required?</label>
              <select
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                defaultValue=""
                onChange={(e) => setKeyMoneyRequired(e.target.value === 'yesk')}
              >
                <option value="" disabled>Select Option</option>
                <option value="yesk">Yes</option>
                <option value="nok">No</option>
              </select>

              {keyMoneyRequired && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Money Amount (LKR)</label>
                  <input
                    {...register('kmoney', { 
                      required: keyMoneyRequired ? 'Key money amount is required' : false,
                      min: { value: 0, message: 'Amount cannot be negative' }
                    })}
                    type="number"
                    placeholder="Enter key money amount"
                    className={`w-full px-4 py-3 border ${errors.kmoney ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.kmoney && <p className="mt-1 text-sm text-red-600">{errors.kmoney.message}</p>}
                </div>
              )}
            </div>

            {/* Description Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                placeholder="Describe this listing (facilities, rules, special features etc.)"
                rows="4"
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            {/* Images Section */}
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

            {/* Amenities Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {amenitiesList.map((amenity) => (
                  <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register(amenity.id)}
                      className="checkbox checkbox-sm border-gray-300 rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${
                  isSubmitting ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'
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
                  <FaUpload /> Submit Listing
                </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddListing;