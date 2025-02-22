const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const listingController = require('../controller/listingControllers');
const verifyToken = require('../middleware/verifyToken');

//get listing by email
router.get('/owner', verifyToken, listingController.getListingsByEmail);

// get all menus
router.get('/', listingController.getAllListings)

// post a menu item
router.post('/', listingController.postListing)

// delete a menu item
router.delete('/:id', listingController.deleteListing)

// get single menu item
router.get('/:id', listingController.singleListing);

// update single menu item
router.patch('/:id', listingController.updateListing)

module.exports = router;