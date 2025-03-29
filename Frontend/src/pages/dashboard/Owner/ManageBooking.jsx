import React, { useEffect, useState } from 'react'
import { FaEdit, FaFilter, FaTrashAlt } from 'react-icons/fa'
import { FcViewDetails } from "react-icons/fc";
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useAuth from '../../../hooks/useAuth';
import useMyListing from '../../../hooks/useMyListing';

const ManageBooking = () => {
  const [mylist, listingLoading] = useMyListing();
  const {user} = useAuth();
  const [bookings, setBookings] = useState([]);
  const axiosSecure = useAxiosSecure();
  const [nstatus, setNstatus] = useState('Pending');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);

  const fetchBooking = async () => {
    try {
    const response = await fetch(`http://localhost:3000/booking/owner/${user.email}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch bookings`);
    }
    const data = await response.json();
    setBookings(data.bookings); 
    } catch (error) {
    console.error("Error fetching bookings:", error);
    } finally {
    setLoading(false);
    }
  };

  useEffect(() => {
      fetchBooking();
  }, []);

  useEffect(() => {
    setFilteredItems(bookings);
  }, [bookings]);

  const refetchReview = () => {
      setLoading(true);
      fetchBooking();
  }

  const handleStatus = async (item) => {
    const data = {
      status: nstatus || item.status,
    };
    try {
      const response = await axiosSecure.patch(`/booking/status/${item._id}`, data);
      if (response.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Status Updated Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        refetchReview();
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

  const filterItems = (type) => {
    if (type === "all") {
      setFilteredItems(bookings); // Show all bookings
    } else {
      const filtered = bookings.filter((item) => item.listing._id === type);
      setFilteredItems(filtered);
    }
    setSelectedCategory(type);
  };

  const showAll = () => {
    setFilteredItems(hostel);
    setSelectedCategory("all");
  }
  
  return (
    <div className='w-full xl:w-[1200px] lg:w-[790px] md:w-[620px] px-2 mx-auto py-4'>
        <h2 className='text-3xl font-bold mb-4'>
          Manage <span className='text-green'>Bookings</span>
        </h2>
        <div className="text-left">
          <div className='flex flex-col md:flex-row flex-wrap md:justify-start items-start space-y-3 mb-6'> 
            {/*sort*/}
            <div className='flex justify-end rounded-sm'> 
              <div className='bg-green p-2'>
                <FaFilter className='h-4 w-4 text-black'/>
              </div>
              {/*render bookings*/}
              <select
                name="sort"
                id="sort"
                className="bg-black text-white px-2 py-1 rounded-sm"
                onChange={(e) => filterItems(e.target.value)} // Change onClick to onChange
              >
                <option value="all">Bookings for All Listings</option>
                {mylist.map((item) => (
                  <option key={item._id} value={item._id}>{item.name}</option>
                ))}
              </select>
          </div>
        </div>
      {/* menu items */}
      <div className='overflow-x-auto'>
        {filteredItems.length>0 ? (
        <table className="table">
            {/* head */}
            <thead className='bg-green text-white'>
            <tr>
                <th>#</th>
                <th>Date</th>
                <th>Sender</th>
                <th>Move In</th>
                <th>Needs</th>
                <th>Pay Via</th>
                <th>Pay Status</th>
                <th>Paid</th>
                <th>Amount</th>
                <th>View</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {
                filteredItems?.map((item, index) => (
                    <tr key={index}>
                        <th>{index + 1}</th>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td>{item.email}</td>
                        <td>{item.movein}</td>
                        <td>{item.needs}</td>
                        <td>{item.payvia}</td>
                        <td>{item.paystatus}</td>
                        <td>{item.paid}</td>
                        <td>{item.payment}</td>                 
                        <td>
                          <Link to={`/owner/view-listing/${item.listing._id}`}><button className='btn btn-sm btn-circle text-green bg-black'><FcViewDetails/></button></Link>
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
          </table>):(
            <div>
              <h2 className='text-blue-500 font-bold'>No Booking Found!</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageBooking
