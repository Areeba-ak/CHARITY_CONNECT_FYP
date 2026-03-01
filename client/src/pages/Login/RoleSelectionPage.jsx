import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper, Grid, Avatar } from "@mui/material";

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: "#f0f4f8",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 5,
          width: 450,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" color="#37474f" fontWeight="bold" gutterBottom  sx={{ mb: 7 }}>
          𝗦𝗘𝗟𝗘𝗖𝗧 𝗬𝗢𝗨𝗥 𝗥𝗢𝗟𝗘 
        </Typography>

        <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>

          {/* Donor */}
          <Grid item xs={12}>
            <Avatar
              src={`${process.env.PUBLIC_URL}/assets/donor.png`}
              alt="Donor"
              sx={{
                  width: 80,
                  height: 80,
                  margin: "auto",
                  mb: 2.5,
                  boxShadow: 3
                }}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#125ca1" },
              }}
              onClick={() => navigate("/login/donor")}
            >
              DONOR Login
            </Button>
          </Grid>

          {/* Needy */}
          <Grid item xs={12}>
            <Avatar
              src={`${process.env.PUBLIC_URL}/assets/needy.png`}
              alt="Needy"
              sx={{
                  width: 80,
                  height: 80,
                  margin: "auto",
                  mb: 2.5,
                  boxShadow: 3
                }}

            />
            <Button
              variant="contained"
              fullWidth
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                backgroundColor: "#388e3c",
                "&:hover": { backgroundColor: "#2e7d32" },
              }}
              onClick={() => navigate("/login/needy")}
            >
              NEEDY Login
            </Button>
          </Grid>

          {/* Admin */}
          <Grid item xs={12}>
            <Avatar
              src={`${process.env.PUBLIC_URL}/assets/admin.png`}
              alt="Admin"
              sx={{
                  width: 80,
                  height: 80,
                  margin: "auto",
                  mb: 2.5,
                  boxShadow: 3
                }}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                backgroundColor: "#6a1b9a",
                "&:hover": { backgroundColor: "#4a148c" },
              }}
              onClick={() => navigate("/login/admin")}
            >
              ADMIN Login
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default RoleSelectionPage;
