import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  LinearProgress,
  Button,
} from "@mui/material";

const InProgressStoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    import("../../services/story").then(({ getStoryById }) => {
      getStoryById(id)
        .then((data) => {
          if (mounted) setStory(data);
        })
        .catch(() => {
          if (mounted) setStory(null);
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <Typography sx={{ mt: 15 }}>Loading...</Typography>;
  if (!story) return <Typography sx={{ mt: 15 }}>Story not found</Typography>;

  const status = story.status || "pending";
  const isCompleted = status === "completed";

  const handleDonateClick = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === "donor") {
      // User is logged in as a donor, navigate to dashboard and pass story data
      navigate("/DonorDashboard", {
        state: {
          redirectToDonate: true,
          storyData: { storyId: id, title: story.title, category: story.category },
        },
      });
    } else {
      // User is not logged in or is not a donor, navigate to donor login
      navigate("/login/donor");
    }
  };

  return (
    <Box sx={{ px: 4, pb: 4, mt: 12 }}>
      {/* Status */}
      <Box sx={{ mb: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
            mt: 6,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Story Status
          </Typography>
          <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            color={status === "completed" ? "success" : status === "rejected" ? "error" : "warning"}
            sx={{ fontWeight: "bold" }}
          />
        </Box>

        <LinearProgress
          variant="determinate"
          value={isCompleted ? 100 : 60}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      {/* Title */}
      <Typography variant="h3" fontWeight="bold" mb={4}>
        {story.title}
      </Typography>

      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 5,
        }}
      >
        {/* Text */}
        <Box sx={{ flex: 1 }}>
          {Array.isArray(story?.text) ? (
            story.text.map((para, index) => (
              <Typography
                key={index}
                paragraph
                sx={{ fontSize: "1.05rem", lineHeight: 1.9 }}
              >
                {para}
              </Typography>
            ))
          ) : (
            <Typography
              paragraph
              sx={{ fontSize: "1.05rem", lineHeight: 1.9 }}
            >
              {story?.text}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Donate Button */}
      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleDonateClick}
          disabled={isCompleted}
        >
          Donate Now
        </Button>
        {isCompleted && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This story is already completed and no longer accepts donations.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default InProgressStoryDetails;
