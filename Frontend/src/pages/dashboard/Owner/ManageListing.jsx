import React from 'react'
import useMenu from '../../../hooks/useMenu'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { FcViewDetails } from "react-icons/fc";
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useMyListing from '../../../hooks/useMyListing'

const ManageListing = () => {
  const [mylist, loading, refetch] = useMyListing();
  const axiosSecure = useAxiosSecure();

  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/listing/${item._id}`);
       if(res) {
        refetch();
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500
          });
       }
      }
    });
  };

  if (mylist.length<=0) {
    return (
    <div className='w-full lg:w-[780px] md:w-[520px] px-2 mx-auto py-4'>
        <h2 className='text-3xl font-bold text-center'>No Existing Listings! Please <Link to='/owner/add-listing'><button className='text-green underline'>Add New Listing</button></Link></h2>
    </div>
  )}
  
  return (
    <div className='w-full lg:w-[920px] md:w-[620px] px-4 mx-auto'>
      <h2 className='text-3xl font-bold my-4'>
        Manage Existing <span className='text-green'>Listings</span>
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
                <th>Prices</th>
                <th>View</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
            </thead>
            <tbody>
            {
                mylist.map((item, index) => (
                    <tr key={index}>
                        <th>{index + 1}</th>
                        <td>
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle h-12 w-12">
                                    {item.images && item.images.length > 0 ? (
                                      <img src={item.images[0]} alt="First Image" />
                                    ) : (
                                      <p>No image available</p>
                                    )}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td>
                          <Link to={`/owner/view-listing/${item._id}`}><button className='btn btn-sm btn-circle text-green bg-black'><FcViewDetails/></button></Link>
                        </td>
                        <td>
                        <Link to={`/owner/update-listing/${item._id}`}><button className='btn btn-sm btn-circle text-white bg-indigo-600'><FaEdit/></button></Link>
                        </td>
                        <td>
                        <button onClick={() => handleDelete(item)} className='btn btn-sm btn-circle bg-black text-rose-600'><FaTrashAlt/></button>
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

export default ManageListing
