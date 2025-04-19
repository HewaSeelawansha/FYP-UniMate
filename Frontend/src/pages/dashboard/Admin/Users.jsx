import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { FaTrashAlt, FaUsers, FaEnvelope, FaUser, FaCalendarAlt } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Link } from 'react-router-dom';
import { FcViewDetails } from 'react-icons/fc';
import Swal from 'sweetalert2';

const Users = () => {
  const axiosSecure = useAxiosSecure()
  const { refetch, data: users = [], isLoading } = useQuery({
    queryKey: ['users'], 
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
  });

  const handleDeleteUser = (user) => {
    Swal.fire({
      title: 'Delete User?',
      text: `Are you sure you want to remove ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${user._id}`).then(res => {
          Swal.fire(
            'Deleted!',
            `${user.name} has been removed.`,
            'success'
          );
          refetch();
        });
      }
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          No Users Found
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          There are currently no users in the system.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full px-4 mx-auto py-8'>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className='text-2xl font-bold'>
            Manage <span className='text-green-600'>Users</span>
          </h2>
          <p className="text-gray-600 mt-2">
            View and manage all system users
          </p>
        </div>
        <div className="bg-green text-white px-4 ml-10 py-2 rounded-lg mt-4 sm:mt-0">
          <span className="font-semibold">Total Users: {users.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {users.map((user, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-400 p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center">
                  <FaUser className="mr-2" />
                  {user.name}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'admin' ? 'bg-blue-500 text-white' :
                  user.role === 'owner' ? 'bg-blue-100 text-blue-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {user.role === 'admin' ? 'Admin' : user.role === 'owner' ? 'Owner' : 'Student'}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaEnvelope className="text-green-500 mr-3 w-5" />
                  <span className="text-gray-700">{user.email}</span>
                </div>
                
                <div className="flex items-center">
                  <FaCalendarAlt className="text-green-500 mr-3 w-5" />
                  <span className="text-gray-700">
                    Joined: {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 mt-4 border-t">
                <Link 
                  to={`/dashboard/view-user/${user.email}`}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
                >
                  <FcViewDetails className="w-5 h-5 mr-1" />
                  <span>View Details</span>
                </Link>

                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handleDeleteUser(user)}
                    className="flex items-center text-white bg-rose-600 hover:bg-rose-700 px-3 py-1 rounded-lg transition duration-200"
                  >
                    <FaTrashAlt className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Users