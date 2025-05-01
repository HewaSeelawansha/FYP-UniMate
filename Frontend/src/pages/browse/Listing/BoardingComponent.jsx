import { Carousel } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import useAxiosPublic from "../../../hooks/useAxiosPublic"

const BoardingComponent = ({ owner }) => {
    const [boarding, setBoarding] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();

    useEffect(() => {
        const fetchBoarding = async () => {
            if (!owner) return;
            try {
                const response = await axiosPublic.get(`/boarding/owner/${owner}`);
                setBoarding(response.data);
            } catch (error) {
                console.error("Error fetching boarding:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBoarding();
    }, [owner]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!boarding) {
        return (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-lg">
                <p className="text-green-800 font-medium">
                    Boarding house information not available.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Information Card */}
            <div className="overflow-hidden">
                <div className="pb-4 md:pb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{boarding.name}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="bg-green-100 p-2 rounded-lg mr-4">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">OWNER</h3>
                                    <p className="text-lg font-medium text-gray-900">{boarding.owner}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-green-100 p-2 rounded-lg mr-4">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">ADDRESS</h3>
                                    <p className="text-lg font-medium text-gray-900">{boarding.address}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-green-100 p-2 rounded-lg mr-4">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">PHONE</h3>
                                    <p className="text-lg font-medium text-gray-900">0{boarding.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="bg-green-100 p-2 rounded-lg mr-4">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">FOR</h3>
                                    <p className="text-lg font-medium text-gray-900 capitalize">{boarding.gender}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-green-100 p-2 rounded-lg mr-4">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">TOTAL BEDS</h3>
                                    <p className="text-lg font-medium text-gray-900">{boarding.beds}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-green-100 p-2 rounded-lg mr-4">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">SINCE</h3>
                                    <p className="text-lg font-medium text-gray-900">
                                        {new Date(boarding.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {boarding.description && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                            <p className="text-gray-700 leading-relaxed bg-green-100 p-4 rounded-lg">
                                {boarding.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Carousel */}
            <div className="rounded-xl shadow-xl overflow-hidden">
                <div className="relative h-[300px] md:h-[500px]">
                    {boarding?.images?.length > 0 ? (
                        <Carousel slideInterval={5000} indicators={false}>
                            {boarding.images.map((image, index) => (
                                <div key={index} className="relative h-full w-full">
                                    <img
                                        src={image}
                                        alt={`Boarding house ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <span className="text-white font-medium">
                                            Photo {index + 1} of {boarding.images.length}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                    ) : (
                        <div className="bg-gray-100 h-full flex items-center justify-center">
                            <span className="text-gray-400">No images available</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BoardingComponent;