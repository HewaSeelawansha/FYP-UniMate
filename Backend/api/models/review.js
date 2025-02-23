const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        required: true,
        trim: true
    }
},  {
    timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
