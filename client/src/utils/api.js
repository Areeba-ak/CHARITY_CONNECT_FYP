import axios from "axios";

const api = axios.create({
  baseURL: "/api", // CRA proxies to backend
  withCredentials: true // send cookies automatically
});

// Attach Authorization header from localStorage on each request (keeps auth consistent
// whether backend uses cookies or bearer tokens). This avoids stale cookie tokens
// (e.g., from OAuth) overriding a freshly logged-in user's session.
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error("Failed to set auth token in request:", e);
  }
  return config;
});

export default api;
