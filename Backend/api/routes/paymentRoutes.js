const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentControllers');
const verifyToken = require('../middleware/verifyToken');

//post payments to the db
router.post('/', verifyToken, paymentController.postPaymentItem)

// Get all payments for a specific email
router.get('/', verifyToken, paymentController.getPayements)

module.exports = router;