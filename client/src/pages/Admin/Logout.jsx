import React, { useEffect } from "react";
import { Typography, Box, CircularProgress, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/"), 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh", // keeps it centered vertically
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            bgcolor: "white",
            minWidth: 300,
            maxWidth: 400,
          }}
        >
          <CircularProgress size={40} color="primary" sx={{ mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            Logging out...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You will be redirected shortly.
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}
