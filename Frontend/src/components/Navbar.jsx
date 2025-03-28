import React, { useContext, useEffect, useState } from 'react'
import logo from '/logon.png';
import { FaRegUser } from 'react-icons/fa';
import { IoMdChatboxes } from "react-icons/io";
import Modal from './Modal';
import Profile from './Profile';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const {user} = useAuth();
  //const [ cart, refetch ] = useCart();
  //console.log(user);

  //handle scroll function
  useEffect(() => {
    const handleScroll = () => {
        const offset = window.scrollY;
        if(offset > 0){
            setSticky(true);
        } else {
            setSticky(false);
        }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('scroll', handleScroll);
    }

  }, [])
  const navItems = (
    <>
        <li><a href='/'>Home</a></li>
        <li><a href='/browse'>Browse</a></li>
        <li><details><summary>Services</summary>
            <ul className="p-2">
                <li><a>Online Order</a></li>
                <li><a>Table Booking</a></li>
                <li><a>Order Tracking</a></li>
            </ul>
                </details>
        </li>
        <li><details><summary>Offers</summary>
            <ul className="p-2">
                <li><a>Online Order</a></li>
                <li><a>Table Booking</a></li>
                <li><a>Order Tracking</a></li>
            </ul>
                </details>
        </li>
    </>
  );
  return (
    <header className='max-w-screen-2xl container mx-auto fixed top-0 left-0 right-0 trnsition-all duration-300 ease-in-out'>
        <div className={`navbar xl:px-24 ${isSticky ? "shadow-md bg-base-100 trnsition-all duration-300" : ""}`}>
            <div className="navbar-start">
                <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                </div>
                <ul
                    tabIndex={0}
                    className="bg-gray-300 menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    {navItems}
                </ul>
                </div>
                <a href='/'>
                    <img src={logo} alt="" />
                </a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navItems}
                </ul>
            </div>
            <div className="navbar-end gap-1">
                {/*search btn*/}
                <button className="btn bg-orange-200 btn-ghost btn-circle hidden md:flex">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                <Link to="/chats" className="btn bg-orange-200 btn-ghost btn-circle text-2xl md:flex">
                    <IoMdChatboxes/>
                </Link>
                {/*btn*/}
                {
                    user? <Profile user={user}/> : <button onClick={()=>document.getElementById('my_modal_5').showModal()} className="btn bg-green rounded-full px-6 text-white flex items-center gap-2">
                    <FaRegUser/> Login</button>
                }
                <Modal/>
            </div>
        </div>
    </header>
  )
}

export default Navbar
