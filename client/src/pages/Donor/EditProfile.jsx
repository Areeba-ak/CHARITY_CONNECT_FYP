import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Avatar,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import PhoneField from "../../components/PhoneField";
import { getMe, updateMyProfile } from "../../services/auth";

const genders = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const EditProfile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    address: "",
    city: "",
    dob: "",
    gender: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMe();
        // getMe returns user object
        setProfile((p) => ({ ...p, ...data }));
      } catch (err) {
        console.error("Failed to load profile:", err.message || err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const save = async () => {
      try {
        await updateMyProfile(profile);
        alert("Profile updated successfully");
      } catch (err) {
        console.error("Update failed:", err.message || err);
        alert("Failed to update profile");
      }
    };

    save();
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ width: "100%", padding: { xs: 2, md: 0 } }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Edit Profile
      </Typography>

        <Grid container spacing={3}>
          {/* LEFT CARD */}
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                minHeight: "50vh",
                maxWidth: "500px",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Edit Profile Information
              </Typography>

              <Grid container spacing={2}>

          {/* First Name + Last Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              fullWidth
              value={profile.firstName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              fullWidth
              value={profile.lastName}
              onChange={handleChange}
            />
          </Grid>

          {/* Email + Contact */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={profile.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <PhoneField
              label="Contact Number"
              name="contact"
              value={profile.contact}
              onChange={(contact) => setProfile({ ...profile, contact })}
              errors={null}
            />
          </Grid>

          {/* Address + City */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address"
              name="address"
              fullWidth
              value={profile.address}
              onChange={handleChange}
            />
          </Grid>

          {/* DOB + Gender */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              fullWidth
              value={profile.dob}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              name="city"
              fullWidth
              value={profile.city}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Gender"
              name="gender"
              select
              fullWidth
              value={profile.gender}
              onChange={handleChange}
            >
              {genders.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

        </Grid>

            <Box textAlign="center" mt={3}>
              <Button
                variant="contained"
                color="success"
                sx={{ borderRadius: 2, px: 4 }}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* RIGHT CARD – PROFILE PICTURE */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
              textAlign: "center",
              minHeight: "30vh",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Profile Picture
            </Typography>

            <Avatar
              src={profile.avatar || "/assets/user.png"}
              sx={{ width: 120, height: 120, mb: 2 }}
            />

            <label htmlFor="avatar-upload">
              <input
                accept="image/*"
                id="avatar-upload"
                type="file"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditProfile;
