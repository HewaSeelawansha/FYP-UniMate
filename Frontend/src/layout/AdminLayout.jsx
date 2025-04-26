import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { MdDashboard, MdDashboardCustomize } from "react-icons/md";
import {FaEdit,FaLocationArrow,FaPlusCircle,FaQuestionCircle,FaRegUser,FaShoppingBag,FaUser,} from "react-icons/fa";
import logo from "/logon.png";
import { FaCartShopping } from "react-icons/fa6";
import Login from '../components/Login';
import useAdmin from '../hooks/useAdmin';
import useAuth from '../hooks/useAuth';
import { IoMdChatboxes } from "react-icons/io";

const sharedLinks = (
  <>
    <li className='mt-3'><Link to="/chats" className="hover:bg-blue-200 rounded-lg"><IoMdChatboxes /> Chats</Link></li>
    <li><Link to="/" className="hover:bg-blue-200 rounded-lg"><MdDashboard /> Home</Link></li>
    <li><Link to="/browse" className="hover:bg-blue-200 rounded-lg"><FaCartShopping /> Browse</Link></li>
    <li><Link to="/" className="hover:bg-blue-200 rounded-lg"><FaQuestionCircle /> 24/7 Support</Link></li>
  </>
);

const AdminLayout = () => {
  const {loading} = useAuth()
  const [isAdmin, isAdminLoading] = useAdmin()
  return (
    <div>
        {
          isAdmin ? 
          <div className="drawer sm:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col sm:pl-0">
              {/* Mobile header */}
              <div className="flex items-center justify-between mx-4 sm:hidden">
                <label htmlFor="my-drawer-2" className="btn bg-blue-300 rounded-full drawer-button">
                  <MdDashboardCustomize/>
                </label>
                <button className='my-2 flex items-center gap-2 btn rounded-full px-6 bg-green-500 text-white'>
                  <FaRegUser />Logout
                </button>
              </div>
              
              {/* Outlet container - takes full width on mobile, adjusts for sidebar on larger screens */}
              <div className='mt-5 sm:mt-0 mx-4 sm:ml-[calc(10px+1rem)] xl:ml-[calc(10px+2rem)] w-auto'>
                <Outlet />
              </div>
            </div>
            
            {/* Sidebar - fixed width */}
            <div className="drawer-side">
              <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                {/* Sidebar content */}
                <li>
                  <Link to="/dashboard" className="flex justify-start mb-3">
                    <img src={logo} alt="" className="w-[150px]" />
                    <span className="badge badge-primary">Admin</span>
                  </Link>
                </li>
                <hr />
                <li className='mt-3'><Link className='hover:bg-blue-100 rounded-lg' to="/dashboard"><MdDashboard /> Dashboard</Link></li>
                <li><Link className='hover:bg-blue-100 rounded-lg' to="/dashboard/manage-boarding"><FaPlusCircle /> Manage Hostel</Link></li>
                <li className=''><Link className='hover:bg-blue-100 rounded-lg' to="/dashboard/bookings"><FaPlusCircle /> Bookings</Link></li>
                <li className=''><Link className='hover:bg-blue-100 rounded-lg' to="/dashboard/transactions"><FaPlusCircle /> Transactions</Link></li>
                <li className='mb-3'><Link className='hover:bg-blue-100 rounded-lg' to="/dashboard/users"><FaUser /> All Users</Link></li>
                <hr/>
                {sharedLinks}
              </ul>
            </div>

          </div>
          : (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
              <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                <p className="text-gray-600 mb-6">Only admins can access the admin's dashboard.</p>
                <Link to="/" className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-300">
                  Back to Home
                </Link>
              </div>
            </div>
          )}
            
          )  
    </div>
  )
}

export default AdminLayout
