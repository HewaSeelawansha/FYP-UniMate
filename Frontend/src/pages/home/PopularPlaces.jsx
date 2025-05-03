import React, { useEffect, useState } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Cards from '../../components/Cards';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import useAxiosPublic from "../../hooks/useAxiosPublic"

const SimpleNextArrow = (props) => {
    const {className, style, onClick} = props;
    return (
        <div className={className} style={{...style, display:"block", background: "red"}} onClick={onClick}>NEXT</div>
    );
}

const SimplePrevArrow = (props) => {
    const {className, style, onClick} = props;
    return (
        <div className={className} style={{...style, display:"block", background: "green"}} onClick={onClick}>PREV</div>
    );
}

const PopularPlaces = () => {
  const [listings, setListings] = useState([]);
  const slider = React.useRef(null);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axiosPublic.get('/listing'); 
              const data = await response.data;
              const highestRating = data.filter(item => item.status === "Approved" && item.payStatus === "Done" && item.rating > 3);
              setListings(highestRating);
          } catch (error) {
              console.error("Error fetching data: ", error);
          }
      };

      fetchData();
  }, []);
    //settings
    const settings = {
        dots: true,
        infinite: false,
        speed: 300,
        slidesToShow: 4, //6
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            // {
            //   breakpoint: 1992,
            //   settings: {
            //     slidesToShow: 5,
            //     slidesToScroll: 5,
            //     infinite: true,
            //     dots: true
            //   }
            // },
            // {
            //   breakpoint: 1820,
            //   settings: {
            //     slidesToShow: 4,
            //     slidesToScroll: 4,
            //     infinite: true,
            //     dots: true
            //   }
            // },
            {
              breakpoint: 1433,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
              }
            },
            {
              breakpoint: 660,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ],
        nextArrow: <SimpleNextArrow />,
        prevArrow: <SimplePrevArrow />
    };
  return (
    <div className='container mx-auto my-20 relative'>
      <div className='text-left'>
        <p className='text-xl font-semibold uppercase text-green-500'>Featured Places</p>
        <h2 className='title md:w-[550px]'>Popular Boarding Houses</h2>
      </div>
      {/* arrow */}
      <div className='md:absolute right-3 top-8 mb-10 md:mr-24'>
        <button onClick={() => slider?.current?.slickPrev()} className='btn p-2 rounded-full ml-5  hover:bg-emerald-300 bg-emerald-200'>
            <FaAngleLeft className='w-8 h-8 p-1'/>
        </button>
        <button onClick={() => slider?.current?.slickNext()} className='btn p-2 rounded-full ml-5 hover:bg-emerald-600 bg-emerald-500'>
            <FaAngleRight className='w-8 h-8 p-1'/>
        </button>
      </div>
      <Slider ref={slider} {...settings} className='overflow-hidden mt-10 gap-5'>
        {
            listings.map((item, i) => (
                <Cards key={i} item={item}/>
            ))
        }
      </Slider>
    </div>
  )
}

export default PopularPlaces
