const express = require('express');
const router = express.Router();
const { submitStory, getApprovedStories, getPendingStories, getStoryById, approveStory } = require('../controllers/storyController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Use a dedicated uploads folder for story supporting documents
const storyUploader = upload.createUploader('uploads/stories');

router.post('/submit', protect, storyUploader.array('files'), submitStory);
router.get('/approved', getApprovedStories);
router.get('/inprogress', require('../controllers/storyController').getInProgressStories);
router.get('/completed', require('../controllers/storyController').getCompletedStories);
router.get('/mine', protect, require('../controllers/storyController').getMyStories);
router.get('/pending', getPendingStories);
router.get('/:id', getStoryById);
router.put('/approve/:id', protect, adminOnly, approveStory);

module.exports = router;
