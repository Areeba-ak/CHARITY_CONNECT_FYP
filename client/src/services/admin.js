import api from "../utils/api";

// Admin login
export const adminLogin = async (data) => {
  try {
    return await api.post("/auth/admin/login", data);
  } catch (err) {
    throw err;
  }
};


// Dashboard stats
export const getAdminStats = () => {
  return api.get("/admin/stats");
};

export const getAllUsers = () => api.get('/admin/users');
export const getUserById = (id) => api.get(`/users/${id}`);

// Get all donations
export const getAllDonations = () => {
  return api.get("/admin/donations");
};

export const getFeedbacks = () => api.get('/admin/feedbacks');

// Delete user
export const deleteUser = (id) => {
  return api.delete(`/admin/user/${id}`);
};

// Delete story
export const deleteStory = (id) => {
  return api.delete(`/admin/story/${id}`);
};
