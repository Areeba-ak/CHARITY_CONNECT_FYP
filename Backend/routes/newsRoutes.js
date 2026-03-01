const express = require('express');
const router = express.Router();
const { createNews, getAllNews } = require('../controllers/newsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllNews);
router.post('/', protect, adminOnly, createNews);

module.exports = router;
