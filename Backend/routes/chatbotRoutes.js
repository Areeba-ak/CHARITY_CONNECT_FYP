const express = require('express');
const router = express.Router();
const { getHelp } = require('../controllers/chatbotController');

router.post('/assist', getHelp);

module.exports = router;
