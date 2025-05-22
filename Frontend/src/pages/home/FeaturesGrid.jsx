import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaShieldAlt, 
  FaMapMarkerAlt, 
  FaComments,
  FaCreditCard,
  FaStar,
  FaUniversity,
  FaMobile
} from 'react-icons/fa';

const UniMateFeatures = () => {
  const features = [
    {
      icon: <FaUniversity className="w-8 h-8" />,
      title: "NSBM-Exclusive",
      description: "Dedicated platform exclusively for NSBM students with verified university emails",
      color: "bg-gradient-to-br from-green-400 to-green-600"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Verified Listings",
      description: "Every boarding house is personally verified by our admin team for authenticity",
      color: "bg-gradient-to-br from-emerald-400 to-emerald-600"
    },
    {
      icon: <FaSearch className="w-8 h-8" />,
      title: "Advanced Search",
      description: "Filter by price, distance from NSBM, room type, and 15+ amenities",
      color: "bg-gradient-to-br from-teal-400 to-teal-600"
    },
    {
      icon: <FaMapMarkerAlt className="w-8 h-8" />,
      title: "Campus Proximity",
      description: "Find accommodations within 1-5km radius of NSBM Green University Town",
      color: "bg-gradient-to-br from-lime-400 to-lime-600"
    },
    {
      icon: <FaCreditCard className="w-8 h-8" />,
      title: "Secure Payments",
      description: "Integrated Stripe payment gateway for safe online transactions",
      color: "bg-gradient-to-br from-cyan-400 to-cyan-600"
    },
    {
      icon: <FaComments className="w-8 h-8" />,
      title: "Direct Messaging",
      description: "Real-time chat with boarding house owners for quick communication",
      color: "bg-gradient-to-br from-green-400 to-green-600"
    },
    {
      icon: <FaStar className="w-8 h-8" />,
      title: "Student Reviews",
      description: "Read authentic feedback from previous tenants before booking",
      color: "bg-gradient-to-br from-emerald-400 to-emerald-600"
    },
    {
      icon: <FaMobile className="w-8 h-8" />,
      title: "Mobile-Friendly",
      description: "Fully responsive design works perfectly on all devices",
      color: "bg-gradient-to-br from-teal-400 to-teal-600"
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
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <p className="text-xl font-semibold uppercase text-green-500 mb-2">UniMate Advantages</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Students Choose Our Platform
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Designed specifically to solve NSBM students' accommodation challenges with innovative features
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.3 }
              }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className={`h-2 w-full ${feature.color}`}></div>
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold ml-4 text-gray-800 pt-2">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 md:p-12 shadow-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl font-bold text-white mb-2">Ready to Find Your Perfect Boarding House?</h3>
              <p className="text-green-50">
                Join hundreds of NSBM students who found their ideal accommodation through UniMate
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/browse" 
                className="px-8 py-3 bg-white text-green-600 font-medium rounded-xl hover:bg-green-50 transition-colors text-center"
              >
                Browse Listings
              </a>
              <a 
                href="/owner" 
                className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-center"
              >
                List Your Property
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UniMateFeatures;