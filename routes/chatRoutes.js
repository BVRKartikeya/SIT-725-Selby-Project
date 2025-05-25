const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/api/chat/users', chatController.getUserEmails);

module.exports = router;
