import React, { useState } from 'react'
import useBoarding from '../../../hooks/useBoarding'
import { FaEdit, FaTrashAlt, FaPhone, FaUser, FaVenusMars } from 'react-icons/fa'
import { FcViewDetails } from "react-icons/fc";
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const ManageBoardings = () => {
  const [boarding, loading, refetch] = useBoarding();
  const axiosSecure = useAxiosSecure();
  const [nstatus, setNstatus] = useState('Pending');

  const handleStatus = async (item) => {
    const data = {
      status: nstatus || item.status,
    };

    try {
      const response = await axiosSecure.patch(`/boarding/status/${item._id}`, data);

      if (response.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Status Updated Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'An error occurred while updating the status.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading boarding houses...</p>
        </div>
      </div>
    );
  }

  if (boarding.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          No Boarding Houses Found
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          You haven't uploaded any boarding houses yet.
        </p>
      </div>
    );
  }
  
  return (
    <div className='w-full px-4 mx-auto py-8'>
      <h2 className='text-3xl font-bold mb-8'>
        Manage Uploaded <span className='text-green-600'>Boarding Houses</span>
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {boarding.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-100">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-green to-green p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  item.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="md:w-1/4">
                  <div className="rounded-lg overflow-hidden h-40 w-full">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="md:w-3/4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <FaPhone className="text-green-500 mr-2" />
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{item.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <FaVenusMars className="text-green-500 mr-2" />
                      <span className="font-medium">Gender:</span>
                      <span className="ml-2 capitalize">{item.gender}</span>
                    </div>
                    <div className="flex items-center">
                      <FaUser className="text-green-500 mr-2" />
                      <span className="font-medium">Owner:</span>
                      <span className="ml-2">{item.owner}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <Link 
                      to={`/dashboard/view-boarding/${item.owner}`}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
                    >
                      <FcViewDetails className="w-5 h-5 mr-1" />
                      <span>View Details</span>
                    </Link>

                    <div className="flex items-center space-x-2">
                      <select
                        className="rounded-lg border-gray-300 text-sm focus:ring-green-500 focus:border-green-500"
                        onChange={(e) => setNstatus(e.target.value)}
                        defaultValue={item.status}
                      >
                        <option value='Pending'>Pending</option>
                        <option value='Approved'>Approved</option>
                        <option value='Rejected'>Rejected</option>
                      </select>
                      <button 
                        onClick={() => handleStatus(item)} 
                        className="bg-green hover:bg-orange-500 text-white px-3 py-1 rounded-lg flex items-center"
                      >
                        <FaEdit className="mr-1" />
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageBoardings