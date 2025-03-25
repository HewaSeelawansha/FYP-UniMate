const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const bookingController = require('../controller/bookingController');
const verifyToken = require('../middleware/verifyToken');

router.post('/', bookingController.postBooking)
router.get('/:email/:id', bookingController.getBookigsByUserListing)
router.get('/:id', bookingController.getBookigsByListing)
router.get('/user/:email', bookingController.getBookigsByEmail)
router.patch('/:id', bookingController.updateBooking)
router.patch('/status/:id', bookingController.updateStatus)
router.delete('/:id', bookingController.deleteBooking)

module.exports = router;