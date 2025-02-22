import React from 'react'
import { Carousel } from "flowbite-react";

const Categories = () => {
  return (
    <div className='section-container py-10'>
      <div className="h-[600px] sm:h-[600px] xl:h-[650px] 2xl:h-[750px]">
      <Carousel slideInterval={3000}>
        <img src="https://i.ibb.co/Vc9xZnHv/pexels-falling4utah-2724748.jpg" alt="..." />
        <img src="https://i.ibb.co/kg53H7C9/pexels-binyaminmellish-186077.jpg" alt="..." />
        <img src="https://i.ibb.co/v6M1rD6Y/pexels-dropshado-2251247.jpg" alt="..." />
      </Carousel>
    </div>
    </div>
  )
}

export default Categories
