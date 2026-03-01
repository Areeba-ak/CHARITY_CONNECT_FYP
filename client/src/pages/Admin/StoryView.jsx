import React, { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import OriginalStory from "./OriginalStory";
import AISummary from "./AISummary";
import { useParams } from "react-router-dom";
import { getStoryById } from "../../services/story";

export default function StoryView() {
  const [tab, setTab] = useState(0);
  const [story, setStory] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    getStoryById(id)
      .then((res) => mounted && setStory(res))
      .catch(() => mounted && setStory(null));
    return () => (mounted = false);
  }, [id]);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        View Story
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Original Story" />
          <Tab label="AI Summary" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tab === 0 && <OriginalStory story={story} />}
          {tab === 1 && <AISummary story={story} />}
        </Box>
      </Paper>
    </Box>
  );
}
