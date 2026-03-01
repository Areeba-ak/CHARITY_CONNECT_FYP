import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper, Stack } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import { makeDonation } from '../../services/donation';

const CreditPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Remove error as user types
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handlePay = () => {
    const newErrors = {};

    // Name validation
    if (!form.name || !/^[A-Za-z ]{2,}$/.test(form.name.trim())) {
      newErrors.name = "Enter the card holder's full name (letters and spaces only)";
    }

    // Card number validation (digits only already enforced on input)
    const num = (form.number || "").trim();
    if (!num) newErrors.number = "Card number is required";
    else if (num.length < 15 || num.length > 16) newErrors.number = "Enter a valid card number";
    else {
      // Luhn check
      const luhn = (n) => {
        let sum = 0;
        let shouldDouble = false;
        for (let i = n.length - 1; i >= 0; i--) {
          let digit = parseInt(n.charAt(i), 10);
          if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
          }
          sum += digit;
          shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
      };
      if (!luhn(num)) newErrors.number = "Enter a valid card number";
    }

    // Expiry validation MM/YY and not in past
    if (!form.expiry) newErrors.expiry = "Expiry date is required";
    else {
      const m = form.expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
      if (!m) newErrors.expiry = "Expiry must be in MM/YY format";
      else {
        const month = parseInt(m[1], 10);
        const year = parseInt(m[2], 10) + 2000;
        const exp = new Date(year, month, 1);
        const now = new Date();
        // set to first day of next month and compare
        const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        if (exp < firstOfNextMonth) newErrors.expiry = "Card has expired";
      }
    }

    // CVV validation
    if (!form.cvv) newErrors.cvv = "CVV is required";
    else if (!/^[0-9]{3,4}$/.test(form.cvv)) newErrors.cvv = "Enter a valid 3 or 4 digit CVV";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Build donation payload from session/location state
    const donationState = location.state || (() => {
      try { return JSON.parse(sessionStorage.getItem('donationState')); } catch (e) { return null; }
    })();

    const amount = donationState?.formValues?.amount || donationState?.amount;
    const storyId = donationState?.storyId || donationState?.storyId;

    if (!amount) {
      alert('Donation amount not found. Please start donation flow again.');
      return;
    }

    const payload = {
      story: storyId || null,
      amount: Number(amount),
      paymentMethod: 'creditcard',
      paymentRef: `card_${(form.number || '').slice(-4)}`,
      currency: 'PKR',
    };

    makeDonation(payload)
      .then(() => {
        alert('Payment processed and donation recorded. Thank you!');
        // Clear session state
        try { sessionStorage.removeItem('donationState'); } catch (e) {}
        navigate('/Donor/history');
      })
      .catch((err) => {
        const serverMessage = err?.response?.data?.message || err?.response?.data?.error || null;
        const msg = serverMessage || err?.message || 'Failed to process donation';
        console.error('Donation error:', err);
        alert(`Donation failed: ${msg}`);
      });
  };


  return (
    <Box
      sx={{
        bgcolor: "#f1f5f9",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 450,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, textAlign: "center", color:"#0a5666" }}>
          Credit / Debit Card Payment
        </Typography>

        <Stack spacing={2}>
          {/* Name */}
          <TextField
            label="Card Holder Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />

          {/* Card Number */}
          <TextField
            label="Card Number"
            name="number"
            value={form.number}
            onChange={(e) => {
                const val = e.target.value;

                // Allow only digits
                if (/^[0-9]*$/.test(val)) {
                setForm({ ...form, number: val });
                setErrors({ ...errors, number: "" });
                }
            }}
            inputProps={{
                maxLength: 16, // prevent longer numbers
            }}
            fullWidth
            error={!!errors.number}
            helperText={errors.number}
            />

          {/* Expiry */}
          <TextField
            label="Expiry Date (MM/YY)"
            name="expiry"
            value={form.expiry}
            onChange={handleChange}
            fullWidth
            error={!!errors.expiry}
            helperText={errors.expiry}
          />

          {/* CVV */}
          <TextField
            label="CVV"
            name="cvv"
            value={form.cvv}
            onChange={handleChange}
            fullWidth
            error={!!errors.cvv}
            helperText={errors.cvv}
          />

          <Button
            variant="contained"
            sx={{
            mt: 3,
            width: 450,
            backgroundColor: "#2e7d32",
            color: "#fff",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#1b5e20" },
          }}
          onClick={handlePay}
          >
            Pay Now 
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CreditPayment;
