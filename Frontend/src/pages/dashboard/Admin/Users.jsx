import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { FaTrashAlt, FaUsers } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Link } from 'react-router-dom';
import { FcViewDetails } from 'react-icons/fc';
const token = localStorage.getItem('access-token');

const Users = () => {
  const axiosSecure = useAxiosSecure()
  const { refetch, data: users = []} = useQuery({
    queryKey: ['users',], 
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
  });
  //console.log(users)
  const handleMakeAdmin = user => {
    axiosSecure.patch(`/users/owner/${user._id}`).then(res => {
      alert(`${user.name} is now admin`);
      refetch();
    });
  }
  //delete users
  const handleDeleteUser = user => {
    axiosSecure.delete(`/users/${user._id}`).then(res => {
      alert(`${user.name} is removed from database`);
      refetch();
    })
  }

  return (
    <div className='w-full lg:w-[920px] md:w-[620px] lg:px-4 md:pr-2 mx-auto'>
      <h2 className='text-2xl font-bold my-4'>
        Manage Existing <span className='text-green'>Users</span>
      </h2>
      <div className='flex flex-row items-center justify-between mb-4 gap-4'>
        <h5>All Users</h5>
        <h5>Total Users: {users.length}</h5>
      </div>
      {/* table */}
      <div>
        <div>
          <table className="table table-zebra">
            {/* head */}
            <thead className='bg-green font-extrabold text-white rounded'>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined on</th>
                <th>View</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {
                users.map((user, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className = {user.role === 'admin' ? 'text-green font-bold' : user.role === 'owner' ? 'text-blue-500 font-semibold' : user.role === 'user' ? 'text-emerald-500 font-semibold':''}>
                    {
                      user.role === 'admin' ? 'Admin (You)' : user.role === 'owner' ? 'Owner' : 'Student'
                    }
                  </td>
                  {/*<button onClick={() => handleMakeAdmin(user)} className='btn btn-xs btn-circle text-white bg-indigo-600'><FaUsers/></button>*/}
                  <td>{new Date(user?.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/dashboard/view-user/${user.email}`}><button className='btn btn-sm btn-circle text-green bg-black'><FcViewDetails/></button></Link>
                  </td>
                  <td><button onClick={() => handleDeleteUser(user)} className='btn btn-sm btn-circle bg-black text-rose-600'><FaTrashAlt/></button></td>
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

export default Users
