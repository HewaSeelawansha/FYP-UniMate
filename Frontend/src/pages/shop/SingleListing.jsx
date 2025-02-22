import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Carousel, Tabs } from "flowbite-react";
import { TbListDetails } from "react-icons/tb";
import { PiMapPinAreaFill } from "react-icons/pi";
import { FaBuildingUser } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { TbSend2 } from "react-icons/tb";
import { BsCreditCard2BackFill, BsStars } from "react-icons/bs";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard, MdOutlineContactMail } from "react-icons/md";
import { RiHotelFill } from "react-icons/ri";
import Swal from 'sweetalert2';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUser from "../../hooks/useUser";
import useRoommateUsers from "../../hooks/useRoommate";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
const SingleListing = () => {
  const {user} = useAuth();
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null); // User's current location
  const [route, setRoute] = useState([]); // Route coordinates
  const [distance, setDistance] = useState(null); // Distance in kilometers
  const [duration, setDuration] = useState(null); // Duration in minutes
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [isUser, isUserLoading] = useUser();
  const [roommates = [], refetch] = useRoommateUsers();

  const MapResizer = () => {
    const map = useMap();
  
    useEffect(() => {
      // Force the map to recalculate its size after the container is fully rendered
      map.invalidateSize();
    }, [map]);
  
    return null;
  };

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
    const fetchListing = async () => {
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
  
    fetchListing();
  }, [listing?.owner]);

  // NSBM Green University location
  const NSBMLocation = [6.822351667770194, 80.04161575881648];

  // Get directions from NSBM
  const getNSBMLocation = () => {
    setUserLocation(NSBMLocation);
    fetchRoute(NSBMLocation, [boarding?.lat, boarding?.lng]); // Fetch route from NSBM to listing
  };

  // Get the user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          fetchRoute([latitude, longitude], [boarding?.lat, boarding?.lng]); // Fetch route to listing location
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Fetch route using OpenRouteService API
  const fetchRoute = async (start, end) => {
    try {
      const API_KEY = import.meta.env.VITE_MAP_TOKEN; // Replace with your OpenRouteService API key
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch route");
      }
      const data = await response.json();
      const coordinates = data.features[0].geometry.coordinates.map((coord) => [coord[1], coord[0]]);
      setRoute(coordinates);

      // Extract distance and duration
      const distanceKm = (data.features[0].properties.segments[0].distance / 1000).toFixed(2);
      const durationMinutes = (data.features[0].properties.segments[0].duration / 60).toFixed(2);
      setDistance(distanceKm);
      setDuration(durationMinutes);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  // Draggable marker for user location
  const DraggableMarker = () => {
    const map = useMap();

    const eventHandlers = {
      dragend: (e) => {
        const { lat, lng } = e.target.getLatLng();
        setUserLocation([lat, lng]);
        fetchRoute([lat, lng], [boarding?.lat, boarding?.lng]); // Update route
      },
    };

    return userLocation ? (
      <Marker
        position={userLocation}
        draggable
        eventHandlers={eventHandlers}
      >
        <Popup>Your Location (Drag to adjust)</Popup>
      </Marker>
    ) : null;
  };

  const handleChat = async (receiver) => {
    const chatData = {
      senderId: user.email,
      receiverId: receiver,
    };
  
    try {
      // First, check if a chat already exists between the two users
      const existingChat = await axiosSecure.get(`/chat/find/${receiver}/${user.email}`);
  
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
      <div className="p-0.5 rounded-lg bg-green my-5 h-[300px] md:h-[500px] xl:h-[600px] 2xl:h-[700px]">
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
      </div>
      <div>
        <Tabs aria-label="Tabs with icons" variant="underline" className="custom-tabs">
          <Tabs.Item active title="Details" icon={TbListDetails}>
            <div className="bg-gray-200 p-4 rounded-lg">
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
            </div>
          </Tabs.Item>
          <Tabs.Item title="Amenities" icon={HiAdjustments}>
            <div className="bg-gray-200 p-4 rounded-lg">
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
          </Tabs.Item>
          <Tabs.Item active title="Boarding House" icon={RiHotelFill}>
          <div className="bg-gray-200 rounded-lg">
            <div className="p-4">
              <p className="font-bold">Name: <span className="font-normal">{boarding?.name}</span></p>
              <p className="font-bold mt-2">Owner: <span className="font-normal">{boarding?.owner}</span></p>
              <p className="font-bold mt-2">Address: <span className="font-normal">{boarding?.address}</span></p>
              <p className="font-bold mt-2">Phone: <span className="font-normal">0{boarding?.phone}</span></p>
              <p className="font-bold mt-2">For: <span className="font-normal">{boarding?.gender}</span></p>
              <p className="font-bold mt-2">Description: <span className="font-normal">{boarding?.description}</span></p>
              <p className="font-bold mt-2">Total Beds: <span className="font-normal">{boarding?.beds}</span></p>
              <p className="font-bold mt-2">Since: <span className="font-normal">{new Date(boarding?.createdAt).toLocaleDateString()}</span></p>
            </div>
            <div className="p-0.5 rounded-lg bg-green h-[300px] md:h-[500px] xl:h-[600px] 2xl:h-[700px]">
              <Carousel slideInterval={5000}>
                {boarding?.images && boarding?.images?.length > 0 ? (
                  boarding?.images.map((image, index) => (
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
            </div>
          </div>
          </Tabs.Item>
          <Tabs.Item active title="Owner" icon={HiUserCircle}>
          <div className="w-full bg-gray-200 rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="bg-black text-white p-8 flex flex-col items-center justify-center md:w-1/3">
              <div className="avatar">
                <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-green">
                  <img src={person?.photoURL || 'https://i.ibb.co/tPJnyqL1/btmn.jpg'} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mt-4">{person?.name}</h3>
            </div>
            {/* User Details */}
            <div className="p-6 flex-1">
              <div className="bg-gray-100 p-10 rounded-lg">
                <p className="text-gray-700 mb-5"><strong>e-mail:</strong> {person?.email}</p>
                <p className="text-gray-700 mb-5"><strong>Registered on:</strong> {new Date(person?.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-700 mb-5"><strong>Address:</strong> {boarding?.address}</p>
                <p className="text-gray-700"><strong>Phone:</strong> 0{boarding?.phone}</p>
              </div>
            </div>
          </div>
          </Tabs.Item>
          <Tabs.Item title="Reviews" icon={BsStars}>
            This is{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              Settings tab's associated content
            </span>
            . Clicking another tab will toggle the visibility of this one for the next. The tab
            JavaScript swaps classes to control the content visibility and styling.
          </Tabs.Item>
          <Tabs.Item title="View in Map" icon={PiMapPinAreaFill}>
            <div style={{ height: "500px", position: "relative" }}>
              { boarding?.lat && boarding?.lng ? (
              <MapContainer
                center={[boarding?.lat, boarding?.lng]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[boarding?.lat, boarding?.lng]}>
                  <Popup>
                    {listing.name} <br /> {listing.owner}
                  </Popup>
                </Marker>
                <DraggableMarker />
                {route.length > 0 && <Polyline positions={route} color="blue" />}
                <MapResizer /> {/* Add this component */}
              </MapContainer>) : (<div className="text-center py-20">Loading map...</div>)}
            </div>

            {distance && duration && (
              <div className="mt-4 text-center">
                <p className="text-lg font-bold">
                  Distance: <span className="text-green">{distance} km</span>
                </p>
                <p className="text-lg font-bold">
                  Duration: <span className="text-green">{duration} minutes</span>
                </p>
              </div>
            )}

            <button
              onClick={getUserLocation}
              className="w-full font-bold bg-green text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 flex items-center justify-center gap-2 mt-4"
            >
              Get Directions to Listing
            </button>

            <button
              onClick={getNSBMLocation}
              className="w-full font-bold bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 flex items-center justify-center gap-2 mt-4"
            >
              Get Directions to Listing from NSBM Green University
            </button>

            {/* Start Navigation Button */}
            {userLocation && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${boarding?.lat},${boarding?.lng}&travelmode=driving`}
                //target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center font-bold bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 mt-4"
              >
                Start Navigation in Google Maps
              </a>
            )}
          </Tabs.Item>
          <Tabs.Item title="Contacts" icon={MdOutlineContactMail}>
            {user?
            <div className='w-full font-bold bg-black text-white hover:text-blue-500 px-4 py-2 rounded-lg flex items-center justify-center gap-2 group'>
                <div className="p-2 avatar px-2">
                  <div className="ring-green group-hover:ring-secondary ring-offset-base-100 w-12 rounded-full ring ring-offset-2">
                    <img src={person?.photoURL} alt="User Avatar" />
                  </div>
                </div>
                <p className="font-bold text-xl m-auto">
                  {person?.name}
                </p>
                 <button onClick={() => handleChat(listing.owner)} className="font-bold bg-green text-white px-4 py-2 rounded-lg hover:bg-secondary hover:text-black transition duration-300 flex items-center justify-center gap-2">
                 Chat with Owner <FaBuildingUser className="text-xl" />
            </button></div>:
            <div className="bg-gray-200 rounded-lg p-4">
              <p className="font-bold">
                Please<span className="text-green"> login </span>to chat directly with owner.
              </p>
              </div>}
          </Tabs.Item>
          <Tabs.Item title="Find Your Roommate" icon={MdOutlineContactMail}>
  {user ? (
    isUser ? (
      roommates?.length > 0 ? (
        roommates.map((roommate, index) => (
          <details className="collapse bg-black text-blue-500 hover:bg-blue-500 hover:text-black group" key={index}>
            <summary className="collapse-title text-xl font-medium">
              <div className="flex flex-row">
                <div className="avatar px-2">
                  <div className="ring-primary group-hover:ring-black ring-offset-base-100 w-12 rounded-full ring ring-offset-2">
                    <img src={roommate?.photoURL} alt="User Avatar" />
                  </div>
                </div>
                <p className="font-bold m-auto">
                  {roommate?.name}
                </p>
              </div>
            </summary>
            <div className="collapse-content flex flex-row gap-2">
              <button
                onClick={() => handleChat(roommate.email)}
                className="w-full font-bold bg-white text-black py-2 rounded-lg hover:bg-black hover:text-white transition duration-300 flex items-center justify-center gap-2"
              >
                Direct Chat <TbSend2 className="text-xl" />
              </button>
            </div>
          </details>
        ))
      ) : (
        <div className="bg-gray-200 rounded-lg">
        <div className="p-4">
          <p className="font-bold">
            No students are currently looking for a 
            <span className="text-green"> roommate </span>
            in listings for {listing.gender}.
          </p>
        </div>
      </div>
      )
    ) : (
      <div className="bg-gray-200 rounded-lg">
        <div className="p-4">
          <p className="font-bold">
            Only students can access the
            <span className="text-green"> direct chat </span>with peers who are
            looking for a roommate.
          </p>
        </div>
      </div>
    )
  ) : (
    <div className="bg-gray-200 rounded-lg">
      <div className="p-4">
        <p className="font-bold">
          Please<span className="text-green"> login </span>to direct chat with
          peers who are looking for a roommate.
        </p>
      </div>
    </div>
  )}
</Tabs.Item>

        </Tabs>
      </div>
    </div>
  );
};

export default SingleListing;