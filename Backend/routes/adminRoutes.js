const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  deleteUser,
  deleteStory,
  getAllDonations,
  getAllUsers,
  getFeedbacks,
} = require('../controllers/adminController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/feedbacks', protect, adminOnly, getFeedbacks);
router.delete('/user/:id', protect, adminOnly, deleteUser);
router.delete('/story/:id', protect, adminOnly, deleteStory);
router.get('/donations', protect, adminOnly, getAllDonations);  

module.exports = router;
