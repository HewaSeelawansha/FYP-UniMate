const express = require('express');
const chatController = require('../controller/chatController');
const router = express.Router();

// post a chat
router.post("/", chatController.createChat);

// get chat by id
router.get('/:id', chatController.getChatById);

// get chat of two by ids
router.get('/find/:fid/:sid', chatController.getChat);

module.exports = router;