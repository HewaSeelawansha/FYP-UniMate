const express = require('express');
const router = express.Router();
const Review = require("../models/review");
const reviewController = require('../controller/reviewController');
const verifyToken = require('../middleware/verifyToken');

//get listing by email
router.get('/:listingId', reviewController.getAllReviews);

// post a menu item
router.post('/', reviewController.addReview);

// delete a menu item
router.delete('/:reviewId', reviewController.deleteReview);

// update single menu item
router.patch('/:reviewId', reviewController.editReview);

module.exports = router;