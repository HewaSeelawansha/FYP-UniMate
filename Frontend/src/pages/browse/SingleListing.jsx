import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import useAxiosPublic from "../../hooks/useAxiosPublic";
import ReviewComponent from "./Listing/ReviewComponent";
import MapComponent from "./Listing/MapComponent";
import BoardingComponent from "./Listing/BoardingComponent";
import RoommateComponent from "./Listing/RoommateComponent";
import BookingComponent from "./Listing/BookingComponent";
import useListings from "../../hooks/useListings";
import { FcViewDetails } from "react-icons/fc";
import { IoIosArrowBack } from 'react-icons/io';
import MoreListings from "./Listing/MoreListings";

const SingleListing = () => {
  const [listings, listingsLoading, refetchListings] = useListings();
  const { user } = useAuth();
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axiosPublic.get(`/listing/${id}`);
        setListing(response.data);
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
        const response = await axiosPublic.get(`/boarding/owner/${listing?.owner}`);
        setBoarding(response.data); 
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
      const existingChat = await axiosSecure.get(`/chat/find/${receiver}/${sender}`);
      if (existingChat.data !== null) {
        navigate(`/chats?chatId=${existingChat.data._id}`);
        return;
      }
  
      const response = await axiosSecure.post(`/chat`, chatData);
  
      if (response.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Chat Created Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(`/chats?chatId=${response.data._id}`);
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
        const response = await axiosPublic.get(`/users/${listing?.owner}`);
        setPerson(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerson();
  }, [listing?.owner]);

  const boardingListings = listings.filter(list => listing && list.status==='Approved' && list.payStatus==='Done' && list.owner === listing.owner && list._id !== listing._id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h2 className="text-xl font-bold text-gray-800">Listing not found</h2>
          <p className="mt-2 text-gray-600">The listing you're looking for doesn't exist or may have been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="flex xl:flex-row flex-col items-center justify-between mb-2">
          <button
            onClick={() => navigate(-1)}
            className="xl:mb-0 mb-2 flex items-center text-xl text-green-500 hover:text-green-600 transition duration-200"
          >
            <IoIosArrowBack className="mr-2" /> Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            <span className="text-gray-800">{listing.name}</span>
            <span className="text-green-500"> - {listing.boarding}</span>
          </h1>
          <div className="w-8"></div>
        </div>
        <div className="w-24 h-1 bg-green-500 mx-auto mt-4 rounded-full"></div>
      </div>


      {/* Image Carousel */}
      <div className="rounded-xl shadow-xl overflow-hidden mb-12 h-[300px] md:h-[500px] xl:h-[770px]">
        {listing ? (
          <Carousel slideInterval={5000} indicators={false}>
            {listing?.images?.length > 0 ? (
              listing.images.map((image, index) => (
                <div key={index} className="relative h-full w-full">
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className="text-white font-medium">
                      Photo {index + 1} of {listing.images.length}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-100 h-full flex items-center justify-center">
                <span className="text-gray-400">No images available</span>
              </div>
            )}
          </Carousel>
        ) : (
          <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
            <p className="text-green-800">
              There is an issue loading the images.
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-4">
      <Tabs aria-label="Listing details tabs" style={{ underline: true }} className="custom-tabs border-b m-1 border-gray-200">
          {/* Details Tab */}
          <Tabs.Item active title="Details" icon={TbListDetails}>
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Details</h3>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900"><span className="font-bold text-green-500">{listing.distance} Km</span> Away From NSBM Green University</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-lg mr-4">
                      <RiHotelFill className="text-green-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">AVAILABLE BEDS</h3>
                      <p className="text-lg font-medium text-gray-900">{listing.available}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-lg mr-4">
                      <HiUserCircle className="text-green-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">RATINGS</h3>
                      <p className="text-lg font-medium text-gray-900">{listing.rating<=0? 'No Reviews Yet' :listing.rating+'/5'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-lg mr-4">
                      <BsCreditCard2BackFill className="text-green-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">TYPE</h3>
                      <p className="text-lg font-medium text-gray-900 capitalize">{listing.type}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-lg mr-4">
                      <FaBuildingUser className="text-green-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">FOR</h3>
                      <p className="text-lg font-medium text-gray-900 capitalize">{listing.gender}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-lg mr-4">
                      <HiClipboardList className="text-green-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">PRICE</h3>
                      <p className="text-lg font-bold text-green-500">LKR {listing.price?.toLocaleString()}/month</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-lg mr-4">
                      <MdDashboard className="text-green-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">KEY MONEY</h3>
                      <p className="text-lg font-medium text-gray-900">
                        {listing.keyMoney > 0 ? (
                          <span className="text-green-500">{listing.keyMoney} LKR</span>
                        ) : (
                          <span className="text-blue-500">Not Required</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed bg-green-100 p-4 rounded-lg">
                  {listing.description}
                </p>
              </div>
            </div>
          </Tabs.Item>

          {/* Amenities Tab */}
          <Tabs.Item title="Amenities" icon={HiAdjustments}>
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center bg-green-100 p-4 rounded-lg hover:bg-green-50 transition-colors">
                    <div className="bg-green-300 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="font-medium text-gray-800 capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </Tabs.Item>

          {/* Boarding House Tab */}
          <Tabs.Item title="Boarding House" icon={RiHotelFill}>
            <div className="p-6 md:p-8">
              {listing?.owner ? (
                <BoardingComponent owner={listing.owner} />
              ) : (
                <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
                  <p className="text-green-800">
                    There is an issue loading the boarding house information.
                  </p>
                </div>
              )}
            </div>
          </Tabs.Item>

          {/* More Lisitng Tab */}
          <Tabs.Item title="More Listings" icon={RiHotelFill}>
            <div className="p-6 md:p-8">
                <MoreListings 
                listings={boardingListings}
                currentListingId={listing._id} 
                />
            </div>
          </Tabs.Item>

          {/* Owner Tab */}
          <Tabs.Item title="Owner" icon={HiUserCircle}>
            <div className="p-6 md:p-8">
              {person ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-gradient-to-br from-green-300 to-green-200 p-8 flex flex-col items-center justify-center">
                      <div className="relative">
                        <img 
                          src={person?.photoURL || 'https://i.ibb.co/tPJnyqL1/btmn.jpg'} 
                          alt="Profile" 
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mt-4">{person?.name}</h3>
                      <p className="text-green-700 font-semibold mt-1">Property Owner</p>
                    </div>
                    <div className="md:w-2/3 p-8">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Information</h4>
                          <div className="mt-2 space-y-3">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                              </svg>
                              <span className="text-gray-700">{person?.email}</span>
                            </div>
                            {boarding?.phone && (
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                </svg>
                                <span className="text-gray-700">0{boarding.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registration Date</h4>
                          <div className="mt-2 flex items-center">
                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-gray-700">
                              {new Date(person?.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        
                        {boarding?.address && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</h4>
                            <div className="mt-2 flex items-start">
                              <svg className="w-5 h-5 text-gray-400 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                              </svg>
                              <span className="text-gray-700">{boarding.address}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
                  <p className="text-green-800">
                    There is an issue loading the owner information.
                  </p>
                </div>
              )}
            </div>
          </Tabs.Item>

          {/* Map Tab */}
          <Tabs.Item title="View in Map" icon={PiMapPinAreaFill}>
            <div className="p-6 md:p-8">
              {boarding ? (
                <MapComponent lati={boarding.lat} lngi={boarding.lng} name={listing.owner} />
              ) : (
                <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
                  <p className="text-green-800">
                    There is an issue loading the map.
                  </p>
                </div>
              )}
            </div>
          </Tabs.Item>

          {/* Review Tab */}
          <Tabs.Item title="Reviews" icon={BsStars}>
            <div className="p-6 md:p-8">
              {listing ? (
                <ReviewComponent 
                  id={listing._id} 
                  listing={listing._id} 
                />
              ) : (
                <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
                  <p className="text-green-800">
                    There is an issue loading the reviews.
                  </p>
                </div>
              )}
            </div>
          </Tabs.Item>

          {/* Contacts Tab */}
          <Tabs.Item title="Contacts" icon={MdOutlineContactMail}>
            <div className="p-6 md:p-8">
              {user ? (
                user.email !== listing.owner ? (

                  <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border-l-4 border-green-500">
                      <div className="p-4 md:p-6 flex items-center">
                        <div className="flex-shrink-0 mr-4 relative">
                          <img 
                            src={person?.photoURL || 'https://i.ibb.co/nNWV4psx/1x76aqpar8181.webp'}
                            alt="User Avatar" 
                            className="w-14 h-14 rounded-full object-cover border-4 border-green-100"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-gray-900">{person?.name}</h3>
                          <p className="text-gray-600 text-sm">Property Owner</p>
                        </div>
                        <button
                          onClick={() => handleChat(user.email, listing.owner)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full shadow-sm transition-colors flex items-center"
                        >
                          <FaBuildingUser className="mr-2" />
                          Chat
                        </button>
                      </div>
                    </div>
                ) : (
                  <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">This is your listing</h3>
                    <p className="text-green-800 mb-4">
                      You're viewing your own property. Explore other listings to connect with their owners.
                    </p>
                  </div>
                )
              ) : (
                <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Please Login</h3>
                  <p className="text-green-800 mb-4">
                    Sign in to your account to start a conversation with the property owner.
                  </p>
                </div>
              )}
            </div>
          </Tabs.Item>

          {/* Roommate Tab */}
          <Tabs.Item title="Find Roommates" icon={FaBuildingUser}>
            <div className="p-6 md:p-8">
              {listing && user ? (
                <RoommateComponent gender={listing.gender} />
              ) : (
                <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Please Login</h3>
                  <p className="text-green-800 mb-4">
                    Sign in to connect with students looking for roommates.
                  </p>
                </div>
              )}
            </div>
          </Tabs.Item>

          {/* Booking Tab */}
          <Tabs.Item title="Book Now" icon={BsCreditCard2BackFill}>
            <div className="p-6 md:p-8">
              {listing && user ? (
                <BookingComponent 
                  currentuser={user.email} 
                  id={listing._id} 
                  price={listing.price} 
                  keyMoney={listing.keyMoney} 
                  owner={listing.owner} 
                  gender={listing.gender}
                />
              ) : (
              <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Please Login</h3>
                <p className="text-green-800 mb-4">
                  Sign in to make a booking request.
                </p>
              </div>
              )}
            </div>
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
};

export default SingleListing;