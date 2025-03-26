import { Carousel } from 'flowbite-react';
import React, { useEffect, useState } from 'react'

const BoardingComponent = ({owner}) => {
    const [boarding, setBoarding] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBoarding = async () => {
          if (!owner) return;
          try {
            const response = await fetch(`http://localhost:3000/boarding/owner/${owner}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch boarding: ${response.statusText}`);
            }
            const data = await response.json();
            setBoarding(data); 
          } catch (error) {
            console.error("Error fetching boarding:", error);
          } finally {
            setLoading(false);
          }
        };
      
        fetchBoarding();
    }, [owner]);

    return (
        <div>
            <div className="bg-black rounded-lg">
            <div className='flex gap-4 pt-4 px-4'>
                <div className="w-full bg-blue-200 p-2 rounded-lg">
                <p className="font-bold">Name: <span className="font-normal">{boarding?.name}</span></p>
                <p className="font-bold mt-2">Owner: <span className="font-normal">{boarding?.owner}</span></p>
                <p className="font-bold mt-2">Address: <span className="font-normal">{boarding?.address}</span></p>
                <p className="font-bold mt-2">Phone: <span className="font-normal">0{boarding?.phone}</span></p>
                <p className="font-bold">For: <span className="font-normal">{boarding?.gender}</span></p>
                <p className="font-bold mt-2">Description: <span className="font-normal">{boarding?.description}</span></p>
                <p className="font-bold mt-2">Total Beds: <span className="font-normal">{boarding?.beds}</span></p>
                <p className="font-bold mt-2">Since: <span className="font-normal">{new Date(boarding?.createdAt).toLocaleDateString()}</span></p>
                </div>
                </div>
                <div className="rounded-lg p-4 h-[300px] md:h-[500px] xl:h-[600px] 2xl:h-[700px]">
                {boarding?(
                    <Carousel slideInterval={5000}>
                    {boarding?.images && boarding?.images?.length > 0 ? (
                    boarding?.images.map((image, index) => (
                        <img
                        key={index}
                        src={image}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full"
                        />
                    ))
                    ) : (
                    <></>
                    )}
                </Carousel>
                ):(<></>)}
                </div>
            </div>
        </div>
    );
};

export default BoardingComponent