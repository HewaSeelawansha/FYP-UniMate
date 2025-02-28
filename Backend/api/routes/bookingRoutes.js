const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const bookingController = require('../controller/bookingController');
const verifyToken = require('../middleware/verifyToken');

router.post('/', bookingController.postBooking)
router.get('/:id', bookingController.getBookigsByListing)
router.get('/user/:email', bookingController.getBookigsByEmail)
router.patch('/:id', bookingController.getBookigsByEmail)
router.patch('/status/:id', bookingController.updateStatus)

module.exports = router;