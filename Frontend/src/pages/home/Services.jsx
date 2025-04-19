import React from 'react'
import ser1 from '/images/services/uniser1.png'
import ser2 from '/images/services/uniser2.png'
import ser3 from '/images/services/uniser3.png'
import ser4 from '/images/services/uniser4.png'
import ser5 from '/images/services/uniser5.png'
import ser6 from '/images/services/uniser6.png'
import ser7 from '/images/services/uniser7.png'

const Services = () => {
  return (
    <div className='px-24 py-4 bg-green-500'>
      <div className='flex flex-col text-white md:flex-row items-center justify-between gap-12'>
        {/*text*/}
        <div className='md:w-1/2'>
            <div className='text-left md:w-4/5'>
                <p className='uppercase'>About Us</p>
                <h2 className='title'>Our Journey and Services</h2>
                <p className='my-5 text-gray-300 leading-[30px]'>
                Rooted in a commitment to student living, we make finding the perfect boarding house effortless, offering a seamless experience that connects students with safe, affordable, and convenient accommodations.
                </p>
                <button className='btn bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full'>Explore</button>
            </div>
        </div>
        {/*text*/}
        <div className='md:w-1/2'>
          <div className="carousel carousel-center rounded-box">
            <div className="h-[400px] carousel-item">
              <img src={ser4}
              alt="Pizza" />
            </div>
            <div className="h-[400px] carousel-item">
              <img
                src={ser6}
                alt="Pizza" />
            </div>
            <div className="h-[400px] carousel-item">
              <img
                src={ser1}
                alt="Pizza" />
            </div>
            <div className="h-[400px] carousel-item">
              <img
                src={ser5}
                alt="Pizza" />
            </div>
            <div className="h-[400px] carousel-item">
              <img src={ser7}
              alt="Pizza" />
            </div>
            <div className="h-[400px] carousel-item">
              <img src={ser3}
              alt="Pizza" />
            </div>
            <div className="h-[400px] carousel-item">
              <img
                src={ser2}
                alt="Pizza" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services
