import React from 'react'
import Banner from '../../components/Banner'
import Carousel from './Carousel'
import PopularPlaces from './PopularPlaces'
import Testimonials from './Testimonials'
import Services from './Services'

const Home = () => {
  return (
    <div>
      <Banner/>
      <Carousel/>
      <PopularPlaces/>
      <Testimonials/>
      <Services/>
    </div>
  )
}

export default Home
