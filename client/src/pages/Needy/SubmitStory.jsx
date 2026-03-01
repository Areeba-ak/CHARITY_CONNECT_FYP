import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
} from "@mui/material";

const steps = ["Personal Information", "Story Details", "Supporting Documents"];

const SubmitStory = () => {
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    storyDetails: "",
    files: [],
  });

  // Prefill from backend where available
  useEffect(() => {
    let mounted = true;
    import("../../services/auth").then(({ getMe }) => {
      getMe()
        .then((me) => {
          if (!mounted || !me) return;
          setFormData((prev) => ({
            ...prev,
            firstName: me.firstName || prev.firstName,
            lastName: me.lastName || prev.lastName,
            gender: me.gender || prev.gender,
            dob: me.dob ? (me.dob.includes("T") ? me.dob.split("T")[0] : me.dob) : prev.dob,
            email: me.email || prev.email,
            phone: me.phone || prev.phone,
            address: me.address || prev.address,
            city: me.city || prev.city,
          }));
        })
        .catch(() => {});
    });
    return () => (mounted = false);
  }, []);

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: Array.from(e.target.files) });
  };

  // Validate current step when clicking Next/Submit
  const validateStep = (step) => {
    let tempErrors = {};

    if (step === 0) {
      if (!formData.firstName) tempErrors.firstName = "First Name is required";
      if (!formData.lastName) tempErrors.lastName = "Last Name is required";
      if (!formData.email) tempErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        tempErrors.email = "Email is invalid";
      if (!formData.dob) tempErrors.dob = "Date of Birth is required";
      if (!formData.gender) tempErrors.gender = "Gender is required";
      if (!formData.phone) tempErrors.phone = "Phone number is required";
      else if (!/^\d{10,15}$/.test(formData.phone))
        tempErrors.phone = "Phone number is invalid";
      if (!formData.address) tempErrors.address = "Address is required";
      if (!formData.city) tempErrors.city = "City is required";
    }

    if (step === 1) {
      const wordCount = formData.storyDetails.trim().split(/\s+/).filter(Boolean).length;
      if (!formData.storyDetails) tempErrors.storyDetails = "Story is required";
      else if (wordCount < 20)
        tempErrors.storyDetails = "Story must be at least 20 words";
    }

    if (step === 2) {
      if (!formData.files || formData.files.length === 0)
        tempErrors.files = "Please upload at least one document";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Submit handler with reset
  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      // Prepare FormData for multipart submission (includes supporting files)
      const title = formData.storyTitle
        ? formData.storyTitle
        : formData.storyDetails
            ? formData.storyDetails.trim().split(/\s+/).slice(0, 8).join(" ") + "..."
            : `Story by ${formData.firstName} ${formData.lastName}`;

      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", formData.storyDetails || "");
      fd.append("category", formData.category || "other");

      // Attach files (field name 'files' matches backend multer.array('files'))
      if (formData.files && formData.files.length > 0) {
        formData.files.forEach((f) => fd.append("files", f));
      }

      import("../../services/story").then(({ submitStory }) => {
        submitStory(fd)
          .then(() => alert("Story submitted successfully. Awaiting approval."))
          .catch((err) => alert(err.message || "Submission failed"));
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        gender: "",
        dob: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        storyDetails: "",
        files: [],
      });

      // Clear errors
      setErrors({});

      // Go back to first step
      setActiveStep(0);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="First Name"
                name="firstName"
                fullWidth
                required
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Last Name"
                name="lastName"
                fullWidth
                required
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Date of Birth"
                name="dob"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formData.dob}
                onChange={handleChange}
                error={!!errors.dob}
                helperText={errors.dob}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={!!errors.gender}>
                <Select
                  displayEmpty
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  renderValue={(selected) =>
                    selected ? selected : "Select Gender"
                  }
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
                <FormHelperText>{errors.gender}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Contact No"
                name="phone"
                type="tel"
                fullWidth
                required
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Address"
                name="address"
                fullWidth
                required
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="City"
                name="city"
                fullWidth
                required
                value={formData.city}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
          </Grid>
        );

          case 1: {
      const wordCount = formData.storyDetails
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

      return (
        <Box sx={{ mt: 2 }}>
<Grid container spacing={2} sx={{ mb: 1, width: "100%" }}>
  <Grid item xs={24} sm={12}>
    <TextField
      label="Story Title"
      name="storyTitle"
      fullWidth
      required
      value={formData.storyTitle}
      onChange={handleChange}
      error={!!errors.storyTitle}
      helperText={errors.storyTitle}
    />
  </Grid>

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth error={!!errors.category}>
      <Select
        displayEmpty
        name="category"
        value={formData.category}
        onChange={handleChange}
        renderValue={(selected) => (selected ? selected : "Select Category")}
      >
        <MenuItem value="education">Education</MenuItem>
        <MenuItem value="health">Health</MenuItem>
        <MenuItem value="women empowerment">Women Empowerment</MenuItem>
        <MenuItem value="other">Other</MenuItem>
      </Select>
      <FormHelperText>{errors.category}</FormHelperText>
    </FormControl>
  </Grid>
</Grid>



          {/* ORIGINAL STORY FIELD – UNTOUCHED */}
          <TextField
            label="Write Your Story Here..."
            name="storyDetails"
            multiline
            rows={6}
            fullWidth
            required
            value={formData.storyDetails}
            onChange={handleChange}
            error={!!errors.storyDetails}
            helperText={
              errors.storyDetails
                ? errors.storyDetails
                : `${wordCount} / 20 words`
            }
          />
        </Box>
      );
    }

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" component="label">
              Upload Supporting Documents
              <input
                type="file"
                hidden
                multiple
                onChange={handleFileChange}
              />
            </Button>
            {errors.files && (
              <Typography color="error" sx={{ mt: 1 }}>
                {errors.files}
              </Typography>
            )}
            {formData.files.length > 0 && (
              <Typography sx={{ mt: 1 }}>
                {formData.files.length} file(s) selected
              </Typography>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "80%", margin: "auto", mt: 5, mb: 5 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 700, textAlign: "center" }}
      >
        Story Submission Form
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 3, mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent(activeStep)}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }}>
        {activeStep > 0 && (
          <Button variant="outlined" onClick={handleBack}>
            Back
          </Button>
        )}

        {activeStep < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SubmitStory;