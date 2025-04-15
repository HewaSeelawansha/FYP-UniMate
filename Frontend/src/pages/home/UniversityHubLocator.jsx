import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const UniversityHubLocator = () => {
  const universities = [
    { name: "Main Campus", position: [6.9271, 79.8612], hostels: 28 },
    { name: "Engineering Faculty", position: [6.9205, 79.8673], hostels: 15 },
    { name: "Medical School", position: [6.9328, 79.8576], hostels: 12 }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Hostels Near Your Campus</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Interactive map showing prime locations near university hubs
          </p>
        </div>
        
        <div className="rounded-xl overflow-hidden shadow-xl h-96 relative">
          <MapContainer 
            center={[6.9271, 79.8612]} 
            zoom={14} 
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {universities.map((uni, index) => (
              <Marker key={index} position={uni.position}>
                <Popup>
                  <div className="font-semibold">{uni.name}</div>
                  <div>{uni.hostels} verified hostels nearby</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md">
            <button className="text-green-600 font-medium">View All Campus Areas →</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniversityHubLocator;