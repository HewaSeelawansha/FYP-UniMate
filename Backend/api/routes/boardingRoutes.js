const express = require('express');
const router = express.Router();
const Boarding = require('../models/boarding');
const boardingController = require('../controller/boardingController')

// get all menus
router.get('/', boardingController.getAllBoardings)

// post a menu item
router.post('/', boardingController.postBoarding)

// delete a menu item
router.delete('/:id', boardingController.deleteBoarding)

// get single menu item
router.get('/:id', boardingController.singleBoarding);

// get owner boarding
router.get('/owner/:owner', boardingController.ownerBoarding);

// update single menu item
router.patch('/:id', boardingController.updateBoarding)

// status update
router.patch('/status/:id', boardingController.statusBoarding)

module.exports = router;