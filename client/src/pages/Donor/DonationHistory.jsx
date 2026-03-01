import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { getMyDonations } from "../../services/donation";

const DonationHistory = () => {
  const [donationData, setDonationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getMyDonations()
      .then((res) => {
        if (!mounted) return;
        setDonationData(res.data || []);
      })
      .catch(() => {
        if (mounted) setDonationData([]);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  const isCompleted = (d) => {
    const s = (d.status || d.paymentStatus || "").toString().toLowerCase();
    return ["completed", "success", "paid"].includes(s);
  };

  const successfulDonations = donationData.filter(isCompleted);
  const totalDonations = successfulDonations.length;
  const totalAmount = successfulDonations.reduce((sum, d) => sum + (Number(d.amount || 0) || 0), 0);

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
        Donation History
      </Typography>

      {/* SUMMARY CARDS */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, borderRadius: 2, textAlign: "center", background: "#f0f4ff" }}>
            <Typography fontWeight="bold">Total Donations</Typography>
            <Typography variant="h6" mt={1}>{totalDonations}</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, borderRadius: 2, textAlign: "center", background: "#fff8e1" }}>
            <Typography fontWeight="bold">Total Amount Donated</Typography>
            <Typography variant="h6" mt={1}>PKR {totalAmount.toLocaleString()}</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* DONATION TABLE */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Donation Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Campaign</strong></TableCell>
                  <TableCell><strong>Amount (PKR)</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Loading...</TableCell>
                  </TableRow>
                ) : donationData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No donations found</TableCell>
                  </TableRow>
                ) : (
                  donationData.map((donation) => (
                    <TableRow key={donation._id || donation.donationId}>
                      <TableCell>{new Date(donation.createdAt).toISOString().split('T')[0]}</TableCell>
                      <TableCell>{donation.story?.title || donation.campaign || '-'}</TableCell>
                      <TableCell>{(donation.amount || 0).toLocaleString()}</TableCell>
                      <TableCell>{donation.status}</TableCell>
                      <TableCell>
                        {donation.status === "pending" ? (
                          <Button size="small" variant="contained" color="primary">Cancel</Button>
                        ) : (
                          <Button size="small" variant="outlined" disabled>Completed</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DonationHistory;
