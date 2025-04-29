import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../contexts/AuthProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useUser from '../../hooks/useUser';
import { FiUser, FiMail, FiCalendar, FiUpload, FiCheckCircle, FiUsers } from 'react-icons/fi';

const UpdateProfile = () => {
  const { user, reloadUser } = useAuth();
  const { updateUserProfile } = useContext(AuthContext);
  const [isUser, isUserLoading] = useUser();
  const { 
    register: registerProfile, 
    handleSubmit: handleProfileSubmit, 
    reset: resetProfile 
  } = useForm();
  
  const { 
    register: registerRoommate, 
    handleSubmit: handleRoommateSubmit, 
    reset: resetRoommate 
  } = useForm();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/';
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
  const axiosSecure = useAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPerson = async () => {
    try {
      const response = await axiosSecure.get(`/users/${user.email}`);
      setPerson(response.data);
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

  const onSubmitProfile = async (data) => {
    setIsSubmitting(true);
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
      } finally {
        setIsSubmitting(false);
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
        window.location.reload();
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Profile Settings
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 col-span-1">
            <div className="bg-green-300 p-6 text-green-800">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img 
                      src={person?.photoURL || 'https://i.ibb.co/nNWV4psx/1x76aqpar8181.webp'} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {person?.photoURL && (
                    <div className="absolute bottom-2 right-2 bg-green-400 rounded-full p-1.5">
                      <FiCheckCircle className="text-white text-lg" />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-center">{person?.name}</h2>
                <p className="text-green-700 mt-1">{user.email}</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-300 p-2 rounded-full flex-shrink-0 mt-1">
                    <FiCalendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Member since</p>
                    <p className="text-gray-900">
                      {new Date(person?.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-300 p-2 rounded-full flex-shrink-0 mt-1">
                    <FiUser className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Account type</p>
                    <p className="text-gray-900 capitalize">{isUser ? "Student" : "Other"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Update Profile Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 col-span-1">
            <div className="bg-green-300 p-6 text-green-800">
              <h2 className="text-2xl font-bold flex items-center">
                <FiUser className="mr-2" />
                Update Profile
              </h2>
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
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                  <div className="flex items-center space-x-4">
                    {/* <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                        <img 
                          src={person?.photoURL || 'https://i.ibb.co/nNWV4psx/1x76aqpar8181.webp'} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div> */}
                    <div className="flex-1">
                      <label className="flex flex-col items-center px-4 py-3 bg-white rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition duration-200">
                        <div className="flex items-center space-x-2">
                          <FiUpload className="text-green-600" />
                          <span className="text-sm text-gray-600">Upload new photo</span>
                        </div>
                        <input
                          {...registerProfile('image')}
                          type="file"
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full text-green-100 bg-green-500 hover:bg-green-600 font-medium py-3 px-4 rounded-lg shadow-md transition duration-200 flex items-center justify-center space-x-2 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiUser className="text-lg" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          
        </div>
        {/* Roommate Preferences */}
        {isUser? (
            <div className="bg-white mt-8 rounded-2xl shadow-xl overflow-hidden border border-gray-200 col-span-1">
              <div className="bg-green-300 p-6 text-green-800">
                <h2 className="text-2xl font-bold flex items-center">
                  <FiUsers className="mr-2" />
                  Roommate Preferences
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Current Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${person?.roommate && person?.gender ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {person?.roommate && person?.gender ? 'Active' : 'Not Set'}
                    </span>
                  </div>
                  {person?.roommate && person?.gender && (
                    <p className="mt-2 text-gray-600">
                      Your profile is visible in the <span className="font-semibold text-green-600">
                        {person?.gender === 'male' ? 'Male' : person?.gender === 'female' ? 'Female' : 'Unisex'}
                      </span> roommate listings.
                    </p>
                  )}
                </div>

                <form onSubmit={handleRoommateSubmit(onSubmitRoommate)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Looking for Roommate?</label>
                      <select
                        {...registerRoommate('roommate', { required: true })}
                        defaultValue={person?.roommate || ''}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                      >
                        <option value="" disabled>Select Option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation For</label>
                      <select
                        {...registerRoommate('gender', { required: true })}
                        defaultValue={person?.gender || ''}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                      >
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="unisex">Unisex</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full text-green-100 bg-green-500 hover:bg-green-600 font-medium py-3 px-4 rounded-lg shadow-md transition duration-200 flex items-center justify-center space-x-2"
                    >
                      <FiUsers className="text-lg" />
                      <span>Update Preferences</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ):(<></>)}
      </div>
    </div>
  );
};

export default UpdateProfile;