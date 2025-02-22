import React from 'react'

const Services = () => {
  return (
    <div className='section-container my-16'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-12'>
        {/*text*/}
        <div className='md:w-1/2'>
            <div className='text-left md:w-4/5'>
                <p className='subtitle uppercase'>About Us</p>
                <h2 className='title'>Our Journey and Services</h2>
                <p className='my-5 text-secondary leading-[30px]'>
                Rooted in a commitment to student living, we make finding the perfect boarding house effortless, offering a seamless experience that connects students with safe, affordable, and convenient accommodations.
                </p>
                <button className='btn bg-green text-white px-8 py-3 rounded-full'>Explore</button>
            </div>
        </div>
        {/*text*/}
        <div className='md:w-1/2'>
          <div className="carousel carousel-center rounded-box">
            <div className="carousel-item">
              <img src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp" 
              alt="Pizza" />
            </div>
            <div className="carousel-item">
              <img
                src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp"
                alt="Pizza" />
            </div>
            <div className="carousel-item">
              <img
                src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp"
                alt="Pizza" />
            </div>
            <div className="carousel-item">
              <img
                src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp"
                alt="Pizza" />
            </div>
            <div className="carousel-item">
              <img src="https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp" 
              alt="Pizza" />
            </div>
            <div className="carousel-item">
              <img src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp" 
              alt="Pizza" />
            </div>
            <div className="carousel-item">
              <img
                src="https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp"
                alt="Pizza" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services
