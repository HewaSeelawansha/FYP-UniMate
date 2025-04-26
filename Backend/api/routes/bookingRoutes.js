const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const bookingController = require('../controller/bookingController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin')

router.post('/', bookingController.postBooking)
router.get('/', verifyToken, verifyAdmin, bookingController.getAllBookings)
router.get('/owner/:email', bookingController.getBookingsByOwner)
router.get('/user/:email', bookingController.getBookigsByEmail)
router.get('/:email/:id', bookingController.getBookigsByUserListing)
router.patch('/:id', bookingController.updateBooking)
router.patch('/status/:id', bookingController.updateStatus)
router.delete('/:id', bookingController.deleteBooking)

module.exports = router;