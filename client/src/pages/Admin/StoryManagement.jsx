import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getPendingStories, approveStory, deleteStory } from "../../services/story";

export default function StoryManagement() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getPendingStories()
      .then((res) => mounted && setStories(res || []))
      .catch(() => mounted && setStories([]))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Story Management
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
          Stories
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : stories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No stories found
                  </TableCell>
                </TableRow>
              ) : (
                stories.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell>{s._id}</TableCell>
                    <TableCell>{s.submittedBy?.name || '-'}</TableCell>
                    <TableCell>{s.title}</TableCell>
                    <TableCell>{s.status}</TableCell>
                    <TableCell>{s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : '-'}</TableCell>
                    <TableCell>
                      <Button size="small" variant="contained" sx={{ mr: 1 }} onClick={() => navigate(`/Admin/story/view/${s._id}`)}>
                        View Story
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1 }}
                        onClick={async () => {
                          try {
                            await approveStory(s._id);
                            setStories((prev) => prev.filter((it) => it._id !== s._id));
                            alert('Story verified');
                          } catch (err) {
                            console.error(err);
                            alert(err.response?.data?.message || err.message || 'Failed to verify');
                          }
                        }}
                      >
                        Verified
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={async () => {
                          if (!window.confirm('Delete this story?')) return;
                          try {
                            await deleteStory(s._id);
                            setStories((prev) => prev.filter((it) => it._id !== s._id));
                            alert('Story deleted');
                          } catch (err) {
                            console.error(err);
                            alert(err.response?.data?.message || err.message || 'Failed to delete');
                          }
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
    </Box>
  );
}
