require("dotenv").config();
const Story = require("../models/Story");
const axios = require("axios");

/* ===============================
   AI SUMMARIZATION
================================ */
const summarizeWithAI = async (text) => {
  const systemPrompt = `You are an assistant for Charity Connect.
Summarize the following donation request story in 4 lines or less.
Be clear, concise, and write the summary in English only, regardless of the story language.`;

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY missing in .env");
  }

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      max_tokens: 100,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI summary empty");

  return content.trim();
};

/* ===============================
   SUBMIT STORY (USER)
================================ */
exports.submitStory = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Handle uploaded supporting documents (if any)
    const uploadedFiles = req.files || [];
    const supportingDocuments = uploadedFiles.map((f) => {
      // Normalize path for storage (use forward slashes)
      return f.path ? f.path.replace(/\\\\/g, '/') : f.filename;
    });

    let summary;
    try {
      summary = await summarizeWithAI(description);
    } catch (err) {
      summary = "Summary will be added later.";
    }

    let story = await Story.create({
      title,
      description,
      category,
      summary,
      supportingDocuments,
      submittedBy: req.user._id,
      status: "pending",
    });

    // Populate user names and normalize submittedBy for consistent frontend shape
    const populated = await Story.findById(story._id).populate(
      'submittedBy',
      'firstName lastName'
    ).lean();

    const submitterName = populated.submittedBy
      ? `${populated.submittedBy.firstName || ''} ${populated.submittedBy.lastName || ''}`.trim()
      : 'Unknown';

    res.status(201).json({
      message: 'Story submitted successfully. Awaiting admin approval.',
      data: { ...populated, submittedBy: { name: submitterName } },
    });
  } catch (error) {
    console.error("Submit Story Error:", error.message);
    res.status(500).json({ message: "Failed to submit story" });
  }
};

/* ===============================
   GET APPROVED STORIES (PUBLIC)
================================ */
exports.getApprovedStories = async (req, res) => {
  try {
    const filter = { status: "approved" };
    if (req.query && req.query.category) {
      filter.category = { $regex: new RegExp(req.query.category, 'i') };
    }

    const stories = await Story.find(filter)
      .populate("submittedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .lean();

    const normalized = stories.map((s) => {
      const name = s.submittedBy
        ? `${s.submittedBy.firstName || ""} ${s.submittedBy.lastName || ""}`.trim()
        : "Unknown";
      return { ...s, submittedBy: { name } };
    });

    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET MY STORIES (for logged-in user)
================================ */
exports.getMyStories = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const stories = await Story.find({ submittedBy: userId })
      .populate('submittedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET PENDING STORIES (PUBLIC)
================================ */
exports.getPendingStories = async (req, res) => {
  try {
    const stories = await Story.find({ status: "pending" })
      .populate("submittedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .lean();

    const normalized = stories.map((s) => {
      const name = s.submittedBy
        ? `${s.submittedBy.firstName || ""} ${s.submittedBy.lastName || ""}`.trim()
        : "Unknown";
      return { ...s, submittedBy: { name } };
    });

    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET IN-PROGRESS STORIES (ADMIN-APPROVED / VERIFIED)
================================ */
exports.getInProgressStories = async (req, res) => {
  try {
    // Consider both 'approved' and 'verified' as in-progress
    const filter = { status: { $in: ["approved", "verified"] } };
    if (req.query && req.query.category) {
      filter.category = { $regex: new RegExp(req.query.category, 'i') };
    }

    const stories = await Story.find(filter)
      .populate("submittedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .lean();

    const normalized = stories.map((s) => {
      const name = s.submittedBy
        ? `${s.submittedBy.firstName || ""} ${s.submittedBy.lastName || ""}`.trim()
        : "Unknown";
      return { ...s, submittedBy: { name } };
    });

    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET COMPLETED STORIES (PUBLIC)
================================ */
exports.getCompletedStories = async (req, res) => {
  try {
    const filter = { status: "completed" };
    if (req.query && req.query.category) {
      filter.category = { $regex: new RegExp(req.query.category, 'i') };
    }

    const stories = await Story.find(filter)
      .populate("submittedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .lean();

    const normalized = stories.map((s) => {
      const name = s.submittedBy
        ? `${s.submittedBy.firstName || ""} ${s.submittedBy.lastName || ""}`.trim()
        : "Unknown";
      return { ...s, submittedBy: { name } };
    });

    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET STORY BY ID
================================ */
exports.getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate("submittedBy", "firstName lastName")
      .lean();
    if (story && story.submittedBy) {
      const name = `${story.submittedBy.firstName || ""} ${story.submittedBy.lastName || ""}`.trim();
      story.submittedBy = { name };
    }
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   ADMIN: APPROVE STORY
================================ */
exports.approveStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    story.status = "approved";
    await story.save();

    res.json({ message: "Story approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
