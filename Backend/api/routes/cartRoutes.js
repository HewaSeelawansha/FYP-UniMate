const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartControllers');
const verifyToken = require('../middleware/verifyToken');

// Get all cart items for a specific email
router.get('/', verifyToken, cartController.getCartByEmail);

// Add an item to the cart
router.post('/', cartController.addToCart);

// Delete an item from the cart
router.delete('/:id', cartController.deleteCart)

// Update an item in the cart
router.put('/:id', cartController.updateCart)

module.exports = router;
