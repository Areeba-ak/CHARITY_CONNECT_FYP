import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  MenuItem,
  FormControl,
  Select,
  Paper,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const NewsStories = () => {
  const [inprogress, setInprogress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    import("../../services/story").then(({ getInProgressStories, getCompletedStories }) => {
      Promise.all([getInProgressStories(category), getCompletedStories(category)])
        .then(([inprog, comp]) => {
          if (!mounted) return;
          setInprogress(inprog || []);
          setCompleted(comp || []);
        })
        .catch(() => {
          if (!mounted) return;
          setInprogress([]);
          setCompleted([]);
        })
        .finally(() => mounted && setLoading(false));
    });

    return () => (mounted = false);
  }, [category]);

  const filteredInprogress = (category === "" ? inprogress : inprogress.filter((s) => (s.category || "").toLowerCase().includes(category.toLowerCase())));
  const filteredCompleted = (category === "" ? completed : completed.filter((s) => (s.category || "").toLowerCase().includes(category.toLowerCase())));

  return (
    <>
      {/* Top Header */}
      <Box
        sx={{
          pt: 13,
          pb: 2,
          backgroundColor: "#f0f4f8",
          width: "calc(95% + 80px)",
          margin: "0 auto",
        }}
      >
        <Paper
          elevation={2}
          sx={{
            textAlign: "center",
            py: 4,
            px: 2,
            width: "100%",
            borderRadius: 0,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="#0a5666"
          >
            NEWS AND STORIES
          </Typography>
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
            Inspiring Journeys ( Stories That Touch the Heart )
          </Typography>
        </Paper>
      </Box>

      {/* Main Content Section */}
      <Box
        sx={{
          py: 5,
          backgroundColor: "#f0f4f8",
          width: "calc(95% + 80px)",
          margin: "0 auto",
        }}
      >
        <Container maxWidth="lg">
          {/* Subheading + Dropdown */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              mb: 5,
              px: { xs: 2, md: 0 },
            }}
          >
            <Typography
              sx={{
                color: "green",
                fontWeight: "600",
                fontSize: { xs: "18px", md: "22px" },
                mb: { xs: 2, md: 0 },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Real Stories, Real Impact: See the Change
            </Typography>

            <FormControl size="small" sx={{ minWidth: 280 }}>
              <Select
                displayEmpty
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                renderValue={(selected) => (selected ? selected : "Select Category")}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="education">Education</MenuItem>
                <MenuItem value="health">Health</MenuItem>
                <MenuItem value="women empowerment">Women Empowerment</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* In-Progress (approved) Stories Heading */}
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h5" color="#0a5666" fontWeight="bold">
              INPROGRESS STORIES
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                px: 4,
                flexWrap: "wrap",
                mt: 4,
              }}
            >
              {loading ? (
                <Typography>Loading...</Typography>
              ) : (
                filteredInprogress.map((story, idx) => (
              <Paper
                key={story._id || idx}
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
                  position: "relative",
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
                      <Button
                      component={Link}
                      to={`/story/inprogress/${story._id}`}
                      size="small"
                      variant="text"
                      sx={{
                        mt: 1,
                        fontWeight: "bold",
                        p: 0,
                        color: "#1a7e16", 
                        "&:hover": {
                          backgroundColor: "transparent", 
                          color: "#0f490d", 
                        },
                      }}
                    >
                      Read More
                    </Button>
                </Box>
              </Paper>
            )))}

            </Box>
          </Box>

          {/* Completed Stories */}
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h5" color="#0a5666" fontWeight="bold">
              COMPLETED STORIES
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                px: 4,
                flexWrap: "wrap",
                mt: 4,
              }}
            >
              {loading ? (
                <Typography>Loading...</Typography>
              ) : (
                filteredCompleted.map((story, idx) => (
              <Paper
                key={story._id || idx}
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
                  position: "relative",
                }}
              >
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
                    <Button
                      component={Link}
                      to={`/story/${story._id}`}
                      size="small"
                      variant="text"
                      sx={{
                        mt: 1,
                        fontWeight: "bold",
                        p: 0,
                        color: "#1a7e16", 
                        "&:hover": {
                          backgroundColor: "transparent", 
                          color: "#0f490d", 
                        },
                      }}
                    >
                      Read More
                    </Button>
                </Box>
              </Paper>
                ))
              )}

            </Box>
          </Box>
            
          {/* In-Progress stories are not shown publicly unless approved by admin.
              Only admin-approved stories are returned by getApprovedStories and
              are displayed above in COMPLETED STORIES. We intentionally hide
              the pending/in-progress section to avoid showing unapproved items. */}
          
        </Container>
      </Box>
    </>
  );
};

export default NewsStories;
