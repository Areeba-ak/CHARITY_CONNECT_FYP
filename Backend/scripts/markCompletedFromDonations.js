require('dotenv').config();
const connectDB = require('../config/db');
const Donation = require('../models/Donation');
const Story = require('../models/Story');

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not set in .env');
      process.exit(1);
    }

    await connectDB();

    // Find all distinct story IDs that have at least one donation
    const storyIds = await Donation.distinct('story');

    if (!storyIds || storyIds.length === 0) {
      console.log('No donations found. Nothing to update.');
      process.exit(0);
    }

    let updated = 0;
    for (const id of storyIds) {
      if (!id) continue;
      const story = await Story.findById(id);
      if (!story) continue;
      if (story.status !== 'completed') {
        story.status = 'completed';
        await story.save();
        updated++;
        console.log(`Marked story ${id} as completed`);
      }
    }

    console.log(`Done. Updated ${updated} stories to 'completed'.`);
    process.exit(0);
  } catch (err) {
    console.error('Reconciliation failed:', err);
    process.exit(1);
  }
})();
