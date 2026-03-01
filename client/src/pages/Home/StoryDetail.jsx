import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Chip, LinearProgress } from "@mui/material";

const StoryDetail = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    import("../../services/story").then(({ getStoryById }) => {
      getStoryById(id)
        .then((data) => {
          if (!mounted) return;
          setStory(data);
        })
        .catch(() => setStory(null))
        .finally(() => mounted && setLoading(false));
    });
    return () => (mounted = false);
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!story) return <Typography>Story not found</Typography>;

  const status = story.status || "pending";
  const isApproved = status === "approved";

  return (
    <Box sx={{ px: 4, pb: 4, mt: 12 }}>

      <Box sx={{ mb: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
            mt: 16,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Story Status
          </Typography>

          <Chip
            label={isApproved ? "Approved" : status.charAt(0).toUpperCase() + status.slice(1)}
            color={isApproved ? "success" : status === "rejected" ? "error" : "warning"}
            sx={{ fontWeight: "bold" }}
          />
        </Box>

        <LinearProgress
          variant="determinate"
          value={isApproved ? 100 : 45}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      <Typography variant="h3" fontWeight="bold" mb={4}>
        {story.title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 5,
        }}
      >
        <Box sx={{ flex: 1 }}>
          {(() => {
            const textArray = Array.isArray(story.text)
              ? story.text
              : story.description
              ? [story.description]
              : story.summary
              ? [story.summary]
              : [];

            return textArray.map((para, index) => (
              <Typography
                key={index}
                paragraph
                sx={{ fontSize: "1.05rem", lineHeight: 1.9 }}
              >
                {para}
              </Typography>
            ));
          })()}
        </Box>     
      </Box>
    </Box>
  );
};

export default StoryDetail;
