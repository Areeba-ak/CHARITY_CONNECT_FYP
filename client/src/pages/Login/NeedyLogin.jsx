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

const NeedyLogin = () => {
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
      const res = await api.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "needy") navigate("/needyDashboard");
      else if (res.data.role === "donor") navigate("/donorDashboard");
      else navigate("/");
    } catch (err) {
      setBackendError(err.response?.data?.message || "Login failed");
    }
  };

  // 🔐 Google Login
  const handleGoogleLogin = () => {
    const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000";
    window.location.href = `${apiBase.replace(/\/$/, "")}/api/auth/google?role=needy`;
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
        marginTop: 4, // ✅ SAME AS DONOR
      }}
    >
      <Paper elevation={3} sx={{ width: 360, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          𝐍𝐄𝐄𝐃𝐘 LOGIN
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

        <Typography variant="body2" align="center">
          Don't have an account?{" "}
          <span
            style={{ color: "#1976d2", cursor: "pointer" }}
            onClick={() => navigate("/needy/signup")}
          >
            Signup
          </span>
        </Typography>

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

export default NeedyLogin;
