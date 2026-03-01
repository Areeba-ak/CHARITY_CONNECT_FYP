const express = require('express');
const router = express.Router();
const { makeDonation, getMyDonations } = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware'); // keep adminOnly if needed later

// Create a donation and log on blockchain
router.post('/make', protect, makeDonation);

// Get donations for logged-in user
router.get('/my', protect, getMyDonations);

module.exports = router;
