import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  Avatar,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import { getAdminStats, getFeedbacks } from "../../services/admin";

export default function ReportsFeedbacks() {
  const [kpis, setKpis] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getAdminStats(), getFeedbacks()])
      .then(([statsRes, fbRes]) => {
        if (!mounted) return;
        const data = statsRes.data || {};
        setKpis([
          { title: 'Total Reports', value: data.totalReports ?? 0 },
          { title: 'Positive Feedback', value: `${data.positiveFeedbackPercentage ?? 0}%` },
          { title: 'Negative Feedback', value: `${data.negativeFeedbackPercentage ?? 0}%` },
        ]);

        setChartData(Array.isArray(data.monthlyDonations) ? data.monthlyDonations : []);
        setFeedbacks(fbRes.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Reports & Feedbacks
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3, alignItems: "stretch" }}>
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={4} key={index} sx={{ display: "flex" }}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 2,
                textAlign: "center",
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <CardContent>
                <Typography variant="h6">{kpi.title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                  {kpi.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Reports Chart */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Monthly Donations Overview
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#1976d2" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Feedback Table */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: "#1a7e16",
          }}
        >
          Recent Feedbacks
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Feedback</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} align="center">Loading...</TableCell></TableRow>
              ) : feedbacks.length === 0 ? (
                <TableRow><TableCell colSpan={3} align="center">No feedbacks</TableCell></TableRow>
              ) : (
                feedbacks.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#fafafa" : "white",
                      "&:hover": { backgroundColor: "#e3f2fd", cursor: "pointer" },
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ bgcolor: "#1976d2", width: 32, height: 32 }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        {row.user}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Paper
                        sx={{
                          p: 1,
                          backgroundColor: "#f9f9f9",
                          borderRadius: 2,
                          fontSize: "0.9rem",
                        }}
                      >
                        {row.feedback}
                      </Paper>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1} color="gray">
                        <EventIcon fontSize="small" /> {row.date}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
