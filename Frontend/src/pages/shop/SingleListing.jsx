import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Carousel, Tabs } from "flowbite-react";
import { TbListDetails } from "react-icons/tb";
import { PiMapPinAreaFill } from "react-icons/pi";
import { FaBuildingUser } from "react-icons/fa6";
import { BsCreditCard2BackFill, BsStars } from "react-icons/bs";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard, MdOutlineContactMail } from "react-icons/md";
import { RiHotelFill } from "react-icons/ri";
import Swal from 'sweetalert2';
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ReviewComponent from "./Listing/ReviewComponent";
import MapComponent from "./Listing/MapComponent";
import BoardingComponent from "./Listing/BoardingComponent";
import RoommateComponent from "./Listing/RoommateComponent";
import BookingComponent from "./Listing/BookingComponent";

const SingleListing = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:3000/listing/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch listing");
        }
        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  useEffect(() => {
    const fetchBoarding = async () => {
      if (!listing?.owner) return;
      try {
        const response = await fetch(`http://localhost:3000/boarding/owner/${listing?.owner}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch boarding: ${response.statusText}`);
        }
        const data = await response.json();
        setBoarding(data); 
      } catch (error) {
        console.error("Error fetching boarding:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBoarding();
  }, [listing?.owner]);

  const handleChat = async (sender, receiver) => {
    const chatData = {
      senderId: sender,
      receiverId: receiver,
    };
  
    try {
      // First, check if a chat already exists between the two users
      const existingChat = await axiosSecure.get(`/chat/find/${receiver}/${sender}`);
  
      // If a chat already exists, navigate to the chat page
      if (existingChat.data !== null) {
        navigate(`/chats`);
        return;
      }
  
      // If no chat exists, create a new one
      const response = await axiosSecure.post(`/chat`, chatData);
  
      if (response.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Chat Created Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(`/chats`);
      }
    } catch (error) {
      console.error('Error creating or fetching chat:', error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while processing the chat request.',
        showConfirmButton: true,
      });
    }
  };

  useEffect(() => {
    const fetchPerson = async () => {
      if (!listing?.owner) return;
      try {
        const response = await fetch(`http://localhost:3000/users/${listing?.owner}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }
        const data = await response.json();
        setPerson(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerson();
  }, [listing?.owner]);
  

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!listing) {
    return <div className="text-center py-20">Listing not found</div>;
  }

  return (
    <div className="section-container py-20">
      <h2 className="text-green md:text-4xl text-3xl font-bold md:leading-snug leading-snug">
      <span className="text-black">{listing.name} - </span>
        {listing.boarding}
      </h2>
      <div className="rounded-lg bg-black my-5 h-[300px] md:h-[500px] xl:h-[600px] 2xl:h-[700px]">
        {listing?(
          <Carousel slideInterval={5000}>
          {listing?.images && listing?.images?.length > 0 ? (
            listing?.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full"
              />
            ))
          ) : (
            <></>
          )}
        </Carousel>
        ):(<></>)}
      </div>
      <div>
        <Tabs aria-label="Tabs with icons" variant="underline" className="custom-tabs">

          <Tabs.Item active title="Details" icon={TbListDetails}>
          <div className="rounded-lg">
            <div className="bg-blue-300 p-4 rounded-lg">
              <p className="font-bold">
                Title: <span className="font-normal">{listing.name}</span>
              </p>
              <p className="font-bold mt-2">
                Boarding House: <span className="font-normal">{listing.boarding}</span>
              </p>
              <p className="font-bold mt-2">
                Owner: <span className="font-normal">{listing.owner}</span>
              </p>
              <p className="font-bold mt-2">
                Type: <span className="font-normal">{listing.type}</span>
              </p>
              <p className="font-bold mt-2">
                For: <span className="font-normal">{listing.gender}</span>
              </p>
              <p className="font-bold mt-2">
                Description: <span className="font-normal">{listing.description}</span>
              </p>
              <p className="font-bold mt-2">
                Price: <span className="text-sky-500">${listing.price}</span>
              </p>
              <p className="font-bold mt-2">
                Key Money: {listing.keyMoney>0?<span className="text-sky-500">${listing.keyMoney}</span>:<span className="text-sky-500">Not Required</span>}
              </p>
            </div>
          </div>
          </Tabs.Item>

          <Tabs.Item title="Amenities" icon={HiAdjustments}>
          <div className="rounded-lg">
            <div className="bg-blue-300 p-4 rounded-lg">
              {listing.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={listing.amenities.includes(amenity)}
                    readOnly
                    className="text-sky-500 checkbox-xs rounded-md"
                  />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
          </Tabs.Item>

          <Tabs.Item active title="Boarding House" icon={RiHotelFill}>
            {listing?.owner?
            (<BoardingComponent owner={listing.owner}/>)
          :(
            <p className="text-green bg-black rounded-lg p-1 px-2 mt-4 font-bold">There is a issue when loading the boarding house.</p>)}
          </Tabs.Item>

          <Tabs.Item active title="Owner" icon={HiUserCircle}>
          <div className="w-full bg-blue-300 rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="bg-blue-200 text-green p-8 flex flex-col items-center justify-center md:w-1/3">
              <div className="avatar">
                <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-green">
                  <img src={person?.photoURL || 'https://i.ibb.co/tPJnyqL1/btmn.jpg'} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mt-4">{person?.name}</h3>
            </div>
            {/* User Details */}
            <div className="p-6 flex-1">
              <div className="bg-blue-200 p-10 rounded-lg">
                <p className="text-gray-700 mb-5"><strong>e-mail:</strong> {person?.email}</p>
                <p className="text-gray-700 mb-5"><strong>Registered on:</strong> {new Date(person?.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-700 mb-5"><strong>Address:</strong> {boarding?.address}</p>
                <p className="text-gray-700"><strong>Phone:</strong> 0{boarding?.phone}</p>
              </div>
            </div>
          </div>
          </Tabs.Item>

          <Tabs.Item title="Reviews" icon={BsStars}>
            {
            listing._id? (<ReviewComponent listing={listing._id}/>
            ):(
              <p className="text-green bg-black rounded-lg p-1 px-2 mt-4 font-bold">There is a issue when loading reviews.</p>
            )}
          </Tabs.Item>

          <Tabs.Item title="View in Map" icon={PiMapPinAreaFill}>
            {boarding?.lat&&boarding?.lng?
            (<MapComponent lati={boarding.lat} lngi={boarding.lng} name={listing.owner}/>
            ):(
            <p className="text-green bg-black rounded-lg p-1 px-2 mt-4 font-bold">There is a issue when loading map.</p>)}
          </Tabs.Item>

          <Tabs.Item title="Contacts" icon={MdOutlineContactMail}>
            {user?
            (user.email !== listing.owner ? (
              <div className='w-full font-bold bg-black text-white hover:text-blue-500 px-4 py-2 rounded-lg flex items-center justify-center gap-2 group'>
                <div className="p-2 avatar px-2">
                  <div className="ring-green group-hover:ring-secondary ring-offset-base-100 w-12 rounded-full ring ring-offset-2">
                    <img src={person?.photoURL || 'https://i.ibb.co/nNWV4psx/1x76aqpar8181.webp'} alt="User Avatar" />
                  </div>
                </div>
                <p className="text-green group-hover:text-secondary font-bold text-xl m-auto">
                  {person?.name}
                </p>
                <button onClick={() => handleChat(user.email, listing.owner)} className="font-bold bg-white text-black px-4 py-2 rounded-lg hover:bg-secondary hover:text-white transition duration-300 flex items-center justify-center gap-2">
                  Direct Chat <FaBuildingUser className="text-xl" />
                </button>
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg p-4">
                <p className="font-bold">
                You are currently viewing <span className="text-green">your own listing</span>. Select a listing from another owner to start a conversation.
                </p>
              </div>
            )) : (
            <div className="bg-gray-200 rounded-lg p-4">
              <p className="font-bold">
              Please <span className="text-green">login</span> to chat directly with the property owner.
              </p>
            </div>
            )}
          </Tabs.Item>

          <Tabs.Item title="Find Your Roommate" icon={MdOutlineContactMail}>
              {listing.owner?
              (<RoommateComponent gender={listing.owner}/>
              ):(
              <></>)}
          </Tabs.Item>

          <Tabs.Item title="Booking" icon={MdOutlineContactMail}>
              {listing && user?
              (<BookingComponent currentuser={user.email} id={listing._id} price={listing.price} keyMoney={listing.keyMoney} owner={listing.owner} />)
              :(<div className="bg-gray-200 rounded-lg">
              <div className="p-4">
                <p className="font-bold">
                  Please<span className="text-green"> login </span>to proceed with a booking.
                </p>
              </div>
            </div>)}   
          </Tabs.Item>

        </Tabs>
      </div>
    </div>
  );
};

export default SingleListing;