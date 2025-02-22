import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import { Carousel } from "flowbite-react";
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ViewBoardingAdmin = () => {
  const {user} = useAuth();
  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:3000/boarding/owner/${user.email}`);
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
  }, [user.email]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!boarding) {
    return <div className="text-center py-20">Boarding house already exists!</div>;
  }

  return (
    <div className='w-full xl:w-[1280px] lg:w-[780px] md:w-[520px] px-2 mx-auto py-4'>
      <h2 className='text-3xl font-bold text-center mb-5'>
            <span className='text-green'>{boarding.name}</span> Boarding House
      </h2>
      <div className="p-0.5 rounded-lg bg-green my-5 md:h-[400px] sm:h-[300px] xl:h-[600px] 2xl:h-[700px]">
        <Carousel slideInterval={5000}>
          {boarding.images && boarding.images.length > 0 ? (
            boarding.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full"
              />
            ))
          ) : (
            <img
              src="https://via.placeholder.com/800x500?text=No+Image+Available"
              alt="No images"
            />
          )}
        </Carousel>
      </div>

      <div className='bg-gray-100 mb-5 p-4 rounded-lg'>
        <p className="text-gray-700 mb-4"><strong>Owner:</strong> {boarding?.owner}</p>
        <p className="text-gray-700 mb-4"><strong>Address:</strong> {boarding?.address}</p>
        <p className="text-gray-700"><strong>Phone:</strong> {boarding?.phone}</p>
      </div>

      <div className='bg-gray-100 mb-5 p-4 rounded-lg'>
        <p className="text-gray-700 mb-4"><strong>Description:</strong> {boarding?.description}</p>
        <p className="text-gray-700 mb-4"><strong>Total Beds:</strong> {boarding?.beds}</p>
        <p className="text-gray-700"><strong>Gender:</strong> {boarding?.gender}</p>
      </div>

      <div className="bg-gray-100 mb-4 p-4 rounded-lg flex flex-wrap gap-4">
        {boarding.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-2">
            <input
                type="checkbox"
                checked={boarding.amenities.includes(amenity)}
                readOnly
                className="text-sky-500 checkbox-xs rounded-md"
            />
            <span>{amenity}</span>
            </div>
        ))}
      </div>

      <div className="bg-green p-0.5 rounded-lg mb-5" style={{ height: "300px", position: "relative"}}>
        <MapContainer
            center={[boarding.lat, boarding.lng]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[boarding.lat, boarding.lng]}>
              <Popup>
                {boarding.name} <br /> {boarding.address}
              </Popup>
            </Marker>
        </MapContainer>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-gray-700"><strong>Added On:</strong> {new Date(boarding?.createdAt).toLocaleDateString()}</p>
      </div>

      <Link to={`/owner/update-boarding/${boarding._id}`}>
        <button className="my-5 w-full font-bold bg-green text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 flex items-center justify-center gap-2">
            Edit
        </button>
      </Link>

      <button onClick={handleGoBack} className="my-5 w-full font-bold bg-green text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 flex items-center justify-center gap-2">
            Back
      </button>

    </div>
  );
};

export default ViewBoardingAdmin;