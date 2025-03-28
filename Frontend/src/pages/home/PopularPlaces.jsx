import React, { useEffect, useState } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Cards from '../../components/Cards';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

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

const SpecialDishes = () => {
  const [recipes, setRecipes] = useState([]);
  const slider = React.useRef(null);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch('http://localhost:3000/listing'); // Fetch from your MongoDB API
              const data = await response.json();
              // Filter for popular items
              const specials = data.filter(item => item.category === "");
              setRecipes(data);
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
        slidesToShow: 4,
        slidesToScroll: 3,
        initialSlide: 4,
        responsive: [
            {
              breakpoint: 1433,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 2,
                infinite: true,
                dots: true
              }
            },
            // {
            //   breakpoint: 1024,
            //   settings: {
            //     slidesToShow: 2,
            //     slidesToScroll: 1,
            //     infinite: true,
            //     dots: true
            //   }
            // },
            {
              breakpoint: 945,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 660,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true
              }
            }
          ],
        nextArrow: <SimpleNextArrow />,
        prevArrow: <SimplePrevArrow />
    };
  return (
    <div className='section-container my-20 relative'>
      <div className='text-left'>
        <p className='subtitle'>Top Picks</p>
        <h2 className='title md:w-[520px]'>Popular Boarding Houses</h2>
      </div>
      {/* arrow */}
      <div className='md:absolute right-3 top-8 mb-10 md:mr-24'>
        <button onClick={() => slider?.current?.slickPrev()} className='btn p-2 rounded-full ml-5'>
            <FaAngleLeft className='w-8 h-8 p-1'/>
        </button>
        <button onClick={() => slider?.current?.slickNext()} className='btn p-2 rounded-full ml-5 bg-green'>
            <FaAngleRight className='w-8 h-8 p-1'/>
        </button>
      </div>
      <Slider ref={slider} {...settings} className='overflow-hidden mt-10 gap-5'>
        {
            recipes.map((item, i) => (
                <Cards key={i} item={item}/>
            ))
        }
      </Slider>
    </div>
  )
}

export default SpecialDishes
