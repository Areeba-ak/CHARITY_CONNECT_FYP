import api from "../utils/api";

// =========================
// AUTHENTICATION SERVICES
// =========================

// Register (Donor / Needy)
export const registerUser = async (userData) => {
  try {
    const res = await api.post("/auth/register", userData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Registration failed");
  }
};

// Login (Donor / Needy)
export const loginUser = async (credentials) => {
  try {
    const res = await api.post("/auth/login", credentials);

    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
    }

    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Login failed");
  }
};

// Get logged-in user profile
export const getMe = async () => {
  try {
    const res = await api.get("/users/me");
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch user"
    );
  }
};

// Update logged-in user's profile
export const updateMyProfile = async (data) => {
  try {
    const res = await api.put("/users/me", data);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Update failed"
    );
  }
};

// Change password (requires current password)
export const changePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
  try {
    const res = await api.put('/users/me/change-password', { currentPassword, newPassword, confirmPassword });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Password change failed');
  }
};


// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

// Delete logged-in user's account
export const deleteMyAccount = async () => {
  try {
    const res = await api.delete('/users/me');
    // Clear local client-side auth state
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to delete account');
  }
};
