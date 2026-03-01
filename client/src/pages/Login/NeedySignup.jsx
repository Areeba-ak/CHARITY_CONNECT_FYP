import React, { useState } from "react";
import api from "../../utils/api";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

const NeedySignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    profession: "",
    address: "",
    city: "",
    password: "",
    confirmPassword: "",
    cnicImage: null,
  });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setBackendError("");
  };

  const handleFile = (e) =>
    setFormData({ ...formData, cnicImage: e.target.files[0] });

  const validate = () => {
    let tempErrors = {};
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName) tempErrors.firstName = "First name is required";
    if (!lastName) tempErrors.lastName = "Last name is required";
    if (!email) tempErrors.email = "Email is required";
    else if (!email.endsWith("@gmail.com"))
      tempErrors.email = "Email must be @gmail.com";

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

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });
    data.append("role", "needy");
    if (formData.gender) data.set("gender", formData.gender.toLowerCase());

    try {
      const res = await api.post("/auth/register/needy", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "needy");
      navigate("/login/needy");
    } catch (err) {
      setBackendError(err.response?.data?.message || "Signup failed");
    }
  };

  const handleGoogleSignup = () => {
    const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000";
    window.location.href = `${apiBase.replace(/\/$/, "")}/api/auth/google?role=needy`;
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
        marginTop: 6, // ✅ SAME AS DONOR
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 420,
          mt: 7, // ✅ SAME AS DONOR
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          𝐍𝐄𝐄𝐃𝐘 SIGNUP
        </Typography>

        {backendError && (
          <Typography color="error" align="center" sx={{ mb: 1 }}>
            {backendError}
          </Typography>
        )}

        <TextField label="First Name" name="firstName" fullWidth margin="normal" onChange={handleChange} error={Boolean(errors.firstName)} helperText={errors.firstName} />
        <TextField label="Last Name" name="lastName" fullWidth margin="normal" onChange={handleChange} error={Boolean(errors.lastName)} helperText={errors.lastName} />
        <TextField label="Email" name="email" fullWidth margin="normal" onChange={handleChange} error={Boolean(errors.email)} helperText={errors.email} />

        <TextField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          onChange={handleChange}
        />

        <TextField select label="Gender" name="gender" fullWidth margin="normal" onChange={handleChange}>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </TextField>

        <TextField label="Profession" name="profession" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Address" name="address" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="City" name="city" fullWidth margin="normal" onChange={handleChange} />

        <Divider sx={{ my: 2 }}>Verification</Divider>

        <Button component="label" fullWidth variant="outlined" sx={{ mb: 2 }}>
          Upload CNIC
          <input type="file" hidden onChange={handleFile} />
        </Button>

        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((p) => !p)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          onChange={handleChange}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword((p) => !p)}>
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button fullWidth variant="contained" sx={{ mt: 2, mb: 1, backgroundColor: "#479e43" }} onClick={handleSubmit}>
          Signup
        </Button>

        <Typography variant="body2" align="center">
          Already have an account?{" "}
          <span style={{ color: "#1976d2", cursor: "pointer" }} onClick={() => navigate("/login/needy")}>
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

export default NeedySignup;
