import React from 'react'
import Banner from '../../components/Banner'
import UniversityHubLocator from './UniversityHubLocator'
import PropertyShowcase from './PropertyShowcase'
import Testimonials from './Testimonials'
import AmenitiesSpotlight from './AmenitiesSpotlight'
import FeaturesGrid from './FeaturesGrid'
import CallToAction from './CallToAction'

const Home = () => {
  return (
    <div>
      <Banner/>
      <UniversityHubLocator/>
      <AmenitiesSpotlight/>
      <FeaturesGrid/>
      <PropertyShowcase/>
      <Testimonials/>
      <CallToAction/>
    </div>
  )
}

export default Home
