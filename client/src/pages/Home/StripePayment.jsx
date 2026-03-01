import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";

const StripePayment = () => {
  const handleStripeRedirect = () => {
    // Direct redirect to Stripe login page (FYP demo)
    window.location.href = "https://dashboard.stripe.com/login";
  };

  return (
    <Box
      sx={{
        bgcolor: "#f1f5f9",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 3, textAlign: "center", letterSpacing: 1, color: "#0a5666" }}
      >
        STRIPE PAYMENT
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 500,
          borderRadius: 3,
          textAlign: "left",
          bgcolor: "#fff",
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          You will be redirected to Stripe’s secure login page.
        </Typography>

        <Button
          fullWidth
          variant="contained"
          onClick={handleStripeRedirect}
          sx={{
            bgcolor: "#635bff", // Stripe color
            py: 1.3,
            textTransform: "none",
            borderRadius: 2,
            "&:hover": { bgcolor: "#5148d8" },
          }}
        >
          Continue to Stripe
        </Button>

        <Typography
          variant="caption"
          sx={{ mt: 3, display: "block", textAlign: "center" }}
        >
          Your payment is secure & encrypted.
        </Typography>
      </Paper>
    </Box>
  );
};

export default StripePayment;
