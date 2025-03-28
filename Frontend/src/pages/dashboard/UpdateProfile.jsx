import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../contexts/AuthProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useUser from '../../hooks/useUser';

const UpdateProfile = () => {
  const { user } = useAuth();
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
  const axiosSecure = useAxiosSecure(); // Use the axiosSecure instance

  const fetchPerson = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${user.email}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
      const data = await response.json();
      setPerson(data);
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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col gap-2 items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-gray-200 rounded-lg shadow-3xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Profile Information */}
        <div className="bg-black text-white p-8 flex flex-col items-center justify-center md:w-2/5">
          <div className="avatar">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green">
              <img src={person?.photoURL || 'https://i.ibb.co/nNWV4psx/1x76aqpar8181.webp'} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mt-4">{person?.name}</h3>
          <p className="text-sm mt-2"><strong>e-mail: </strong>{user.email}</p>
          <p className="text-sm mt-2">
            <strong>Registered on: </strong>{new Date(person?.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Right Side: Update Form */}
        <div className="p-8 flex-1 relative bg-blue-200">
          {/* Close Button with Responsive Positioning */}

          <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Profile</h2>
          <form onSubmit={handleProfileSubmit(onSubmitProfile)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                {...registerProfile('name', { required: true })}
                type="text"
                placeholder="Your name"
                defaultValue={person?.name}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green focus:border-green"
              />
            </div>

            <div className='form-control'>
              <label className='block text-sm font-medium mb-2'>
                Add Images
              </label>
              <input
                {...registerProfile('image')}
                type='file'
                className='w-full file-input file-input-bordered'
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-green text-white px-4 py-2 rounded-lg hover:bg-sky-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* for the roommte selection */}
      {isUser?(
      <div className="max-w-4xl w-full bg-black rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">
      {/* Right Side: Update Form */}
      <div className="p-8 flex-1 relative">
        <h2 className="text-2xl font-semibold text-white mb-2">
        Need a Roommate?
        </h2>
        <p className="font-bold text-lg text-gray-400 mb-6">
            Status: 
            <span className={`ml-2 ${person?.roommate ? 'text-blue-500' : 'text-rose-500'}`}>
              {person?.roommate&&person?.gender ? 'Defined' : 'Not defined yet'} 
            </span>
            <span className='font-normal'>{person?.roommate&&person?.gender ? ` "You will be appeared in the listings for - ${person?.gender==='male'?'boys':person?.gender==='female'?'girls':person?.gender}"` : ''}</span>
        </p>

        <form onSubmit={handleRoommateSubmit(onSubmitRoommate)} className="space-y-6">
          
        <div className='flex gap-4'>
          <div className='form-control w-full'>
            <label className='block text-white text-sm font-medium mb-1'>
              Preference?
            </label>
            <select
                {...registerRoommate('roommate', { required: true })}
                defaultValue={person?.roommate ? person.roommate : ''}
                className='w-full bg-gray-300 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
              >
                <option value='' disabled>Select Your Preference</option>
                <option value='yes'>Yes</option>
                <option value='no'>No</option>
              </select>
          </div>

          <div className='form-control w-full'>
            <label className='block text-white text-sm font-medium mb-1'>
              Accommodation for?
            </label>
            <select
                {...registerRoommate('gender', { required: true })}
                defaultValue={person?.gender ? person.gender : ''}
                className='w-full bg-gray-300 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
              >
                <option value='' disabled>Select Your Gender</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='unisex'>Unisex</option>
              </select>
          </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-secondary text-white px-4 py-2 rounded-lg hover:bg-sky-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2"
            >
              Set or Update Your Preference
            </button>
          </div>
        </form>
      </div>
    </div>
      ):(<></>)}
    </div>
  );
};

export default UpdateProfile;