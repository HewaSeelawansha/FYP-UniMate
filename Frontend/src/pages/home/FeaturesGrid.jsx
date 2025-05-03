import React from 'react';
import { FaSearch, FaHeart, FaMapMarkerAlt, FaUserShield } from 'react-icons/fa';

const FeaturesGrid = () => {
  const features = [
    {
      icon: <FaSearch className="w-8 h-8 text-green-500" />,
      title: "Easy Search",
      description: "Find the perfect place with our advanced filters and location-based search"
    },
    {
      icon: <FaHeart className="w-8 h-8 text-green-500" />,
      title: "Verified Listings",
      description: "All properties are personally verified by our team for quality assurance"
    },
    {
      icon: <FaMapMarkerAlt className="w-8 h-8 text-green-500" />,
      title: "Prime Locations",
      description: "Homes located within walking distance to campus and amenities"
    },
    {
      icon: <FaUserShield className="w-8 h-8 text-green-500" />,
      title: "Safe Community",
      description: "Student-only environments with 24/7 security in most locations"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">

        {/* <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose StudentHomes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We've designed our platform specifically for student needs and budgets
          </p>
        </div> */}

        <div className='text-left'>
          <p className='text-xl font-semibold uppercase text-green-500'>Why Choose UniMate</p>
          <h2 className='title md:w-[550px]'>Specifically for student needs and budgets</h2>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white shadow-md p-8 rounded-xl hover:shadow-2xl transition-all duration-300 border border-green-500"
            >
              <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;