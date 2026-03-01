import React, { useState } from "react";
import {Box,Grid,Typography,Stack,TextField,Button,Paper,Link,} from "@mui/material";
import PhoneField from "../../components/PhoneField";
import api from "../../utils/api";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (/\d/.test(formData.name)) {
      newErrors.name = "Name should not contain numbers";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.replace(/\D/g, "").length < 7) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message should be at least 10 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      (async () => {
        try {
          await api.post('/contact', {
            name: formData.name,
            email: formData.email,
            message: formData.message,
          });
          alert('Message sent successfully');
          setFormData({ name: "", phone: "", email: "", message: "" });
          setErrors({});
        } catch (err) {
          console.error(err);
          alert(err.response?.data?.message || err.message || 'Failed to send message');
        }
      })();
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f0f4f8",
        py: { xs: 6, sm: 8, md: 10 },
        px: { xs: 2, sm: 4, md: 10 },
        pt: { xs: 14, sm: 16, md: 18 },
      }}
    >
      <Grid container spacing={6} alignItems="center" justifyContent="center">


        {/* Left Section */}
        <Grid item xs={12} md={5}>
          <Box sx={{ paddingBottom: 2, textAlign: "center" }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              color="#0a5666"
            >
              CONTACT US
            </Typography>
          </Box>

          <Typography
            sx={{
              mb: 4,
              fontSize: { xs: "16px", sm: "17px", md: "18px" },
              px: { xs: 1, sm: 2 },
              textAlign: "left",
            }}
          >
            Connecting donors with those in need through trust, transparency,
            <br />
            and technology.
          </Typography>

          <Stack spacing={2} sx={{ px: { xs: 1, sm: 2 } }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box component="img" src="/assets/mail.png" alt="email" sx={{ width: 26, height: 26 }} />
              <Typography fontSize={{ xs: 14, sm: 16 }}>
                Email:{" "}
                <Link href="mailto:support@charityconnect.org" underline="hover">
                  support@charityconnect.org
                </Link>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box component="img" src="/assets/telephone.png" alt="phone" sx={{ width: 26, height: 26 }} />
              <Typography fontSize={{ xs: 14, sm: 16 }}>
                Phone: +92 300 1234567
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box component="img" src="/assets/location.png" alt="location" sx={{ width: 26, height: 26 }} />
              <Typography fontSize={{ xs: 14, sm: 16 }}>
                Address: Karachi, Pakistan
              </Typography>
            </Stack>
          </Stack>

          {/* Social Icons */}
          <Box sx={{ textAlign: "center", pt: 4 }}>
            <Box component="img" src="/assets/instagram.png" alt="Instagram" sx={{ width: 42, height: 42, mx: 1 }} />
            <Box component="img" src="/assets/facebook.png" alt="Facebook" sx={{ width: 42, height: 42, mx: 1 }} />
          </Box>
        </Grid>


        {/* Right Section - Form */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              maxWidth: 550,
              mx: "auto",
              borderRadius: 2,
              backgroundColor: "#ffffff",
            }}
          >
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <PhoneField
                  name="phone"
                  label="Phone No"
                  value={formData.phone}
                  onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
                  errors={errors.phone}
                  required
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Email address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Your message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  placeholder="Write your question or message"
                  error={!!errors.message}
                  helperText={errors.message}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#388e3c",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "16px",
                  py: 0.8,
                  "&:hover": { backgroundColor: "#2e7d32" },
                }}
              >
                Contact
              </Button>
            </form>
          </Paper>
        </Grid>


      </Grid>
    </Box>
  );
};

export default ContactUs;
