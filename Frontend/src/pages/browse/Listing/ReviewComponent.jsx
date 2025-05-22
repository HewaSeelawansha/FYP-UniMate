import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic"
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdEditSquare } from "react-icons/md";
import useAuth from "../../../hooks/useAuth";
import useUser from "../../../hooks/useUser";

const ReviewComponent = ({ id, listing }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [sortedReviews, setSortedReviews] = useState([]);
    const [sortMethod, setSortMethod] = useState('recent');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [uReviewText, setUReviewText] = useState('');
    const [uId, setUId] = useState();
    const [uRating, setURating] = useState(0);
    const [update, setUpdate] = useState(false);
    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();
    const [isUser, isUserLoading] = useUser();
    const [booking, setBooking] = useState(null);
    
    const sortReviews = (reviews, method = 'recent') => {
        switch(method) {
            case 'positive-first':
                return [...reviews].sort((a,b) => b.sentimentScore - a.sentimentScore);
            case 'critical-first':
                return [...reviews].sort((a,b) => a.sentimentScore - b.sentimentScore);
            case 'highest-rating':
                return [...reviews].sort((a,b) => b.rating - a.rating);
            case 'lowest-rating':
                return [...reviews].sort((a,b) => a.rating - b.rating);
            default:
                return [...reviews].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    };

    useEffect(() => {
        const fetchBooking = async () => {
            setLoading(true); 
            try {
                const response = await axiosSecure.get(`http://localhost:3000/booking/${user?.email}/${id}`);
                setBooking(response.data); 
            } catch (error) {
                console.error("Error fetching booking:", error);
                setBooking(null); 
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [user?.email, id]);

    const fetchReviews = async () => {
        if (!listing) return;
        try {
            const response = await axiosPublic.get(`/reviews/${listing}`);
            setReviews(response.data.reviews);
            setSortedReviews(sortReviews(response.data.reviews, sortMethod));
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [listing]);

    useEffect(() => {
        setSortedReviews(sortReviews(reviews, sortMethod));
    }, [sortMethod, reviews]);

    const refetchReview = () => {
        setLoading(true);
        fetchReviews();
    }

    const handleAddReview = async () => {
        const reviewData = {
            listingId: listing,
            email: user.email,
            rating: rating,
            reviewText: reviewText
        };
        
        try {
            const updateResponse = await axiosSecure.post('/reviews', reviewData);
            if (updateResponse.data) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Review Added Successfully!',
                    showConfirmButton: false,
                    timer: 1500,
                });
                setRating(0);
                setReviewText('');
                refetchReview();
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Failed to Add Review',
                text: 'An error occurred while creating the review',
            });
        }
    };

    const handleUpdateReview = async () => {
        const reviewData = {
            rating: uRating,
            reviewText: uReviewText
        };
        try {
            const updateResponse = await axiosSecure.patch(`/reviews/${uId}`, reviewData);
            if (updateResponse.data) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Review Updated Successfully!',
                    showConfirmButton: false,
                    timer: 1500,
                });
                setURating(0);
                setUReviewText('');
                setUpdate(false);
                refetchReview();
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Failed to Update Review',
                text: 'An error occurred while updating the review',
            });
        }
    };

    const handleDeleteReview = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.delete(`/reviews/${uId}`);
                if (res) {
                    setUpdate(false);
                    refetchReview();
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Your review has been deleted",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
        });
    }

    const toggleUpdate = (review) => {
        setUpdate((prevUpdate) => !prevUpdate);
        setURating(review.rating);
        setUReviewText(review.reviewText);
        setUId(review._id);
    };

    return (
        <div className="pb-6">
            <div className="pb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Customer Reviews
                        {reviews.length > 0 && (
                            <span className="ml-2 text-green-500">({reviews.length})</span>
                        )}
                    </h2>
                    
                    {reviews.length > 0 && (
                        <div className="mt-4 md:mt-0">
                            <label htmlFor="sort-method" className="sr-only">Sort reviews</label>
                            <select
                                id="sort-method"
                                value={sortMethod}
                                onChange={(e) => setSortMethod(e.target.value)}
                                className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-lg"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="positive-first">Most Positive</option>
                                <option value="critical-first">Most Critical</option>
                                <option value="highest-rating">Highest Rating</option>
                                <option value="lowest-rating">Lowest Rating</option>
                            </select>
                        </div>
                    )}
                </div>
                
                {reviews.length > 0 ? (
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                        {sortedReviews.map((review, index) => (
                            <div
                                key={index}
                                className={`p-6 ${review.sentiment==='positive'?'bg-emerald-50':review.sentiment==='negative'?'bg-red-50':'bg-gray-50'} rounded-lg relative border border-gray-200`}
                            >
                                {review.email === user?.email && (
                                    <div className="absolute bottom-4 right-4 flex space-x-2">
                                        <button
                                            onClick={() => toggleUpdate(review)}
                                            className="p-2 text-green-500 hover:text-green-600 transition-colors"
                                            title="Edit review"
                                        >
                                            <MdEditSquare className="text-xl" />
                                        </button>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                        review.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-800' :
                                        review.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {review.sentiment}
                                    </span>
                                </div>
                                
                                <div className="flex items-center space-x-2 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-xl ${i < review.rating ? 'text-orange-400' : 'text-orange-200'}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                    <span className="text-gray-500 ml-2">{review.rating}.0</span>
                                </div>
                                
                                <p className="text-gray-800 mb-4">{review.reviewText}</p>
                                
                                <div className="text-sm text-gray-500">
                                    <p>
                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                        })} • {' '}
                                        <span className="font-medium">{review.email}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-green-100 border border-green-200 rounded-xl p-6 text-center">
                        <p className="text-green-800 font-medium">
                            No reviews found for this listing
                        </p>
                    </div>
                )}
            </div>

            {/* Conditional Rendering for Add or Update Review */}
            {user ? (
                isUser && booking && booking.status==='Approved' ? (
                    !update ? (
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Your Review</h2>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                                <div className="flex items-center space-x-2">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`cursor-pointer text-3xl ${i < rating ? 'text-orange-400' : 'text-gray-300'}`}
                                            onClick={() => setRating(i + 1)}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Share your experience with this property..."
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    rows="4"
                                />
                            </div>

                            <button
                                onClick={handleAddReview}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                            >
                                Submit Review
                            </button>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Update Your Review</h2>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                                <div className="flex items-center space-x-2">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`cursor-pointer text-3xl ${i < uRating ? 'text-orange-400' : 'text-gray-300'}`}
                                            onClick={() => setURating(i + 1)}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                                <textarea
                                    value={uReviewText}
                                    onChange={(e) => setUReviewText(e.target.value)}
                                    placeholder="Update your review..."
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    rows="4"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={handleUpdateReview}
                                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                                >
                                    Update
                                </button>

                                <button
                                    onClick={handleDeleteReview}
                                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                                >
                                    Delete
                                </button>

                                <button
                                    onClick={() => setUpdate(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Verified Reviews Only</h3>
                        <p className="text-green-800 mb-4">
                            Only students who have booked and had their booking accepted can add reviews.
                        </p>
                    </div>
                )
            ) : (
                <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Please Login</h3>
                    <p className="text-green-800 mb-4">
                    Sign in to submit a review for this listing.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReviewComponent;