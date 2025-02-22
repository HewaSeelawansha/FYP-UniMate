import React from 'react'

const Banner = () => {
  return (
    <div className='section-container bg-gradient-to-r from-[#FAFAFA] from-0 to-[#FCFCFC] to-100%'>
      <div className='py-24 flex flex-col md:flex-row-reverse justify-between items-center gap-8'>
        {/*image*/}
        <div className='md:w-1/2'>
            <img src="/images/home/bannern.png" alt="" />
        </div>
        {/*text*/}
        <div className='md:w-1/2 px-4'>
            <h2 className='pb-5 md:text-5xl text-4xl font-bold md:leading-snug leading-snug'>Your <span className='text-green'>Ideal Home Away </span> 
            from Home Awaits</h2>
            <p className='pb-7 text-xl text-[#4A4A4A]'>Discover the Perfect Boarding House for Your University Life! Find Comfortable, Affordable, and Convenient Living Spaces Near Campus
            Secure, Student-Friendly, and Tailored to Your Needs.</p>
            <button className='btn bg-green px-8 py-3 font-semibold text-white rounded-3xl'>UniMate</button>
        </div>
      </div>
    </div>
  )
}

export default Banner
