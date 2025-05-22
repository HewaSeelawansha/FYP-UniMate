const express = require('express');
const router = express.Router();
const Review = require("../models/review");
const reviewController = require('../controller/reviewController');
const verifyToken = require('../middleware/verifyToken');

//get review by email
router.get('/:listingId', reviewController.getAllReviews);

// post a review
router.post('/', reviewController.addReview);

// delete a review
router.delete('/:reviewId', reviewController.deleteReview);

// update single review
router.patch('/:reviewId', reviewController.editReview);

module.exports = router;