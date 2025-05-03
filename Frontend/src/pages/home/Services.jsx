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
    <div className='px-4 xl:px-24 py-16'>
      <div className='container p-4 mx-auto flex flex-col text-white md:flex-row items-center justify-between gap-12'>
        {/*text*/}
        <div className='md:w-1/2'>
            <div className='text-left xl:w-3/5'>
                <p className='text-green-500 text-xl font-semibold uppercase'>About Us</p>
                <h2 className='title text-black'>Our Journey and Services</h2>
                <p className='my-5 text-gray-900 leading-[30px]'>
                Rooted in a commitment to student living, we make finding the perfect boarding house effortless, offering a seamless experience that connects students with safe, affordable, and convenient accommodations.
                </p>
                {/* <button className='btn bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full'>
                  Explore
                </button> */}
            </div>
        </div>
        {/*text*/}
        <div className='md:w-1/2'>
          <div className="border border-green-500 carousel carousel-center rounded-lg">
            <div className="h-[400px] carousel-item">
              <img src={ser4}
              alt="Service" />
            </div>
            <div className="h-[400px] carousel-item">
              <img
                src={ser6}
                alt="Service" />
            </div>
            <div className="h-[400px] carousel-item">
              <img
                src={ser1}
                alt="Service" />
            </div>
            <div className="h-[400px] carousel-item">
              <img
                src={ser5}
                alt="Service" />
            </div>
            <div className="h-[400px] carousel-item">
              <img src={ser7}
              alt="Service" />
            </div>
            <div className="h-[400px] carousel-item">
              <img src={ser3}
              alt="Service" />
            </div>
            <div className="h-[400px] carousel-item">
              <img
                src={ser2}
                alt="Service" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services
