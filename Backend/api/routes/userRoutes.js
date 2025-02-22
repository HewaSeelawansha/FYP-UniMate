// Corrected userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/userControllers');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Specific routes 
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);
router.get('/roommates/:email', userController.getRUsers); 
router.get('/admin/:email', verifyToken, userController.getAdmin);
router.get('/owner/:email', verifyToken, userController.getOwner);
router.get('/user/:email', verifyToken, userController.getNUser);
router.get('/:email', userController.getUser); 

router.post('/', userController.createUser);
router.delete('/:id', verifyToken, verifyAdmin, userController.deleteUser);
router.patch('/admin/:id', verifyToken, verifyAdmin, userController.makeAdmin);
router.patch('/update/:id', verifyToken, userController.updateUser);
router.patch('/roommate/:id', verifyToken, userController.updateRoommate);
router.patch('/owner/:id', verifyToken, verifyAdmin, userController.makeOwner);

module.exports = router;
