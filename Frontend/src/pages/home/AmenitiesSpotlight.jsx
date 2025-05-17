import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWifi, FaVideo, FaBook, FaParking, FaTshirt, FaSnowflake } from 'react-icons/fa';
import SearchModal from '../../components/SearchModal'; // Import the SearchModal component
import { Link } from 'react-router-dom';

const AmenitiesSpotlight = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const amenities = [
    { 
      id: 'wifi',
      label: 'WiFi',
      desc: "High-speed internet access throughout the property for all your connectivity needs",
      icon: <FaWifi className="text-4xl text-green-500" />,
      image: "/amenities/wifi.png",
      color: "from-emerald-50 to-green-100"
    },
    { 
      id: 'cctv',
      label: 'CCTV',
      desc: "24/7 monitored security cameras ensuring your safety and peace of mind",
      icon: <FaVideo className="text-4xl text-green-500" />,
      image: "/amenities/cctv.png",
      color: "from-lime-50 to-green-100"
    },
    { 
      id: 'study',
      label: 'Study Area',
      desc: "Quiet spaces designed for focused studying with ample lighting and charging stations",
      icon: <FaBook className="text-4xl text-green-500" />,
      image: "/amenities/study-area.png",
      color: "from-green-50 to-emerald-100"
    },
    { 
      id: 'parking',
      label: 'Parking',
      desc: "Secure parking spaces available for residents and visitors",
      icon: <FaParking className="text-4xl text-green-500" />,
      image: "/amenities/parking.png",
      color: "from-teal-50 to-green-100"
    },
    { 
      id: 'laundry',
      label: 'Laundry Service',
      desc: "On-site laundry facilities with modern washers and dryers",
      icon: <FaTshirt className="text-4xl text-green-500" />,
      image: "/amenities/laundry.png",
      color: "from-green-50 to-teal-100"
    },
    { 
      id: 'ac',
      label: 'Air Conditioning',
      desc: "Climate-controlled rooms for your comfort in all seasons",
      icon: <FaSnowflake className="text-4xl text-green-500" />,
      image: "/amenities/ac.png",
      color: "from-emerald-50 to-lime-100"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  // Function to handle amenity card click
  const handleAmenityClick = (amenityId) => {
    setSearchQuery(amenityId);
    setIsSearchModalOpen(true);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <p className="text-xl font-semibold uppercase text-green-500 mb-2">Essential Amenities</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Comfort and Convenience for Students
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our properties feature amenities designed to make student life easier and more comfortable.
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {amenities.map((item, index) => (
            <motion.div 
              key={item.id}
              variants={cardVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleAmenityClick(item.id)}
              className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} z-0 opacity-100 group-hover:opacity-0 transition-opacity duration-500`}></div>
              
              {/* Image (shows on hover) */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
                <img 
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-md group-hover:bg-green-500 transition-colors duration-500">
                  {React.cloneElement(item.icon, {
                    className: `text-4xl ${hoveredIndex === index ? 'text-white' : 'text-green-500'} transition-colors duration-500`
                  })}
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-white transition-colors duration-500">{item.label}</h3>
                <p className="text-gray-600 mb-6 flex-grow group-hover:text-white/90 transition-colors duration-500">{item.desc}</p>
                
                <div className="inline-flex items-center text-green-500 font-medium group-hover:text-white transition-colors duration-500">
                  View listings
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                       fill="none" 
                       stroke="currentColor" 
                       viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            to='/browse'
            className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Browse All Listings
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => {
          setIsSearchModalOpen(false);
          setSearchQuery('');
        }}
        initialSearchQuery={searchQuery}
      />
    </section>
  );
};

export default AmenitiesSpotlight;