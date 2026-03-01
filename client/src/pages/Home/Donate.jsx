import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { getMe } from "../../services/auth";

const DonationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storyData = location.state; // story info from InProgressStoryDetails

  const [category, setCategory] = useState("");
  const [user, setUser] = useState(null);
  const [formValues, setFormValues] = useState({
    amount: "",
  });
  const [errors, setErrors] = useState({});

  // Auto-fill category if coming from a story, and fetch user data
  useEffect(() => {
    if (storyData?.category) {
      setCategory(storyData.category);
    }
    
    // Fetch current user data
    (async () => {
      try {
        const userData = await getMe();
        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    })();
  }, [storyData]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formValues.amount) newErrors.amount = "Amount is required";
    else if (isNaN(formValues.amount) || Number(formValues.amount) <= 0)
      newErrors.amount = "Amount must be a positive number";

    if (!category) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const donationState = {
        storyId: storyData?.storyId || null,
        title: storyData?.title || null,
        category: category,
        amount: formValues.amount,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
      };

      try {
        sessionStorage.setItem("donationState", JSON.stringify(donationState));
      } catch (e) {}

      navigate("/Payment", { state: donationState });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f6fa",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 3, textAlign: "center", letterSpacing: 1, mt: -8, color: "#0a5666" }}
      >
        DONATION
      </Typography>

      <Box
        sx={{
          width: 480,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 2,
          p: 4,
          pl: 7,
        }}
      >
        {storyData && (
          <Typography variant="h6" sx={{ mb: 2 }}>
            Donating to: {storyData.title}
          </Typography>
        )}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Enter Your Amount"
              variant="outlined"
              size="small"
              name="amount"
              value={formValues.amount}
              onChange={handleInputChange}
              error={!!errors.amount}
              helperText={errors.amount}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl size="small" sx={{ minWidth: 220 }} error={!!errors.category}>
              <Select
                displayEmpty
                value={category}
                onChange={handleCategoryChange}
                renderValue={(selected) => (selected ? selected : "Select Category")}
                disabled={!!storyData} // lock category if story-based
                MenuProps={{
                  PaperProps: { style: { maxHeight: 200, overflowY: "auto" } },
                }}
              >
                <MenuItem value="education">Education</MenuItem>
                <MenuItem value="health">Health</MenuItem>
                <MenuItem value="women">Women Empowerment</MenuItem>
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>

        <Typography
          variant="subtitle1"
          sx={{ textAlign: "left", fontWeight: "bold", mb: 2, fontSize: "0.95rem" }}
        >
          YOUR INFORMATION
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Name:</strong> {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Email:</strong> {user?.email || "Loading..."}
          </Typography>        
        </Box>

        <Button
          variant="contained"
          sx={{
            mt: 3,
            width: 450,
            backgroundColor: "#2e7d32",
            color: "#fff",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#1b5e20" },
          }}
          onClick={handleSubmit}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default DonationPage;