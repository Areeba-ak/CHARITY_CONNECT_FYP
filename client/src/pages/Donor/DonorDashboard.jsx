import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
} from "@mui/material";

import { getMe } from "../../services/auth";
import { getMyDonations } from "../../services/donation";

const DonorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, donationsRes] = await Promise.all([
          getMe(),
          getMyDonations(),
        ]);

        setProfile(userRes);
        setDonations(donationsRes.data || donationsRes || []);
      } catch (err) {
        console.error("Failed to load donor data:", err.message || err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // If navigated here from a story donate click, forward to Donate page with story data
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location?.state?.redirectToDonate && location?.state?.storyData) {
      const { storyData } = location.state;
      navigate("/Donate", { state: storyData });
    }
  }, [location, navigate]);

  const isCompleted = (d) => {
    const s = (d.status || d.paymentStatus || "").toString().toLowerCase();
    return ["completed", "success", "paid"].includes(s);
  };

  const successfulDonations = donations.filter(isCompleted);
  const totalDonations = successfulDonations.length;
  const totalAmount = successfulDonations.reduce((sum, d) => {
    const amt = d?.amount || d?.total || 0;
    const n = typeof amt === "string" ? parseFloat(amt) || 0 : amt;
    return sum + n;
  }, 0);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toISOString().split("T")[0];
    } catch {
      return iso || "-";
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "50vh",
        padding: { xs: 2, md: 0 },
      }}
    >
      {/* Page Title */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Dashboard
      </Typography>

      {/* MAIN GRID */}
      <Grid container spacing={3} sx={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* PROFILE CARD */}
        <Grid item xs={12} md={4.5}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Your Profile
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                <Avatar
                  src={profile?.avatar || "/assets/user.png"}
                  alt={`${profile?.firstName || ""} ${profile?.lastName || ""}`}
                  sx={{ width: 90, height: 90, mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  (DONOR)
                </Typography>
              </Box>

              <Box sx={{ lineHeight: 1.9 }}>
                <Typography>
                  <strong>First Name:</strong> {profile?.firstName || profile?.name || "-"}
                </Typography>
                <Typography>
                  <strong>Last Name:</strong> {profile?.lastName || "-"}
                </Typography>
                <Typography>
                  <strong>Gender:</strong> {profile?.gender || "-"}
                </Typography>
                <Typography>
                  <strong>DOB:</strong> {profile?.dob || profile?.dateOfBirth || "-"}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {profile?.email || "-"}
                </Typography>
                <Typography>
                  <strong>Contact No:</strong> {profile?.phone || profile?.contact || "-"}
                </Typography>
                <Typography>
                  <strong>Address:</strong> {profile?.address || "-"}
                </Typography>
                <Typography>
                  <strong>City:</strong> {profile?.city || "-"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* DONATION SUMMARY */}
        <Grid item xs={12} md={7.5}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Donation Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* STAT CARDS */}
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 2,
                      background: "#f0f4ff",
                    }}
                  >
                    <Typography fontWeight="bold">Total Donations</Typography>
                    <Typography variant="h6" mt={1}>
                      {loading ? "..." : totalDonations}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 2,
                      background: "#fff8e1",
                    }}
                  >
                    <Typography fontWeight="bold">Total Amount Donated</Typography>
                    <Typography variant="h6" mt={1}>
                      {loading ? "..." : `PKR ${totalAmount.toLocaleString()}`}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              {/* RECENT DONATIONS */}
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Recent Donations
              </Typography>

              <Grid container spacing={3} mb={3}>
                {loading && (
                  <Grid item xs={12}>
                    <Typography>Loading donations...</Typography>
                  </Grid>
                )}

                {!loading && donations.length === 0 && (
                  <Grid item xs={12}>
                    <Typography>No donations yet.</Typography>
                  </Grid>
                )}

                {!loading &&
                  donations.slice(0, 2).map((d, idx) => (
                    <Grid item xs={12} sm={6} key={d._id || idx}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: "#fafafa",
                          borderRadius: 2,
                          border: "1px solid #eee",
                        }}
                      >
                        <Typography>
                          <strong>Date:</strong> {formatDate(d.createdAt || d.date || d.dateAdded)}
                        </Typography>
                        <Typography>
                          <strong>Amount:</strong> PKR {Number(d.amount || d.total || 0).toLocaleString()}
                        </Typography>
                        <Typography>
                          <strong>Campaign:</strong> {d.campaign || d.storyTitle || d.campaignName || "-"}
                        </Typography>
                        <Typography>
                          <strong>Status:</strong> {d.status || d.paymentStatus || "-"}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DonorDashboard;
