import api from "../utils/api";

// Create news (admin)
export const createNews = (data) => api.post("/news", data);

// Get all news
export const getAllNews = () => api.get("/news");

export default api;