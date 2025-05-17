import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { FaUserGraduate, FaHome, FaUserTie, FaClock } from 'react-icons/fa';

const StatsSection = () => {
  const stats = [
    {
      icon: <FaUserGraduate className="text-green-500" />,
      count: 1000,
      label: 'Happy Students',
      description: 'Students who found their ideal home'
    },
    {
      icon: <FaHome className="text-green-500" />,
      count: 250,
      label: 'Verified Properties',
      description: 'Quality assured accommodations'
    },
    {
      icon: <FaUserTie className="text-green-500" />,
      count: 15,
      label: 'Property Owners',
      description: 'Trusted landlords and partners'
    },
    {
      icon: <FaClock className="text-green-500" />,
      count: 24,
      suffix: 'hr',
      label: 'Average Move-in Time',
      description: 'Quick and hassle-free process'
    }
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={container}
      className="py-16 mt-24 md:py-10 px-4"
    >
      <div className="container mx-auto px-4">
        <motion.div 
          variants={item}
          className="mx-auto bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-500 border border-green-100"
        >
          {/* <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-4 px-6">
            <h2 className="text-xl md:text-2xl font-bold text-white">UniMate by the Numbers</h2>
          </div> */}
          
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={item}
                className="p-6 md:p-8 flex flex-col items-center text-center"
              >
                <div className="mb-4 text-4xl">{stat.icon}</div>
                <div className="flex items-center mb-2">
                  <CountUp 
                    end={stat.count} 
                    duration={3} 
                    enableScrollSpy 
                    scrollSpyDelay={300}
                    className="text-3xl md:text-4xl font-bold text-gray-800" 
                  />
                  {stat.suffix && (
                    <span className="text-3xl md:text-4xl font-bold text-gray-800 ml-1">
                      {stat.suffix}
                    </span>
                  )}
                  <span className="text-3xl md:text-4xl font-bold text-green-500 ml-1">+</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{stat.label}</h3>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default StatsSection;