const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const bookingController = require('../controller/bookingController');
const verifyToken = require('../middleware/verifyToken');

// get all menus
router.get('/:id', bookingController.getAllListings)

// post a menu item
router.post('/', bookingController.postListing)

// update single menu item
router.patch('/:id', bookingController.updateListing)

// update single menu item
router.patch('/status/:id', bookingController.updateListing)

module.exports = router;