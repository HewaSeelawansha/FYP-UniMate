// Corrected userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/userControllers');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Specific routes first
router.get('/roommates', userController.getRUsers); // Specific route first
router.get('/admin/:email', verifyToken, userController.getAdmin);
router.get('/owner/:email', verifyToken, userController.getOwner);
router.get('/user/:email', verifyToken, userController.getNUser);
router.get('/:email', userController.getUser); // Dynamic route last

router.post('/', userController.createUser);
router.delete('/:id', verifyToken, verifyAdmin, userController.deleteUser);
router.patch('/admin/:id', verifyToken, verifyAdmin, userController.makeAdmin);
router.patch('/update/:id', verifyToken, userController.updateUser);
router.patch('/roommate/:id', verifyToken, userController.updateRoommate);
router.patch('/owner/:id', verifyToken, verifyAdmin, userController.makeOwner);

module.exports = router;
