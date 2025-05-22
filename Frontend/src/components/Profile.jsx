import React, { useContext } from 'react'
import { AuthContext } from "../contexts/AuthProvider";
import { Link, useNavigate } from 'react-router-dom';

const Profile = ({ user, role  }) => {
  const navigate = useNavigate();
  const {logOut} = useContext(AuthContext)
  const handleLogout = () => {
    logOut().then(() => {
      navigate('/');
    }).catch((error) => {
    });
  }

  return (
    <div>
      <div className="drawer drawer-end z-50">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
            {/* Page content here */}
            <label htmlFor="my-drawer-4" className="drawer-button bg-emerald-500 hover:bg-emerald-600 btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                {
                    user.photoURL ? <img
                    alt="Tailwind CSS Navbar component"
                    src={user.photoURL}
                /> : <img alt="Tailwind CSS Navbar component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                }
                </div>
            </label>
        </div>
        <div className="drawer-side">
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li><a href='/update-profile'>Profile</a></li>
            {role==='user'?<li><Link to='/bookings'>Your Bookings</Link></li>:<></>}
            {role==='user'?<li><Link to='/payments'>Your Payments</Link></li>:<></>}
            <li><a href='/browse'>Browse Listings</a></li>
            {role==='admin'?<li><Link to='/dashboard'>Admin Dashboard</Link></li>:<></>}
            {role !== 'admin' && (<li><Link to='/owner'>{role === 'user' ? 'Register as owner' : role === 'owner' ? 'Owner Dashboard' : ''}</Link></li>)}
            <li><a onClick={handleLogout}>Logout</a></li>
            </ul>
        </div>
      </div>
    </div>
  )
}

export default Profile
