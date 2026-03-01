import React, { useEffect, useState } from "react";
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, CircularProgress } from "@mui/material";
import { getAllDonations } from "../../services/admin";

export default function PaymentDonation() {
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAllDonations()
      .then((res) => mounted && setTx(res.data || []))
      .catch(() => mounted && setTx([]))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Payment & Donation</Typography>

      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Donor</TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center"><CircularProgress size={20} /></TableCell></TableRow>
              ) : tx.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">No records found</TableCell></TableRow>
              ) : (
                tx.map((t, i) => (
                  <TableRow key={t._id || i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{t.donor?.name || '-'}</TableCell>
                    <TableCell>{t.story?.title || '-'}</TableCell>
                    <TableCell>{t.amount ? `PKR ${t.amount}` : '-'}</TableCell>
                    <TableCell>{t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : '-'}</TableCell>
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
