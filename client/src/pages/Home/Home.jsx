import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Paper,
  Container,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const Home = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stories dynamically
  useEffect(() => {
    let mounted = true;
    import("../../services/story").then(({ getApprovedStories }) => {
      getApprovedStories()
        .then((data) => {
          if (mounted) setStories(data || []);
        })
        .catch(() => {
          if (mounted) setStories([]);
        })
        .finally(() => mounted && setLoading(false));
    });
    return () => (mounted = false);
  }, []);

  const handleChatClick = () => {
    navigate("/chatbot");
  };

  // Carousel controls
  const handleNext = () => {
    if (!stories.length) return;
    setIndex((prev) => (prev + 2) % stories.length);
  };

  const handlePrev = () => {
    if (!stories.length) return;
    setIndex((prev) => (prev - 2 + stories.length) % stories.length);
  };

  const visibleStories = stories.length
    ? [stories[index % stories.length], stories[(index + 1) % stories.length]]
    : [];

  return (
    <Box sx={{ backgroundColor: "#fff", fontFamily: "Segoe UI, sans-serif" }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 3, md: 8 },
          mt: 5,
        }}
      >
        <Grid
          container
          spacing={6}
          alignItems="center"
          justifyContent="center"
          sx={{ maxWidth: 1200, margin: "auto" }}
        >
          {/* Text */}
          <Grid item xs={12} md={6}>
            <Box maxWidth={580} margin="auto">
              <Typography variant="h5" color="#1a7e16" gutterBottom>
                GIVE HOPE. CHANGE LIVES.
              </Typography>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Help us build a world,
                <br />
                Where no one is left behind.
              </Typography>
              <Typography variant="body1" color="#433b32" gutterBottom>
                Every donation brings warmth, shelter, and dignity to those who
                need it most.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/login/donor")}
                  sx={{
                    width: 160,
                    py: 1.5,
                    fontWeight: "bold",
                    backgroundColor: "#2f95ae",
                    "&:hover": { backgroundColor: "#125ca1" },
                  }}
                >
                  Donate Now
                </Button>

                <Button
                  variant="contained"
                  onClick={() => navigate("/login/needy")}
                  sx={{
                    width: 160,
                    py: 1.5,
                    fontWeight: "bold",
                    backgroundColor: "#388e3c",
                    "&:hover": { backgroundColor: "#2e7d32" },
                  }}
                >
                  Get Help
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={`${process.env.PUBLIC_URL}/assets/background.png`}
              alt="Hero"
              sx={{
                width: "100%",
                maxHeight: 500,
                objectFit: "cover",
                borderRadius: 3,
                margin: "auto",
                display: "block",
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* What We Offer Section */}
      <Box sx={{ backgroundColor: "#F0F4F8", py: 6 }}>
        <Typography
          variant="h4"
          align="center"
          mb={5}
          fontWeight="bold"
          color="#0a5666"
        >
          WHAT WE OFFER
        </Typography>

        <Box
          sx={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}
        >
          {[
            {
              count: "Secure Donations",
              text: "Ensuring every contribution reaches its intended recipient.",
              logo: "secure.png",
            },
            {
              count: "Story Verification",
              text: "Authenticating every story for transparency.",
              logo: "verification.png",
            },
            {
              count: "AI Chatbot Assistant",
              text: "24/7 support to guide you through the platform.",
              logo: "assist.png",
            },
            {
              count: "User Profiles",
              text: "Personal dashboards for donors and beneficiaries.",
              logo: "user.png",
            },
          ].map((item, idx) => (
            <Paper
              key={idx}
              elevation={4}
              sx={{
                width: 200,
                height: 260,
                borderRadius: 4,
                p: 3,
                textAlign: "center",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 20,
                },
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                color="#287621"
                gutterBottom
              >
                {item.count}
              </Typography>
              <Box
                component="img"
                src={`${process.env.PUBLIC_URL}/assets/${item.logo}`}
                alt={item.count}
                sx={{ width: 50, height: 50, my: 3 }}
              />
              <Typography variant="body2" fontWeight="bold">
                {item.text}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Impactful Journeys Section */}
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="h4" color="#0a5666" fontWeight="bold">
          IMPACTFUL JOURNEYS
        </Typography>
        <Typography variant="h6" mt={2} mb={4}>
          Discover real stories of lives transformed through CharityConnect.
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            px: 4,
          }}
        >
          <IconButton onClick={handlePrev}>
            <ArrowBackIos />
          </IconButton>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : visibleStories.length ? (
            visibleStories.map((story, idx) => (
              <Paper
                key={idx}
                elevation={3}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: 360,
                  height: 180,
                  p: 2,
                  textAlign: "left",
                  overflow: "hidden",
                  boxSizing: "border-box",
                }}
              >
                <Box
                  component="img"
                  src={`/assets/${story.img}`}
                  alt={story.title}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 1,
                    mr: 2,
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ overflow: "hidden", flex: 1 }}>
                  <Typography
                    fontWeight="bold"
                    variant="subtitle1"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {story.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    mt={1}
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {story.text}
                  </Typography>
                  {/* Updated Read More Button */}
                  <Button
                    component={Link}
                    to={`/story/${story._id}`}
                    size="small"
                    variant="text"
                    sx={{
                      mt: 1,
                      fontWeight: "bold",
                      p: 0,
                      color: "green",
                      "&:hover": { backgroundColor: "transparent", color: "#0f490d" },
                    }}
                  >
                    Read More
                  </Button>
                </Box>
              </Paper>
            ))
          ) : (
            <Typography>No stories available</Typography>
          )}

          <IconButton onClick={handleNext}>
            <ArrowForwardIos />
          </IconButton>
        </Box>
      </Box>

      {/* Help Section */}
      <Box sx={{ backgroundColor: "#F3F6F9", py: 8 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 5,
            }}
          >
            <Box
              component="img"
              src="/assets/help.png"
              alt="help-icon"
              sx={{ height: 50, width: 50 }}
            />
            <Typography variant="h5" fontWeight="bold" sx={{ color: "green" }}>
              WE ARE HERE TO HELP
            </Typography>
          </Box>

          <Grid container spacing={13} justifyContent="center" alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, mb: 3, fontSize: 19 }}
              >
                Have questions, feedback, or need assistance? Our team is ready
                to support you. <br />
                Reach out to us anytime, and we’ll respond promptly.
              </Typography>

              <Button
                variant="contained"
                onClick={() => navigate("/ContactUs")}
                sx={{
                  backgroundColor: "#2e7d32",
                  textTransform: "none",
                  px: 6,
                  py: 1.2,
                  mt: 2,
                  "&:hover": { backgroundColor: "#46691a" },
                }}
              >
                Contact Us
              </Button>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  backgroundColor: "#fff",
                  p: 4,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Connect with Us on
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
                  <IconButton>
                    <img
                      src="/assets/instagram.png"
                      alt="Instagram"
                      style={{ width: 35, height: 35 }}
                    />
                  </IconButton>
                  <IconButton>
                    <img
                      src="/assets/gmail.png"
                      alt="Gmail"
                      style={{ width: 35, height: 35 }}
                    />
                  </IconButton>
                  <IconButton>
                    <img
                      src="/assets/linkedin.png"
                      alt="LinkedIn"
                      style={{ width: 35, height: 35 }}
                    />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Final Donate Now Banner */}
      <Box
        sx={{
          py: 4,
          backgroundColor: "#fff",
          px: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            textAlign: { xs: "center", md: "left" },
            gap: 4,
          }}
        >
          <Typography fontWeight="bold" fontSize={{ xs: "20px", md: "28px" }}>
            Your generosity can light up someone's world.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/login/donor")}
            size="medium"
            sx={{ backgroundColor: "#2e7d32", px: 4, textTransform: "none" }}
          >
            DONATE NOW ♥
          </Button>
        </Box>
      </Box>

      {/* Fixed AI Chatbot Icon */}
      <Tooltip title="Need help? Ask AI">
        <IconButton
          onClick={handleChatClick}
          sx={{
            position: "fixed",
            bottom: 60,
            right: 70,
            backgroundColor: "#2f95ae",
            zIndex: 9999,
            "&:hover": { backgroundColor: "#1d7b92" },
            width: 60,
            height: 60,
            boxShadow: 4,
            padding: 0,
          }}
        >
          <Box
            component="img"
            src={`${process.env.PUBLIC_URL}/assets/chatbot.png`}
            alt="AI"
            sx={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }}
          />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Home;
