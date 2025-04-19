import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdEditSquare } from "react-icons/md";
import useAuth from "../../../hooks/useAuth";
import useUser from "../../../hooks/useUser";

const ReviewComponent = ({ listing }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [uReviewText, setUReviewText] = useState('');
    const [uId, setUId] = useState();
    const [uRating, setURating] = useState(0);
    const [update, setUpdate] = useState(false);
    const axiosSecure = useAxiosSecure();
    const [isUser, isUserLoading] = useUser();

    const fetchReviews = async () => {
        if (!listing) return;
        try {
            const response = await fetch(`http://localhost:3000/reviews/${listing}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch reviews: ${response.statusText}`);
            }
            const data = await response.json();
            setReviews(data.reviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [listing]);

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
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Customer Reviews
                    {reviews.length > 0 && (
                        <span className="ml-2 text-green-500">({reviews.length})</span>
                    )}
                </h2>
                
                {reviews.length > 0 ? (
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                        {reviews.map((review, index) => (
                            <div
                                key={index}
                                className="p-6 bg-gray-50 rounded-lg relative border border-gray-200"
                            >
                                {review.email === user?.email && (
                                    <div className="absolute top-4 right-4 flex space-x-2">
                                        <button
                                            onClick={() => toggleUpdate(review)}
                                            className="p-2 text-green-500 hover:text-green-600 transition-colors"
                                            title="Edit review"
                                        >
                                            <MdEditSquare className="text-xl" />
                                        </button>
                                    </div>
                                )}
                                
                                <div className="flex items-center space-x-2 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-xl ${i < review.rating ? 'text-orange-400' : 'text-orange-300'}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                    <span className="text-gray-500 ml-2">{review.rating}.0</span>
                                </div>
                                
                                <p className="text-gray-800 mb-4">{review.reviewText}</p>
                                
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <p className="font-medium">By {review.email}</p>
                                    <p>
                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                        <p className="text-green-800 font-medium">
                            No reviews found for this listing
                        </p>
                    </div>
                )}
            </div>

            {/* Conditional Rendering for Add or Update Review */}
            {user ? (
                isUser ? (
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
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Student Reviews Only</h3>
                        <p className="text-gray-600">
                            Only students can submit reviews for listings.
                        </p>
                    </div>
                )
            ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Please Sign In</h3>
                    <p className="text-gray-600 mb-4">
                        You need to sign in to submit a review for this listing.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-md transition-colors"
                    >
                        Sign In
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewComponent;