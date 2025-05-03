import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useBoarding from '../../hooks/useBoarding';

const UniversityHubLocator = () => {
  const [boardings, boardingLoading, refetchBoarding] = useBoarding();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className='text-left'>
          <p className='text-xl font-semibold uppercase text-green-500'>Interactive Map</p>
          <h2 className='title md:w-[550px]'>Boarding Houses Near Your University </h2>
        </div>
        
        <div className="z-10 mt-8 rounded-xl overflow-hidden shadow-xl xl:h-[700px] h-[500px] relative">
          <MapContainer 
            center={[6.841134387957852, 80.00295750709832
            ]} 
            zoom={13} 
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* NSBM */}
            <Marker position={[6.821380, 80.041691]}>
              <Popup>
                <div className="font-semibold">NSBM Green University Town</div>
              </Popup>
            </Marker>
            {boardings.map((boarding, index) => (
              <Marker key={index} position={[boarding.lat, boarding.lng]}>
                <Popup>
                  <div className="font-semibold">{boarding.name}</div>
                  <div className="font-semibold">{boarding.owner}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default UniversityHubLocator;