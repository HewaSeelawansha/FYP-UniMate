const express = require('express');
const messageController = require('../controller/messageController');
const router = express.Router();

// add message
router.post("/", messageController.createMessage);

// get chat messages by id
router.get('/:chatId', messageController.getChatMessages);

module.exports = router;