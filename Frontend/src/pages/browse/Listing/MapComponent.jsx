import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configure default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapComponent = ({ lati, lngi, name }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [route, setRoute] = useState([]);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mapKey, setMapKey] = useState(Date.now()); // Key to force remount
  
    const NSBMLocation = [6.821380, 80.041691];
  
    const MapResizer = () => {
        const map = useMap();
    
        useEffect(() => {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    map.invalidateSize();
                });
            }, 2500);
        }, [map]);
    
        return null;
    };
  
    const getNSBMLocation = () => {
      setUserLocation(NSBMLocation);
      fetchRoute(NSBMLocation, [lati, lngi]);
    };

    const DraggableMarker = () => {
        const map = useMap();
    
        if (!userLocation) return null;
    
        const eventHandlers = {
            dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                setUserLocation([lat, lng]);
                fetchRoute([lat, lng], [lati, lngi]); 
            },
        };
    
        return (
            <Marker 
                position={userLocation} 
                draggable 
                eventHandlers={eventHandlers}
            >
                <Popup className="font-medium">Your Location</Popup>
            </Marker>
        );
    };
  
    const getUserLocation = () => {
      setLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            fetchRoute([latitude, longitude], [lati, lngi]);
            setLoading(false);
          },
          (error) => {
            console.error("Error getting user location:", error);
            setLoading(false);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };
  
    const fetchRoute = async (start, end) => {
      try {
        const API_KEY = import.meta.env.VITE_MAP_TOKEN;
        if (!API_KEY) {
          console.error("API Key not found");
          return;
        }
        const response = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`
        );
        if (!response.ok) throw new Error("Failed to fetch route");
  
        const data = await response.json();
        const coordinates = data.features[0].geometry.coordinates.map((coord) => [coord[1], coord[0]]);
        setRoute(coordinates);
  
        const distanceKm = (data.features[0].properties.segments[0].distance / 1000).toFixed(2);
        const durationMinutes = (data.features[0].properties.segments[0].duration / 60).toFixed(2);
        setDistance(distanceKm);
        setDuration(durationMinutes);
  
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    // Function to refresh the map
    const refreshMap = () => {
      setMapKey(Date.now()); // This will force the MapContainer to remount
      if (userLocation) {
        fetchRoute(userLocation, [lati, lngi]); // Refetch the route
      }
    };
  
    return (
      <div className="overflow-hidden">
        <div className="pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Location Map</h2>
            <button
              onClick={refreshMap}
              className="flex items-center justify-center font-medium py-2 px-3 bg-green-100 hover:bg-green-200 text-gray-800 rounded-lg transition-colors"
              title="Refresh Map"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-md" style={{ height: "500px", position: "relative" }}>
            {lati && lngi ? (
              <MapContainer
                key={mapKey} // This key will force remount when changed
                center={[lati, lngi]}
                zoom={15}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
                className="rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[lati, lngi]}>
                  <Popup className="font-medium">
                    <span className="font-bold">{name}</span> <br /> 
                    Property Location
                  </Popup>
                </Marker>
                <DraggableMarker />
                {route.length > 0 && <Polyline positions={route} color="blue" weight={4} />}
                <MapResizer /> 
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading map data...</p>
                </div>
              </div>
            )}
          </div>
    
          {distance && duration && (
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg shadow-lg">
                  <p className="text-sm font-medium text-gray-500">Distance</p>
                  <p className="text-xl font-bold text-green-600">{distance} km</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-lg">
                  <p className="text-sm font-medium text-gray-500">Estimated Time</p>
                  <p className="text-xl font-bold text-green-600">{duration} min</p>
                </div>
              </div>
            </div>
          )}
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <button
              onClick={getUserLocation}
              disabled={loading}
              className={`flex items-center justify-center font-medium py-3 px-4 rounded-lg transition-colors ${
                loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Locating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  From Your Location
                </>
              )}
            </button>
    
            <button
              onClick={getNSBMLocation}
              className="flex items-center justify-center font-medium py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              From NSBM
            </button>
          </div>
    
          {userLocation && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${lati},${lngi}&travelmode=driving`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center font-medium py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors mt-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
              Open in Google Maps
            </a>
          )}
        </div>
      </div>
    );
  };
  
export default MapComponent;