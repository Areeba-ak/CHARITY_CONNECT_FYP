import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Box,
  Divider,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getAdminStats } from "../../services/admin";
import { approveStory, deleteStory } from "../../services/story";
import { useNavigate } from "react-router-dom";

const pieColors = ["#1976d2", "#ff9800"];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState(null);

  const navigate = useNavigate();
  // extract fetchStats so it can be reused after actions
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getAdminStats();
      const data = res.data;

      setStats({
        totalUsers: data.totalUsers ?? 0,
        totalApprovedStories: data.totalApprovedStories ?? 0,
        totalDonatedAmount: data.totalDonatedAmount ?? 0,
        monthlyDonations: Array.isArray(data.monthlyDonations) ? data.monthlyDonations : [],
        userDistribution: Array.isArray(data.userDistribution) ? data.userDistribution : [],
        verificationQueue: Array.isArray(data.verificationQueue) ? data.verificationQueue : [],
        recentActivities: Array.isArray(data.recentActivities) ? data.recentActivities : [],
      });
    } catch (error) {
      console.error("Failed to load admin stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return <Typography color="error">Failed to load dashboard</Typography>;
  }

  const kpis = [
    { label: "Total Donations", value: `PKR ${stats.totalDonatedAmount}`, color: "#1976d2" },
    { label: "Active Stories", value: stats.totalApprovedStories, color: "#388e3c" },
    { label: "Total Users", value: stats.totalUsers, color: "#f57c00" },
  ];

  const handleDeleteConfirm = async () => {
    try {
      await deleteStory(selectedStoryId);
      alert("Story deleted successfully");
      await fetchStats();
    } catch (err) {
      alert(err.message || "Delete failed");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedStoryId(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Dashboard
      </Typography>

      {/* KPI */}
      <Grid container spacing={4} sx={{ mb: 2 }}>
        {kpis.map((kpi, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: kpi.color, color: "#fff" }}>
              <CardContent>
                <Typography variant="subtitle2">{kpi.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {kpi.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Recent Activities
            </Typography>
            <Divider sx={{ my: 1 }} />
            {stats.recentActivities.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No recent activity
              </Typography>
            ) : (
              stats.recentActivities.map((activity, idx) => (
                <Typography key={idx} variant="body2">
                  • {activity}
                </Typography>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Monthly Donations (PKR)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyDonations}>
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="amount" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              User Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stats.userDistribution} dataKey="value" nameKey="name" outerRadius={80} label>
                  {stats.userDistribution.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Verification Queue */}
        <Grid item xs={12} md={8} sx={{ mt: 2 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Story Verification Queue
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Story</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {stats.verificationQueue.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No pending stories
                      </TableCell>
                    </TableRow>
                  ) : (
                    stats.verificationQueue.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.story}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>
                          <Button size="small" variant="contained" sx={{ mr: 1 }} onClick={() => navigate(`/Admin/story/view/${row.storyId}`)}>
                            View
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1 }}
                            onClick={async () => {
                              // optimistic UI: remove from queue immediately
                              setStats((prev) => ({
                                ...prev,
                                verificationQueue: prev.verificationQueue.filter((q) => q !== undefined && q.storyId !== row.storyId && q.storyId !== String(row.storyId)),
                              }));

                              try {
                                await approveStory(row.storyId);
                                alert("Story approved");
                                await fetchStats();
                              } catch (err) {
                                console.error(err);
                                alert(err.response?.data?.message || err.message || "Approval failed");
                                // rollback: refresh stats to restore queue
                                await fetchStats();
                              }
                            }}
                          >
                            Verify
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => {
                              setSelectedStoryId(row.storyId);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* ✅ DELETE CONFIRM DIALOG */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Story</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this story?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
