// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Testimonials = () => {


const properties = [
  {
    id: 1,
    title: "Modern Studio Near Campus",
    price: "$450/month",
    location: "0.5mi from University",
    image: "/listings/listing1.jpg",
    amenities: ["Private Bath", "Kitchen", "WiFi"]
  },
  {
    id: 1,
    title: "Modern Studio Near Campus",
    price: "$450/month",
    location: "0.5mi from University",
    image: "/listings/listing1.jpg",
    amenities: ["Private Bath", "Kitchen", "WiFi"]
  },
  {
    id: 1,
    title: "Modern Studio Near Campus",
    price: "$450/month",
    location: "0.5mi from University",
    image: "/listings/listing1.jpg",
    amenities: ["Private Bath", "Kitchen", "WiFi"]
  },
  {
    id: 1,
    title: "Modern Studio Near Campus",
    price: "$450/month",
    location: "0.5mi from University",
    image: "/listings/listing1.jpg",
    amenities: ["Private Bath", "Kitchen", "WiFi"]
  },
  {
    id: 1,
    title: "Modern Studio Near Campus",
    price: "$450/month",
    location: "0.5mi from University",
    image: "/listings/listing1.jpg",
    amenities: ["Private Bath", "Kitchen", "WiFi"]
  },
  // Add more properties
];


  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Student Homes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Curated selection of the best student accommodations near your campus
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <motion.div 
              key={property.id}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">{property.title}</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{property.price}</span>
                </div>
                <p className="text-gray-600 mt-2">{property.location}</p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {property.amenities.map((amenity, index) => (
                    <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
                
                <Link 
                  to={`/listing/${property.id}`} 
                  className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-300"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/browse" 
            className="inline-block bg-white text-green-500 border border-green-500 hover:bg-green-50 px-8 py-3 rounded-full font-bold transition-colors duration-300"
          >
            View All Listings
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;