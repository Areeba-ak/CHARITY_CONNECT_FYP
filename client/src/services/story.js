import api from "../utils/api";

// =======================
// STORY SERVICES
// =======================

// Submit story (needy user)
export const submitStory = async (data) => {
  // If caller provided a FormData (with files), send multipart/form-data
  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    const res = await api.post("/stories/submit", data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  const res = await api.post("/stories/submit", data);
  return res.data;
};

// Get approved stories (public)
export const getApprovedStories = async (category) => {
  const url = category ? `/stories/approved?category=${encodeURIComponent(category)}` : `/stories/approved`;
  const res = await api.get(url);
  return res.data;
};

// Get in-progress stories (approved/verified)
export const getInProgressStories = async (category) => {
  const url = category ? `/stories/inprogress?category=${encodeURIComponent(category)}` : `/stories/inprogress`;
  const res = await api.get(url);
  return res.data;
};

// Get completed stories
export const getCompletedStories = async (category) => {
  const url = category ? `/stories/completed?category=${encodeURIComponent(category)}` : `/stories/completed`;
  const res = await api.get(url);
  return res.data;
};

// Get stories submitted by logged-in user
export const getMyStories = async () => {
  const res = await api.get('/stories/mine');
  return res.data;
};

// Get pending stories (public)
export const getPendingStories = async () => {
  const res = await api.get("/stories/pending");
  return res.data;
};

// Get single story by id
export const getStoryById = async (id) => {
  const res = await api.get(`/stories/${id}`);
  return res.data;
};

// Admin: approve story
export const approveStory = async (storyId) => {
  const res = await api.put(`/stories/approve/${storyId}`);
  return res.data;
};

// Admin: delete story
export const deleteStory = async (storyId) => {
  const res = await api.delete(`/admin/story/${storyId}`);
  return res.data;
};
