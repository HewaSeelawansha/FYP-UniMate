import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../contexts/AuthProvider';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useUser from '../../hooks/useUser';
import useAuth from '../../hooks/useAuth';
import { FaUserEdit, FaUserFriends, FaUpload, FaCheckCircle } from 'react-icons/fa';

const UpdateProfile = () => {
  const { user } = useAuth();
  const { updateUserProfile } = useContext(AuthContext);
  const [isUser, isUserLoading] = useUser();
  const { 
    register: registerProfile, 
    handleSubmit: handleProfileSubmit, 
    reset: resetProfile,
    formState: { errors: profileErrors }
  } = useForm();
  
  const { 
    register: registerRoommate, 
    handleSubmit: handleRoommateSubmit, 
    reset: resetRoommate,
    formState: { errors: roommateErrors }
  } = useForm();

  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
  const axiosSecure = useAxiosSecure();

  const fetchPerson = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${user.email}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
      const data = await response.json();
      setPerson(data);
      setImagePreview(data?.photoURL || null);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerson();
  }, [user.email]);

  const refetchPerson = () => {
    setLoading(true);
    fetchPerson();
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitProfile = async (data) => {
    const imageFile = data.image[0];
    let photoURL = user.photoURL; 

    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      try {
        const response = await fetch(image_hosting_api, { method: 'POST', body: formData });
        const result = await response.json();
        if (result.success) {
          photoURL = result.data.display_url;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Image Upload Failed',
            text: 'Failed to upload image. Please try again.',
          });
          return;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        Swal.fire({
          icon: 'error',
          title: 'Image Upload Failed',
          text: 'An error occurred while uploading the image.',
        });
        return;
      }
    }

    const name = data.name;
    try {
      await updateUserProfile(name, photoURL);
      const updateResponse = await axiosSecure.patch(`/users/update/${person._id}`, {
        name,
        photoURL,
      });
      if (updateResponse.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Profile Updated Successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        resetProfile();
        refetchPerson();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating the profile.',
      });
    }
  };

  const onSubmitRoommate = async (data) => {
    try {
      const updateResponse = await axiosSecure.patch(`/users/roommate/${person._id}`, {
        roommate: data.roommate,
        gender: data.gender,
      });
      if (updateResponse.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Roommate Preference Updated Successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        resetRoommate();
        refetchPerson();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating the roommate preference.',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 md:text-5xl">
            Update Your Profile
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Keep your information up to date for better experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-green to-green p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <img 
                      src={imagePreview || person?.photoURL || 'https://i.ibb.co/nNWV4psx/1x76aqpar8181.webp'} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {person?.photoURL && (
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                      <FaCheckCircle className="text-white text-lg" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{person?.name}</h2>
                  <p className="text-orange-100">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member since</p>
                    <p className="font-medium">{new Date(person?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account type</p>
                    <p className="font-medium capitalize">{isUser ? "Student" : "Other"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Update Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-green to-green p-6 text-white">
              <div className="flex items-center space-x-3">
                <FaUserEdit className="text-2xl" />
                <h2 className="text-2xl font-bold">Update Profile</h2>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleProfileSubmit(onSubmitProfile)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    {...registerProfile('name', { required: 'Name is required' })}
                    type="text"
                    placeholder="Your name"
                    defaultValue={person?.name}
                    className={`mt-1 block w-full px-4 py-3 border ${profileErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                  />
                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                        <img 
                          src={imagePreview || person?.photoURL || 'https://i.ibb.co/nNWV4psx/1x76aqpar8181.webp'} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="flex flex-col items-center px-4 py-3 bg-white rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                        <FaUpload className="text-orange-500 mb-1" />
                        <span className="text-sm text-gray-600">Click to upload</span>
                        <input
                          {...registerProfile('image')}
                          type="file"
                          className="hidden"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-green hover:bg-orange-500 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                  >
                    <FaUserEdit />
                    <span>Update Profile</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Roommate Preference Section */}
        {isUser && (
          <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-green to-green p-6 text-white">
              <div className="flex items-center space-x-3">
                <FaUserFriends className="text-2xl" />
                <h2 className="text-2xl font-bold">Roommate Preferences</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Current Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${person?.roommate && person?.gender ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {person?.roommate && person?.gender ? 'Active' : 'Not Set'}
                  </span>
                </div>
                {person?.roommate && person?.gender && (
                  <p className="mt-2 text-gray-600">
                    Your profile is visible in the <span className="font-semibold text-orange-600">
                      {person?.gender === 'male' ? 'Male' : person?.gender === 'female' ? 'Female' : 'Unisex'}
                    </span> roommate listings.
                  </p>
                )}
              </div>

              <form onSubmit={handleRoommateSubmit(onSubmitRoommate)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Looking for Roommate?</label>
                    <select
                      {...registerRoommate('roommate', { required: 'This field is required' })}
                      defaultValue={person?.roommate || ''}
                      className={`mt-1 block w-full px-4 py-3 border ${roommateErrors.roommate ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                    >
                      <option value="" disabled>Select Option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {roommateErrors.roommate && (
                      <p className="mt-1 text-sm text-red-600">{roommateErrors.roommate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation For</label>
                    <select
                      {...registerRoommate('gender', { required: 'This field is required' })}
                      defaultValue={person?.gender || ''}
                      className={`mt-1 block w-full px-4 py-3 border ${roommateErrors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="unisex">Unisex</option>
                    </select>
                    {roommateErrors.gender && (
                      <p className="mt-1 text-sm text-red-600">{roommateErrors.gender.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-green hover:bg-orange-500 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                  >
                    <FaUserFriends />
                    <span>Update Preferences</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;