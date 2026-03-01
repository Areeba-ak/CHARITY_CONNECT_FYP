import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const DonorSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setBackendError("");
  };

  const validate = () => {
    const tempErrors = {};
    const {
      firstName,
      lastName,
      email,
      dob,
      gender,
      address,
      city,
      password,
      confirmPassword,
    } = formData;

    if (!firstName) tempErrors.firstName = "First name is required";
    if (!lastName) tempErrors.lastName = "Last name is required";
    if (!email) tempErrors.email = "Email is required";
    else if (!email.endsWith("@gmail.com"))
      tempErrors.email = "Email must be @gmail.com";
    if (!dob) tempErrors.dob = "Date of birth is required";
    if (!gender) tempErrors.gender = "Gender is required";
    if (!address) tempErrors.address = "Address is required";
    if (!city) tempErrors.city = "City is required";
    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 8)
      tempErrors.password = "Password must be at least 8 characters";
    if (!confirmPassword)
      tempErrors.confirmPassword = "Confirm password is required";
    else if (password !== confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const payload = {
        role: "donor",
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        dateOfBirth: formData.dob,
        gender: formData.gender.toLowerCase(),
        address: formData.address,
        city: formData.city,
        password: formData.password,
      };

      const res = await api.post("/auth/register", payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "donor");
      navigate("/login/donor");
    } catch (err) {
      setBackendError(err.response?.data?.message || "Signup failed");
    }
  };

  const handleGoogleSignup = () => {
    const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000";
    window.location.href = `${apiBase.replace(/\/$/, "")}/api/auth/google?role=donor`;
  };

  return (
    <Box
      sx={{
        background: "#f0f4f8",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        overflow: "auto",
        marginTop: 6,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 420,
          mt: 7,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          𝐃𝐎𝐍𝐎𝐑 SIGNUP
        </Typography>

        {backendError && (
          <Typography color="error" align="center" sx={{ mb: 1 }}>
            {backendError}
          </Typography>
        )}

        <TextField
          label="First Name"
          name="firstName"
          fullWidth
          margin="normal"
          value={formData.firstName}
          onChange={handleChange}
          error={Boolean(errors.firstName)}
          helperText={errors.firstName}
        />

        <TextField
          label="Last Name"
          name="lastName"
          fullWidth
          margin="normal"
          value={formData.lastName}
          onChange={handleChange}
          error={Boolean(errors.lastName)}
          helperText={errors.lastName}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />

        <TextField
          label="Date of Birth"
          name="dob"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={formData.dob}
          onChange={handleChange}
          error={Boolean(errors.dob)}
          helperText={errors.dob}
        />

        <TextField
          select
          label="Gender"
          name="gender"
          fullWidth
          margin="normal"
          value={formData.gender}
          onChange={handleChange}
          error={Boolean(errors.gender)}
          helperText={errors.gender}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </TextField>

        <TextField
          label="Address"
          name="address"
          fullWidth
          margin="normal"
          value={formData.address}
          onChange={handleChange}
          error={Boolean(errors.address)}
          helperText={errors.address}
        />

        <TextField
          label="City"
          name="city"
          fullWidth
          margin="normal"
          value={formData.city}
          onChange={handleChange}
          error={Boolean(errors.city)}
          helperText={errors.city}
        />

        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirm ? "text" : "password"}
          fullWidth
          margin="normal"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, mb: 1, backgroundColor: "#479e43" }}
          onClick={handleSubmit}
        >
          Signup
        </Button>

        <Typography variant="body2" align="center">
          Already have an account?{" "}
          <span
            style={{ color: "#1976d2", cursor: "pointer" }}
            onClick={() => navigate("/login/donor")}
          >
            Login
          </span>
        </Typography>

        <Divider sx={{ my: 2 }}>OR</Divider>

        {/* GOOGLE SIGNUP */}
        <Button
          fullWidth
          onClick={handleGoogleSignup}
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            textTransform: "none",
            border: "1px solid #ccc",
            gap: 1.5,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
          startIcon={
            <img
              src={`${process.env.PUBLIC_URL}/assets/google.jpeg`}
              alt="Google"
              style={{ width: 24, height: 24 }}
            />
          }
        >
          Signup with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default DonorSignup;
