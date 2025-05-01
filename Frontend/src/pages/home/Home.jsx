import React, { useState, useEffect } from 'react';
import Banner from '../../components/Banner';
import UniversityHubLocator from './UniversityHubLocator';
import AmenitiesSpotlight from './AmenitiesSpotlight';
import FeaturesGrid from './FeaturesGrid';
import Services from './Services';
import PopularPlaces from './PopularPlaces';
import StatsSection from './StatsSection';
import AIChatbot from '../../components/AIChatbot';

const Home = () => {

  return (
    <div>
      <Banner/>
      <PopularPlaces/>
      <StatsSection/>
      <UniversityHubLocator/>
      <AmenitiesSpotlight/>
      <FeaturesGrid/>
      <Services/>

      <AIChatbot />
    </div>
  );
};

export default Home;