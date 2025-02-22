import React from 'react'
import { FaStar } from 'react-icons/fa'

const Testimonials = () => {
  return (
    <div className='section-container'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-12'>
        <div className='md:w-1/2'>
            <img src="/images/home/testimonials/testimonialsn.png" alt="" />
        </div>
        <div className='md:w-1/2'>
            <div className='text-left md:w-4/5'>
                <p className='subtitle uppercase'>Students' Reviews</p>
                <h2 className='title'>What Your Peers Say About Us</h2>
                <blockquote className='my-5 text-gray-700 leading-[30px]'>
                    "Finding a boarding house near campus was never this easy! Thanks to this platform, I found a safe, affordable, and comfortable place that perfectly suits my student life."
                </blockquote>
                {/* avatar */}
                <div className='flex items-center gap-4 flex-wrap'>
                    <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                        <div className="avatar">
                            <div className="w-12">
                            <img src="/images/home/testimonials/testimonial1.png" />
                            </div>
                        </div>
                        <div className="avatar">
                            <div className="w-12">
                            <img src="/images/home/testimonials/testimonial2.png" />
                            </div>
                        </div>
                        <div className="avatar">
                            <div className="w-12">
                            <img src="/images/home/testimonials/testimonial3.png" />
                            </div>
                        </div>
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content w-12">
                            <span>+99</span>
                            </div>
                        </div>
                    </div>
                    <div className='space-y-1'>
                        <h5 className='text-lg font-semibold'>Customers' Feedback</h5>
                        <div className='flex items-center gap-2'>
                            <FaStar className='text-red'/>
                            <span className='font-medium'>4.9</span>
                            <span className='text-gray-700'>(21.1k Reviews)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  ) 
}

export default Testimonials
