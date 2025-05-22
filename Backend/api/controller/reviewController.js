const Review = require("../models/review");
const Listing = require("../models/listing");
const { analyzeReviewSentiment } = require('../utils/listingNLP');

const getAllReviews = async (req, res) => {
    try {
        const { listingId } = req.params;  

        const reviews = await Review.find({ listing: listingId }).sort({createdAt: -1});  
        
        if (!reviews) {
            return res.status(404).json({ message: 'No reviews found for this listing.' });
        }

        return res.status(200).json({
            message: 'Reviews fetched successfully',
            reviews
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addReview = async (req, res) => {
    const { listingId, email, rating, reviewText } = req.body;
    try {
        const { sentiment, score } = analyzeReviewSentiment(reviewText);

        const newReview = new Review({
            listing: listingId,
            email,
            rating,
            reviewText,
            sentiment,
            sentimentScore: score
        });

        await newReview.save();

        const listing = await Listing.findById(listingId);
        listing.reviewCount += 1;
        
        const reviews = await Review.find({ listing: listingId });
        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        listing.rating = Math.round(averageRating * 10) / 10; 

        await listing.save();
        
        res.status(200).json({ 
            message: "Review added successfully", 
            review: newReview,
            listing 
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding review", error });
    }
};

const editReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;

    try {
        const { sentiment, score } = analyzeReviewSentiment(reviewText);

        const review = await Review.findByIdAndUpdate(
            reviewId,
            { 
                rating, 
                reviewText,
                sentiment,
                sentimentScore: score 
            },
            { new: true, runValidators: true }
        );

        const listing = await Listing.findById(review.listing);
        const reviews = await Review.find({ listing: listing._id });
        
        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        listing.rating = Math.round(averageRating * 10) / 10;
        
        await listing.save();

        res.status(200).json({ 
            message: "Review updated successfully", 
            review, 
            listing 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error editing review", 
            error 
        });
    }
};

const deleteReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findByIdAndDelete(reviewId);

        const listing = await Listing.findById(review.listing);
        listing.reviewCount -= 1;
        const reviews = await Review.find({ listing: listing._id });
        const averageRating = reviews.length > 0 
            ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
            : 0;
        listing.rating = Math.round(averageRating);
        await listing.save();

        res.status(200).json({ message: "Review deleted successfully", listing });
    } catch (error) {
        res.status(500).json({ message: "Error deleting review", error });
    }
};

module.exports = {
    addReview,
    getAllReviews,
    editReview,
    deleteReview,
}