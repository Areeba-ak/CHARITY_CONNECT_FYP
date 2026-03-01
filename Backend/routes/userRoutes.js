const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
  getUserById,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Logged-in user
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.put("/me/change-password", protect, require('../controllers/userController').changePassword);
router.delete('/me', protect, require('../controllers/userController').deleteMyAccount);

// Admin
router.get("/:id", protect, adminOnly, getUserById);

module.exports = router;
