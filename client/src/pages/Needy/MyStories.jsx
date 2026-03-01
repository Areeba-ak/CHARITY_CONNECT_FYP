import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { getMyStories } from "../../services/story";

const MyStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await getMyStories();
        setStories(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to fetch stories:", err);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" mb={3} fontWeight={700}>
        My Stories
      </Typography>

      {stories.length === 0 ? (
        <Typography color="gray">No stories found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {stories.map((story) => (
            <Grid item xs={12} md={6} key={story._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{story.title}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography>{story.summary}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Status: {story.status}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyStories;
