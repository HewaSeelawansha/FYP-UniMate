const express = require('express');
const router = express.Router();
const Boarding = require('../models/boarding');
const boardingController = require('../controller/boardingController')

// get all boardings
router.get('/', boardingController.getAllBoardings)

// post a boarding
router.post('/', boardingController.postBoarding)

// delete a boarding
router.delete('/:id', boardingController.deleteBoarding)

// get single boarding
router.get('/:id', boardingController.singleBoarding);

// get owner boarding
router.get('/owner/:owner', boardingController.ownerBoarding);

// update single boarding
router.patch('/:id', boardingController.updateBoarding)

// status update
router.patch('/status/:id', boardingController.statusBoarding)

module.exports = router;