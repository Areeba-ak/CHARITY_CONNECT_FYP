// Admin: Get Dashboard Stats
const User = require("../models/User");
const Story = require("../models/Story");
const Donation = require("../models/Donation");
const Contact = require("../models/Contact");

// ============================
// Admin: Get Dashboard Stats
// ============================
const getDashboardStats = async (req, res) => {
  try {
    /* ---------- BASIC COUNTS ---------- */
    const [
      totalUsers,
      totalDonors,
      totalNeedy,
      totalStories,
      totalApprovedStories,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "donor" }),
      User.countDocuments({ role: "needy" }),
      Story.countDocuments(),
      Story.countDocuments({ status: "approved" }),
    ]);

    /* ---------- TOTAL DONATED AMOUNT ---------- */
    const totalDonatedAmountAgg = await Donation.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalDonatedAmount = totalDonatedAmountAgg[0]?.total || 0;

    /* ---------- MONTHLY DONATIONS ---------- */
    const monthlyDonations = await Donation.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $arrayElemAt: [
              [
                "",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              "$_id",
            ],
          },
          amount: 1,
        },
      },
    ]);

    /* ---------- USER DISTRIBUTION ---------- */
    const userDistribution = [
      { name: "Donors", value: totalDonors },
      { name: "Needy", value: totalNeedy },
    ];

    /* ---------- STORY VERIFICATION QUEUE ---------- */
    const verificationQueue = await Story.find({ status: "pending" })
      .populate("submittedBy", "firstName lastName email")
      .select("title createdAt submittedBy")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Include the real DB id so frontend can request full story details and act on it
    const formattedQueue = verificationQueue.map((story) => ({
      id: story._id,
      name: story.submittedBy
        ? `${story.submittedBy.firstName} ${story.submittedBy.lastName}`
        : "Unknown",
      story: story.title,
      storyId: story._id,
      date: story.createdAt.toISOString().split("T")[0],
    }));

    /* ---------- REPORTS & FEEDBACK ---------- */
    const totalReports = await Contact.countDocuments();
    
    const feedbacksData = await Contact.find().select("message").lean();
    const positiveFeedbacks = feedbacksData.filter(fb => {
      const msg = fb.message.toLowerCase();
      const positiveKeywords = ["good", "excellent", "great", "amazing", "love", "perfect", "helpful", "awesome", "thank", "appreciate", "satisfied", "best"];
      return positiveKeywords.some(keyword => msg.includes(keyword));
    }).length;
    
    const negativeFeedbacks = feedbacksData.filter(fb => {
      const msg = fb.message.toLowerCase();
      const negativeKeywords = ["bad", "poor", "terrible", "awful", "hate", "worst", "problem", "issue", "complaint", "disappointed", "dissatisfied", "useless"];
      return negativeKeywords.some(keyword => msg.includes(keyword));
    }).length;
    
    const positiveFeedbackPercentage = feedbacksData.length > 0
      ? Math.round((positiveFeedbacks / feedbacksData.length) * 100)
      : 0;
    
    const negativeFeedbackPercentage = feedbacksData.length > 0
      ? Math.round((negativeFeedbacks / feedbacksData.length) * 100)
      : 0;

    /* ---------- RECENT ACTIVITIES ---------- */
    const recentDonations = await Donation.find({ status: "completed" })
      .populate("donor", "firstName lastName")
      .populate("story", "title")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    const recentActivities = recentDonations.map((d) => {
      const donorName = d.donor
        ? `${d.donor.firstName || ""} ${d.donor.lastName || ""}`.trim()
        : "Unknown";
      return `Donor ${donorName || "Unknown"} donated PKR ${d.amount} to ${
        d.story?.title || "a story"
      }`;
    });

    /* ---------- FINAL RESPONSE ---------- */
    res.json({
      totalUsers,
      totalApprovedStories,
      totalDonatedAmount,
      monthlyDonations,
      userDistribution,
      verificationQueue: formattedQueue,
      recentActivities,
      totalReports,
      positiveFeedbackPercentage,
      negativeFeedbackPercentage,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};

// ============================
// Admin: Delete User
// ============================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// Admin: Delete Story
// ============================
const deleteStory = async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json({ message: "Story deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// Admin: Get All Donations
// ============================
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donor", "firstName lastName")
      .populate("story", "title")
      .sort({ createdAt: -1 })
      .lean();

    // Normalize donor field to include a `name` property for frontend convenience
    const normalized = donations.map((d) => {
      const donorName = d.donor
        ? `${d.donor.firstName || ""} ${d.donor.lastName || ""}`.trim()
        : "Unknown";
      return {
        ...d,
        donor: { name: donorName },
        story: { title: d.story?.title || "" },
      };
    });

    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get all users (for UserManagement page)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('firstName lastName email role createdAt').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get feedbacks - use Contact messages as feedbacks when no Feedback model exists
const getFeedbacks = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 }).limit(10).lean();
    const feedbacks = contacts.map((c) => ({
      id: c._id,
      user: c.name || c.email,
      feedback: c.message,
      date: c.submittedAt ? c.submittedAt.toISOString().split('T')[0] : '',
    }));

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDashboardStats,
  deleteUser,
  deleteStory,
  getAllDonations,
  getAllUsers,
  getFeedbacks,
};
