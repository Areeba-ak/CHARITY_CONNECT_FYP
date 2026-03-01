import React, { useEffect, useState } from "react";
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { getAllUsers, deleteUser, getUserById } from "../../services/admin";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    getAllUsers()
      .then((res) => mounted && setUsers(res.data || []))
      .catch(() => mounted && setUsers([]))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>User Management <Box component="span" sx={{ color: "gray" }}></Box></Typography>

      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Loading...</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No users found</TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>{u._id}</TableCell>
                    <TableCell>{`${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>{u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '-'}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={async () => {
                        try {
                          const res = await getUserById(u._id);
                          setViewUser(res.data);
                          setViewOpen(true);
                        } catch (err) {
                          console.error(err);
                          alert(err.response?.data?.message || err.message || 'Failed to load user');
                        }
                      }}>View</Button>
                      <Button size="small" variant="contained" color="error" onClick={async () => {
                        if (!window.confirm('Delete this user?')) return;
                        try {
                          await deleteUser(u._id);
                          setUsers((prev) => prev.filter((it) => it._id !== u._id));
                        } catch (err) {
                          console.error(err);
                          alert(err.response?.data?.message || err.message || 'Delete failed');
                        }
                      }}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)}>
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          {viewUser ? (
            <Box>
              <Typography><strong>Name:</strong> {viewUser.firstName} {viewUser.lastName}</Typography>
              <Typography><strong>Email:</strong> {viewUser.email}</Typography>
              <Typography><strong>Role:</strong> {viewUser.role}</Typography>
              <Typography><strong>City:</strong> {viewUser.city}</Typography>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
