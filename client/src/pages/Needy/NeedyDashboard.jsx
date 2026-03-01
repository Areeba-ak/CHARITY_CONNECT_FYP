import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
} from "@mui/material";
import { getMyStories } from "../../services/story";
import { getMe } from "../../services/auth";

const NeedyDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileRes = await getMe();
        const storyRes = await getMyStories();
        setProfile(profileRes);
        setStories(storyRes || []);
      } catch (err) {
        console.error("Failed loading needy dashboard:", err.message || err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" mb={3} fontWeight={700}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Profile */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
                  <Avatar
                    src={profile?.avatar || "/assets/user.png"}
                    alt={`${profile?.firstName || ""} ${profile?.lastName || ""}`}
                    sx={{ width: 90, height: 90, mx: "auto" }}
                  />
              <Divider sx={{ my: 2 }} />
              <Typography><b>Name:</b> {profile?.firstName || ""} {profile?.lastName || ""}</Typography>
              <Typography><b>Email:</b> {profile?.email || ""}</Typography>
              <Typography><b>City:</b> {profile?.city || ""}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography fontWeight="bold">Story Summary</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography>Total Stories: {stories?.length || 0}</Typography>
              <Typography>Approved: {stories?.filter((s) => s.status === "approved").length || 0}</Typography>
              <Typography>Pending: {stories?.filter((s) => s.status === "pending").length || 0}</Typography>
              <Typography>Completed: {stories?.filter((s) => s.status === "completed").length || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NeedyDashboard;
