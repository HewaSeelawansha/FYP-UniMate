import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PropertyShowcase = () => {
  const properties = [
    {
      id: 1,
      title: "Campus View Apartments",
      location: "0.5mi from University",
      price: "$450/month",
      rating: 4.9,
      image: "/images/properties/property1.jpg",
      amenities: ["WiFi", "Laundry", "Kitchen"]
    },
    {
      id: 2,
      title: "Green Valley Residence",
      location: "1.2mi from University",
      price: "$380/month",
      rating: 4.7,
      image: "/images/properties/property2.jpg",
      amenities: ["WiFi", "Parking", "Study Room"]
    },
    {
      id: 3,
      title: "Downtown Student Lofts",
      location: "0.8mi from University",
      price: "$520/month",
      rating: 4.8,
      image: "/images/properties/property3.jpg",
      amenities: ["WiFi", "Gym", "24/7 Security"]
    },
    {
      id: 4,
      title: "University Heights",
      location: "On Campus",
      price: "$600/month",
      rating: 4.9,
      image: "/images/properties/property4.jpg",
      amenities: ["WiFi", "Cafeteria", "Cleaning"]
    },
    {
      id: 5,
      title: "The Scholar's House",
      location: "0.3mi from University",
      price: "$490/month",
      rating: 4.8,
      image: "/images/properties/property5.jpg",
      amenities: ["WiFi", "Library", "Bike Storage"]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Student Homes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Curated selection of the best boarding houses near your campus
          </p>
        </div>
        
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="pb-12"
        >
          {properties.map((property) => (
            <SwiperSlide key={property.id}>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    {property.rating}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{property.title}</h3>
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      {property.price}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.amenities.map((amenity, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors duration-300">
                    View Details
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PropertyShowcase;