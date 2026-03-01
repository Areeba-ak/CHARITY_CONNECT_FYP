import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { changePassword, deleteMyAccount } from "../../services/auth";

const DonorSettings = () => {
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // ---------- HANDLERS ----------
  const handlePasswordSubmit = async () => {
    if (password.newPassword !== password.confirmPassword) {
      return alert("Passwords mismatch");
    }

    try {
      await changePassword({
        currentPassword: password.oldPassword,
        newPassword: password.newPassword,
        confirmPassword: password.confirmPassword,
      });
      alert("Password updated!");
      setPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      alert(error.message || "Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteMyAccount();
      alert("Account deleted successfully!");
      // Optionally redirect to login or home page here
    } catch (error) {
      alert(error.message || "Failed to delete account");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: 0 }}> {/* Left aligned */}
      <Typography variant="h4" sx={{ mb: 3 }}>
        Settings
      </Typography>

      {/* Change Password Section */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Change Password
      </Typography>

      <TextField
        fullWidth
        type="password"
        label="Current Password"
        sx={{ mb: 2 }}
        value={password.oldPassword}
        onChange={(e) =>
          setPassword({ ...password, oldPassword: e.target.value })
        }
      />
      <TextField
        fullWidth
        type="password"
        label="New Password"
        sx={{ mb: 2 }}
        value={password.newPassword}
        onChange={(e) =>
          setPassword({ ...password, newPassword: e.target.value })
        }
      />
      <TextField
        fullWidth
        type="password"
        label="Confirm Password"
        sx={{ mb: 2 }}
        value={password.confirmPassword}
        onChange={(e) =>
          setPassword({ ...password, confirmPassword: e.target.value })
        }
      />

      <Button
        variant="contained"
        onClick={handlePasswordSubmit}
        sx={{ mb: 4 }}
      >
        Update Password
      </Button>

      {/* Account Deletion Section */}
      <Alert severity="warning" sx={{ mb: 2 }}>
        Deleting your account is permanent.
      </Alert>

      <Button
        variant="contained"
        color="error"
        onClick={() => setDeleteDialogOpen(true)}
      >
        Delete Account
      </Button>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteAccount}>
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DonorSettings;
