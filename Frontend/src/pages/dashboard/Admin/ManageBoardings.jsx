import React, { useState } from 'react'
import useBoarding from '../../../hooks/useBoarding'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { RiEditBoxFill } from "react-icons/ri";
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
  
  return (
    <div className='w-full lg:w-[920px] md:w-[620px] px-2 mx-auto py-4'>
      <h2 className='text-3xl font-bold mb-8'>
        Manage Uploaded <span className='text-green'>Boarding Houses</span>
      </h2>
      {/* menu items */}
      <div>
      <div className="overflow-x-auto">
        <table className="table">
            {/* head */}
            <thead className='bg-green text-white'>
            <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Owner</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>View</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {
                boarding.map((item, index) => (
                    <tr key={index}>
                        <th>{index + 1}</th>
                        <td>
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle h-12 w-12">
                                        <img
                                        src={item.images[0]}
                                        alt="Avatar Tailwind CSS Component" />
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>{item.name}</td>
                        <td>{item.owner}</td>
                        <td>{item.phone}</td>
                        <td>{item.gender}</td>
                        <td>
                          <Link to={`/dashboard/view-boarding/${item.owner}`}><button className='btn btn-sm btn-circle text-green bg-black'><FcViewDetails/></button></Link>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <select
                            className='mr-2 rounded-full text-xs'
                            onChange={(e) => setNstatus(e.target.value)}
                            defaultValue={item.status}
                            >
                              <option value='Pending'>Pending</option>
                              <option value='Approved'>Approved</option>
                              <option value='Rejected'>Rejected</option>
                            </select>
                            <button onClick={() => handleStatus(item)} className='btn btn-sm btn-circle bg-blue-500 text-white'><FaEdit /></button>
                          </div>
                        </td>
                    </tr>
                ))
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageBoardings
