import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAdmin from '../hooks/useAdmin';
import { FaUser, FaEnvelope, FaCalendarAlt, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { IoIosArrowBack } from 'react-icons/io';

const SingleUser = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin] = useAdmin();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const response = await axiosSecure.get(`/users/${email}`);
        setPerson(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerson();
  }, [email]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDeleteUser = () => {
    Swal.fire({
      title: 'Delete User?',
      text: `Are you sure you want to remove ${person.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${person._id}`).then(res => {
          Swal.fire(
            'Deleted!',
            `${person.name} has been removed.`,
            'success'
          );
          navigate('/dashboard/users');
        });
      }
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          User Not Found
        </h2>
        <button 
          onClick={handleGoBack}
          className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 mx-auto py-8">
      <div className="flex xl:flex-row flex-col items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="xl:mb-0 my-2 flex items-center text-green-600 hover:text-green-700 transition duration-200"
        >
          <IoIosArrowBack className="mr-2" /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          User <span className="text-green-500">Details</span>
        </h1>
        <div className="w-8"></div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green to-green p-6 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 md:mb-0 md:mr-6">
              <img 
                src={person?.photoURL || 'https://i.ibb.co/tPJnyqL1/btmn.jpg'} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{person?.name}</h3>
              <div className={`mt-2 px-3 py-1 rounded-full inline-flex items-center ${
                person.role === 'admin' ? 'bg-green-100 text-green-800' :
                person.role === 'owner' ? 'bg-blue-100 text-blue-800' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                <FaUser className="mr-2" />
                <span className="font-medium">
                  {person?.role === 'user' ? 'Student' : 
                   person?.role === 'admin' ? 'Admin' : 
                   person?.role === 'owner' ? 'Owner' : person?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-300 p-3 rounded-full mr-4">
                <FaEnvelope className="text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p className="text-gray-800">{person?.email}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-300 p-3 rounded-full mr-4">
                <FaCalendarAlt className="text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Joined On</h4>
                <p className="text-gray-800">
                  {new Date(person?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            {isAdmin && person?.role !== 'admin' && (
              <button
                onClick={handleDeleteUser}
                className="btn w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center justify-center"
              >
                <FaTrashAlt className="mr-2" />
                Delete User
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUser;