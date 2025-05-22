import React, { useState, useEffect } from 'react';
import HeroBanner from '../../components/Banner';
import PopularPlaces from './PopularPlaces';
import StatsSection from './StatsSection';
import Locator from './Locator';
import AmenitiesSpotlight from './AmenitiesSpotlight';
import FeaturesGrid from './FeaturesGrid';
import AIChatbot from '../../components/AIChatbot';
import { motion } from 'framer-motion';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  // Track scroll position for animation effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants for staggered section reveals
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="overflow-hidden">
      <HeroBanner />
      
      {/* <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <StatsSection />
      </motion.div> */}
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <PopularPlaces />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <Locator />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <AmenitiesSpotlight />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <FeaturesGrid />
      </motion.div>
      
      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
};

export default Home;