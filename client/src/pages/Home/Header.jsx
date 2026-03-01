import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar
        position="fixed"
        sx={{
          top: '40px',
          right: '18px', // or the actual width of your sidebar
          width: 'calc(95% + 80px)',
          backgroundColor: "#f0f0f0",
          color: "#000",
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        elevation={2}
      >
      <Toolbar>

        {/* Logo and Title */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, pl: 6 }}>
          <Avatar
            src={`${process.env.PUBLIC_URL}/assets/Logo.jpeg`}
            alt="Logo"
            sx={{ width: 40, height: 40, mr: 1 }}
          />
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            CharityConnect
          </Typography>
        </Box>

         {/* Navigation Links */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Button color="inherit" sx={{ mx: 1 }} onClick={() => navigate("/")}>Home</Button>
          <Button color="inherit" sx={{ mx: 1 }} onClick={() => navigate("/AboutUs")}>About us</Button>
          <Button color="inherit" sx={{ mx: 1 }} onClick={() => navigate("/NewsStories")}>News & Stories</Button>
          <Button color="inherit" sx={{ mx: 1 }} onClick={() => navigate("/ContactUs")}>Contact US</Button>
        </Box>

        {/* Donate Button */}
        <Button
          variant="contained"
          onClick={() => navigate("/login/donor")}
          sx={{
            backgroundColor: "#288f22",
            ml: 2,
            '&:hover': {
              backgroundColor: "darkgreen",
            }
          }}
        >
          Donate Now ❤︎
        </Button>

        {/* Login Icon */}
        <IconButton
          color="inherit"
          sx={{ ml: 2 }}
          aria-label="login"
          onClick={() => navigate("/select-role")}
        >
          <AccountCircleIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
