import React from "react";
import { Box, Container, Grid, Typography, Link, Divider } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#37474f",
        color: "white",
        mt: 8,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Logo & About */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Charity Connect
            </Typography>
            <Typography variant="body2" paragraph>
              Connecting donors with those in need through trust, transparency, and technology.
            </Typography>

            {/* Social Icons */}
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <img src="/assets/facebook.png" alt="Facebook" width={24} height={24} />
              <img src="/assets/linkedin.png" alt="LinkedIn" width={24} height={24} />
              <img src="/assets/instagram.png" alt="Instagram" width={24} height={24} />
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ lineHeight: 2 }}>
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                underline="hover"
                display="block"
              >
                Home
              </Link>
              <Link
                component={RouterLink}
                to="/AboutUs"
                color="inherit"
                underline="hover"
                display="block"
              >
                About Us
              </Link>
              <Link
                component={RouterLink}
                to="/NewsStories"
                color="inherit"
                underline="hover"
                display="block"
              >
                News & Stories
              </Link>
              <Link
                component={RouterLink}
                to="/ContactUs"
                color="inherit"
                underline="hover"
                display="block"
              >
                Contact Us
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" mb={1}>
              Email: support@charityconnect.org
            </Typography>
            <Typography variant="body2" mb={1}>
              Phone: +92 300 1234567
            </Typography>
            <Typography variant="body2">
              Address: Karachi, Pakistan
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.2)" }} />

        <Typography variant="body2" align="center">
          &copy; {new Date().getFullYear()} Charity Connect. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
