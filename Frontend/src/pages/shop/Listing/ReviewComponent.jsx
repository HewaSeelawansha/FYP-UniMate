import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdEditSquare } from "react-icons/md";
import useAuth from "../../../hooks/useAuth";
import useUser from "../../../hooks/useUser";

const ReviewComponent = ({listing}) => {
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
        console.log(reviewData)
        try{
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
      try{
      const updateResponse = await axiosSecure.patch(`/reviews/${uId}`, reviewData);
      if (updateResponse.data) {
          Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Review Added Successfully!',
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
          title: 'Failed to Add Review',
          text: 'An error occurred while creating the review',
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
         if(res) {
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

    return(
        <div className="bg-black rounded-lg p-4">
          <div className="pb-4">
            <h2 className={`text-white ${reviews.length > 0 ? 'mb-4' : 'mb-2'} text-xl font-semibold`}>
              Reviews from your peers
            </h2>
            <div className="border bg-blue-200 rounded-lg pb-4 px-2 max-h-[300px] overflow-y-auto">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div
                    key={index}
                    className="mt-4 p-4 bg-black border border-gray-700 rounded-lg relative"
                  >
                    <div className="absolute top-2 right-2 flex space-x-2">
                      {review.email === user?.email && (
                        <button
                          onClick={() => toggleUpdate(review)}
                          className="p-1 m-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                        >
                          <MdEditSquare />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="font-bold mt-2 text-white">{review.reviewText}</p>
                    <div className="flex justify-between gap-4 mt-2 text-gray-400">
                      <p>By {review.email}</p>
                      <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-green bg-black rounded-lg px-2 mt-4 font-bold">
                  No reviews found for this listing
                </p>
              )}
            </div>
          </div>

          {/* Conditional Rendering for Add or Update Review */}
          {user ? (
          isUser ? (
          !update ? (
            <div className="bg-blue-200 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">Add Review</h2>
              <label className="block text-sm font-medium text-gray-700">Your Rating</label>
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`cursor-pointer text-4xl ${i < rating ? 'text-green' : 'text-black'}`}
                    onClick={() => setRating(i + 1)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Your Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Add your review here"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green focus:border-green"
                  rows="2"
                />
              </div>

              <button
                onClick={handleAddReview}
                className="w-full mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-green hover:text-black focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2"
              >
                Add Review
              </button>
            </div>
          ) : (
            <div className="bg-blue-200 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">Update Your Review</h2>
              <label className="block text-sm font-medium text-gray-700">Your Rating</label>
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`cursor-pointer text-4xl ${i < uRating ? 'text-green' : 'text-black'}`}
                    onClick={() => setURating(i + 1)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Your Review</label>
                <textarea
                  value={uReviewText}
                  onChange={(e) => setUReviewText(e.target.value)}
                  placeholder="Add your review here"
                  className="bg-black text-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green focus:border-green"
                  rows="4"
                />
              </div>

              <button
                onClick={handleUpdateReview}
                className="w-full mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-green hover:text-black"
              >
                Update Review
              </button>

              <button
                onClick={handleDeleteReview}
                className="w-full mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-emerald-500"
              >
                Delete
              </button>

              <button
                onClick={() => setUpdate(false)}
                className="w-full mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-500"
              >
                Back to Add Review
              </button>
            </div>
          )) : (
            <div className="bg-gray-200 rounded-lg">
              <div className="p-4">
                <p className="font-bold">
                  Only students can add
                  <span className="text-green"> reviews </span>for the
                  listings.
                </p>
              </div>
            </div>
          )):
          (<div className="bg-gray-200 font-bold rounded-lg p-4">Please<span className="text-green"> login </span>to add review</div>)
          }
        </div>
    );
};

export default ReviewComponent;