import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import { changePassword, getMe, updateMyProfile } from "../../services/auth";

export default function Settings() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    avatar: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false
  });

  // ---------- HANDLERS ----------
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // ---------- LOAD PROFILE ----------
  useEffect(() => {
    (async () => {
      try {
        const user = await getMe();
        setProfile({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          avatar: user.avatar || "/assets/admin-avatar.png"
        });
      } catch {
        console.error("Failed to load profile");
      }
    })();
  }, []);

  // ---------- SAVE PROFILE ----------
  const handleProfileSubmit = async () => {
    try {
      await updateMyProfile(profile);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message || "Update failed");
    }
  };

  // ---------- CHANGE PASSWORD ----------
  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await changePassword(passwordData);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      alert("Password updated!");
    } catch (err) {
      alert(err.message || "Password update failed");
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Settings
      </Typography>

      {/* PROFILE */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Profile Information</Typography>

        <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
          <Avatar src={profile.avatar} sx={{ width: 70, height: 70, mr: 2 }} />
          <Button variant="outlined" component="label">
            Change Avatar
            <input hidden type="file" accept="image/*" onChange={handleAvatarChange} />
          </Button>
        </Box>

        <TextField fullWidth label="First Name" name="firstName" value={profile.firstName} onChange={handleProfileChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Last Name" name="lastName" value={profile.lastName} onChange={handleProfileChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Email" name="email" value={profile.email} onChange={handleProfileChange} sx={{ mb: 2 }} />

        <Button variant="contained" onClick={handleProfileSubmit}>Save Profile</Button>
      </Paper>

      {/* PASSWORD */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Change Password</Typography>

        <TextField fullWidth type="password" label="Current Password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} sx={{ mb: 2 }} />
        <TextField fullWidth type="password" label="New Password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} sx={{ mb: 2 }} />
        <TextField fullWidth type="password" label="Confirm Password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} sx={{ mb: 2 }} />

        <Button variant="contained" onClick={handlePasswordSubmit}>Update Password</Button>
      </Paper>
    </Box>
  );
}
