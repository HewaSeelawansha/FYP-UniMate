const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentControllers');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin')

//get all paymets
router.get('/', verifyToken, verifyAdmin, paymentController.getAllPayments)

// Get all payments for a specific student email
router.get('/:email', verifyToken, paymentController.getPayementsStudent)

// Gey payments associated to specific owner
router.get('/owner/:email', paymentController.getPaymentsByListing);

//post payments to the db
router.post('/', verifyToken, paymentController.postPaymentItem)

module.exports = router;