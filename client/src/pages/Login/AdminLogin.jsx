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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const navigate = useNavigate();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setBackendError("");
  };

  const validate = () => {
    let tempErrors = {};

    if (!formData.email) tempErrors.email = "Email is required";
    else if (!formData.email.endsWith("@gmail.com"))
      tempErrors.email = "Email must be @gmail.com";

    if (!formData.password) tempErrors.password = "Password is required";
    else if (formData.password.length < 8)
      tempErrors.password = "Password must be at least 8 characters";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await api.post("/auth/admin/login", formData);

      // Persist token and role so client requests use the correct identity
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
      }

      navigate("/adminDashboard");
    } catch (err) {
      setBackendError(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000";
    window.location.href = `${apiBase.replace(/\/$/, "")}/api/auth/google?role=admin`;
  };

  return (
    <Box
      sx={{
        background: "#f0f4f8",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        marginTop: 4, // ✅ SAME AS DONOR & NEEDY
      }}
    >
      <Paper elevation={3} sx={{ width: 360, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          𝐀𝐃𝐌𝐈𝐍 LOGIN
        </Typography>

        {backendError && (
          <Typography color="error" align="center" mb={1}>
            {backendError}
          </Typography>
        )}

        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
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
                <IconButton onClick={handleTogglePassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography
          variant="body2"
          sx={{ textAlign: "right", mt: 1, color: "#1976d2", cursor: "pointer" }}
        >
          Forgot password?
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{ backgroundColor: "#479e43", mt: 2, mb: 1 }}
          onClick={handleSubmit}
        >
          Login
        </Button>

        <Divider sx={{ my: 2 }}>OR</Divider>

        <Button
          fullWidth
          onClick={handleGoogleLogin}
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            mt: 1.5,
            textTransform: "none",
            border: "1px solid #ccc",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/google.jpeg`}
            alt="Google"
            style={{ width: 24, height: 24, marginRight: 8 }}
          />
          Login with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
