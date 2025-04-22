const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentControllers');
const verifyToken = require('../middleware/verifyToken');

//post payments to the db
router.post('/', verifyToken, paymentController.postPaymentItem)

// Get all payments for a specific student email
router.get('/', verifyToken, paymentController.getPayements)

// Gey payments associated to specific owner
router.get('/owner/:email', paymentController.getPaymentsByListing);


module.exports = router;