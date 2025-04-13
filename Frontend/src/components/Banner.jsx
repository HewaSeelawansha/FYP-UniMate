import React from 'react';
import { motion } from 'framer-motion';
import bannerImg from '/bannerBG.png'

const HeroBanner = () => {
  return (
    <section className="relative h-screen max-h-screen overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      
      {/* Background image */}
      <img 
        src={bannerImg} 
        alt="Modern student accommodation"
        className="w-full h-full object-cover"
      />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 h-full flex items-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-white"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Your Perfect <span className="text-green-400">Student Home</span> Awaits
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Discover comfortable, affordable living spaces designed for student life. 
            Safe, convenient, and tailored to your university needs.
          </p>
          <div className="flex gap-4">
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105">
              Find Your Home
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-medium border border-white/30 transition-all duration-300">
              How It Works
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Scrolling indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroBanner;