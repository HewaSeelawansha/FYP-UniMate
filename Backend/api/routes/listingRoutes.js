const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const listingController = require('../controller/listingControllers');
const verifyToken = require('../middleware/verifyToken');

//get listing by email
router.get('/owner', verifyToken, listingController.getListingsByEmail);

// get all listings
router.get('/', listingController.getAllListings)

// search for listings
router.get('/search', listingController.searchListing)

// post a listing
router.post('/', listingController.postListing)

// delete a listing
router.delete('/:id', listingController.deleteListing)

// get single listing
router.get('/:id', listingController.singleListing);

// update listing
router.patch('/:id', listingController.updateListing)

// update listing status
router.patch('/status/:id', listingController.statusListing)

// update payment status
router.patch('/payment/:id', listingController.paymentListing)

module.exports = router;