const Review = require("../models/review");
const Listing = require("../models/listing");

const getAllReviews = async (req, res) => {
    try {
        const { listingId } = req.params;  // Extract the listingId from the URL

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
        // Create a new review
        const newReview = new Review({
            listing: listingId,
            email,
            rating,
            reviewText
        });
        await newReview.save();

        // Find the listing and update review count and average rating
        const listing = await Listing.findById(listingId);
        listing.reviewCount += 1;
        const reviews = await Review.find({ listing: listingId });
        listing.rating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        await listing.save();

        res.status(200).json({ message: "Review added successfully", listing });
    } catch (error) {
        res.status(500).json({ message: "Error adding review", error });
    }
};

const editReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;

    try {
        // Find and update the review
        const review = await Review.findByIdAndUpdate(
            reviewId,
            { rating, reviewText },
            { new: true, runValidators: true }
        );

        // Recalculate and update the average rating for the listing
        const listing = await Listing.findById(review.listing);
        const reviews = await Review.find({ listing: listing._id });
        listing.rating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        await listing.save();

        res.status(200).json({ message: "Review updated successfully", review, listing });
    } catch (error) {
        res.status(500).json({ message: "Error editing review", error });
    }
};

const deleteReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        // Find the review and delete it
        const review = await Review.findByIdAndDelete(reviewId);

        // Update the listing's review count and rating
        const listing = await Listing.findById(review.listing);
        listing.reviewCount -= 1;
        const reviews = await Review.find({ listing: listing._id });
        listing.rating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;
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