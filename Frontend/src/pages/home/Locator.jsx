import React, { useState, useEffect } from "react";
import {MapContainer,TileLayer,Marker,Popup,Circle,useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import useBoarding from "../../hooks/useBoarding";
import { FaSearch, FaUniversity, FaSlidersH, FaBed } from "react-icons/fa";
import SearchModal from "../../components/SearchModal";

// Fix default marker icon issue in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom icons
const createCustomIcon = (color, iconName) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            <i class="fa ${iconName}" style="color: white; font-size: 14px;"></i>
          </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// University icon
const universityIcon = createCustomIcon("#4b5563", "fa-university");

// Property icon
const propertyIcon = createCustomIcon("#10b981", "fa-home");

// Component to center map on university
const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

const Locator = () => {
  const [boardings, boardingLoading, refetchBoarding] = useBoarding();
  const [selectedPlace, setSelectedPlace] = useState("NSBM");
  const [mapCenter, setMapCenter] = useState([6.82138, 80.041691]);
  const [filterDistance, setFilterDistance] = useState(2);
  const [filteredBoardings, setFilteredBoardings] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Universities data
  const places = [
    {
      id: "NSBM",
      name: "NSBM Green University",
      location: [6.82138, 80.041691],
    },
    { id: "PJ", name: "Pitipana Junction", location: [6.8429562, 80.0232387] },
    { id: "MK", name: "Makumbura", location: [6.8505256, 79.993495] },
    { id: "TJ", name: "Thalagala Junction", location: [6.8007395, 80.0434038] },
    {
      id: "MEC",
      name: "Meegoda Economic Center",
      location: [6.8439602, 80.0461747],
    },
  ];

  // Function to open search modal with a specific query
  const handleSearchBoarding = (boardingName) => {
    setSearchQuery(boardingName);
    setIsSearchModalOpen(true);
  };

  // Filter boardings by distance
  useEffect(() => {
    if (boardings.length > 0) {
      const filtered = boardings.filter((boarding) => {
        // Calculate distance (using Haversine formula)
        const place = places.find((u) => u.id === selectedPlace);
        if (!place) return false;

        const lat1 = place.location[0];
        const lon1 = place.location[1];
        const lat2 = boarding.lat;
        const lon2 = boarding.lng;

        const R = 6371; // Radius of the Earth in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km

        return distance <= filterDistance;
      });

      setFilteredBoardings(filtered);
    }
  }, [boardings, selectedPlace, filterDistance]);

  // Change place handler
  const handlePlaceChange = (uniId) => {
    const place = places.find((u) => u.id === uniId);
    if (place) {
      setSelectedPlace(uniId);
      setMapCenter(place.location);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <p className="text-xl font-semibold uppercase text-green-500 mb-2">
            Interactive Map
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Find Boarding Houses Near NSBM
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore available accommodations around NSBM Green University and
            find the perfect place to call home during your studies.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap items-stretch gap-4"
        >
          <div className="flex-1 min-w-[200px] flex flex-col justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Pointer
            </label>
            <div className="relative h-full">
              <select
                value={selectedPlace}
                onChange={(e) => handlePlaceChange(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-lg h-full"
              >
                {places.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
              </select>
              <FaUniversity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            </div>
          </div>

          <div className="flex-1 min-w-[200px] flex flex-col justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distance ({filterDistance} kilometers)
            </label>
            <div className="relative h-full">
              <input
                type="range"
                min="1"
                max="10"
                value={filterDistance}
                onChange={(e) => setFilterDistance(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1km</span>
                <span>5km</span>
                <span>10km</span>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[200px] flex flex-col justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Results
            </label>
            <div className="bg-green-50 border border-green-500 p-2 rounded-lg text-center h-full flex items-center justify-center gap-2">
              <span className="font-semibold text-green-500">
                {boardingLoading
                  ? "Loading..."
                  : `${filteredBoardings.length} boardings found`}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="z-10 rounded-xl overflow-hidden shadow-xl xl:h-[600px] h-[500px] relative border border-green-200"
        >
          {boardingLoading ? (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
            </div>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Center view on selected university */}
              <ChangeMapView center={mapCenter} />

              {/* University marker */}
              {places.map((uni) => (
                <Marker
                  key={uni.id}
                  position={uni.location}
                  icon={universityIcon}
                >
                  <Popup className="custom-popup">
                    <div className="font-semibold text-gray-800">
                      {uni.name}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Distance circle */}
              <Circle
                center={mapCenter}
                radius={filterDistance * 1000} // Convert km to meters
                pathOptions={{
                  fillColor: "#10b98133",
                  fillOpacity: 0.2,
                  color: "#10b981",
                  weight: 1,
                }}
              />

              {/* Boarding markers */}
              {filteredBoardings.map((boarding, index) => (
                <Marker
                  key={index}
                  position={[boarding.lat, boarding.lng]}
                  icon={propertyIcon}
                >
                  <Popup className="custom-popup min-w-[200px]">
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-800">
                        {boarding.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Owner: {boarding.owner}
                      </div>
                      {boarding.price && (
                        <div className="mt-1 font-medium text-green-600">
                          ${boarding.price}/month
                        </div>
                      )}
                      <button
                        onClick={() => handleSearchBoarding(boarding.owner)}
                        className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-full text-xs flex items-center justify-center gap-1 transition-colors"
                      >
                        <FaSearch size={10} />
                        <span>Search Listings</span>
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-600"
        >
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-600 mr-2"></div>
            Popular Places
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            Available Property
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-200 mr-2"></div>
            Search Radius
          </div>
        </motion.div>
      </div>
      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => {
          setIsSearchModalOpen(false);
          setSearchQuery("");
        }}
        initialSearchQuery={searchQuery}
      />
    </section>
  );
};

export default Locator;
