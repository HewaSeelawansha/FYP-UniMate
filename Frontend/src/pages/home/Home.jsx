import React from 'react'
import Banner from '../../components/Banner'
import UniversityHubLocator from './UniversityHubLocator'
import PropertyShowcase from './PropertyShowcase'
import Testimonials from './Testimonials'
import AmenitiesSpotlight from './AmenitiesSpotlight'
import FeaturesGrid from './FeaturesGrid'
import CallToAction from './CallToAction'
import ActionBanner from './ActionBanner'
import Services from './Services'

const Home = () => {
  return (
    <div>
      <Banner/>
      <ActionBanner/>
      <UniversityHubLocator/>
      <AmenitiesSpotlight/>
      <FeaturesGrid/>
      <PropertyShowcase/>
      <Testimonials/>
      <Services/>
    </div>
  )
}

export default Home
