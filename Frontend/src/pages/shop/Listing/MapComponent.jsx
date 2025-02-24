import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
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

const MapComponent = ({ lati, lngi, name }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [route, setRoute] = useState([]);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
  
    const NSBMLocation = [6.822351667770194, 80.04161575881648];
  
    const MapResizer = () => {
        const map = useMap();
    
        useEffect(() => {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    map.invalidateSize();
                });
            }, 2500); // Adjust delay if needed
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
                fetchRoute([lat, lng], [lati, lngi]); // Update route
            },
        };
    
        return (
            <Marker 
                position={userLocation} 
                draggable 
                eventHandlers={eventHandlers}
            >
                <Popup>Your Location</Popup>
            </Marker>
        );
    };
  
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            fetchRoute([latitude, longitude], [lati, lngi]);
          },
          (error) => console.error("Error getting user location:", error)
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
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

    self.addEventListener('fetch', (event) => {
        // Check if navigation preload is supported
        if (event.preloadResponse) {
            event.respondWith(
                (async () => {
                    // Wait for the preload response
                    const preloadResponse = await event.preloadResponse;
                    if (preloadResponse) {
                        return preloadResponse;
                    }
    
                    // Fallback to network request if no preload response
                    return fetch(event.request);
                })()
            );
        } else {
            // If no preload support, fall back to network fetch
            event.respondWith(fetch(event.request));
        }
    });
    
  
    return (
      <div className="bg-black p-4 rounded-lg" >
        <div style={{ height: "500px", position: "relative" }}>
          {lati && lngi ? (
            <MapContainer
            center={[lati, lngi]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[lati, lngi]}>
              <Popup>
                {name} <br /> {name}
              </Popup>
            </Marker>
            <DraggableMarker />
            {route.length > 0 && <Polyline positions={route} color="blue" />}
            <MapResizer /> {/* Add this component */}
          </MapContainer>
          ) : (
            <div className="text-center py-20">Loading map...</div>
          )}
        </div>
  
        {distance && duration && (
          <div className="text-white mt-4 text-center">
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
          className="w-full font-bold bg-green text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 mt-4"
        >
          Get Directions to Listing
        </button>
  
        <button
          onClick={getNSBMLocation}
          className="w-full font-bold bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 mt-4"
        >
          Get Directions from NSBM
        </button>
  
        {userLocation && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${lati},${lngi}&travelmode=driving`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center font-bold bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300 mt-4"
          >
            Start Navigation in Google Maps
          </a>
        )}
      </div>
    );
  };
  
export default MapComponent