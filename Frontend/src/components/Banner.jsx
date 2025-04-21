import React from 'react';
import { motion } from 'framer-motion';
import bannerImg from '/bannerBG.png';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <section className="relative h-screen max-h-screen overflow-hidden">
      {/* Background image - ensure this loads first */}
      <img 
        src={bannerImg} 
        alt="Modern student accommodation"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null; 
          e.target.src = 'https://via.placeholder.com/1920x1080'; // fallback image
        }}
      />
      
      {/* Dark overlay - make sure this is below content */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      
      {/* Content container - increased z-index */}
      <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-white relative z-20" // Added another z-index here
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Your Perfect <span className="text-green-400">Student Home</span> Awaits
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Discover comfortable, affordable living spaces designed for student life. 
            Safe, convenient, and tailored to your university needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to='/browse' className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105">
              Browse Listings
            </Link>
            <Link to='/owner' className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-medium border border-white/30 transition-all duration-300">
              List Your Property
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Scrolling indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroBanner;