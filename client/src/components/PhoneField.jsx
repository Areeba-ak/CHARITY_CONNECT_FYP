import React from "react";
import { TextField, Typography } from "@mui/material";

/**
 * Reusable Phone Field Component
 * Provides a standardized phone input field with validation
 * @param {string} value - The phone number value
 * @param {function} onChange - Callback when phone value changes
 * @param {object} errors - Object containing error messages
 * @param {boolean} required - Whether field is required
 * @param {string} label - Label for the field (default: "Phone Number")
 * @param {string} name - Field name attribute (code: Story Submission Form)
 */
export default function PhoneField({
  value,
  onChange,
  errors,
  required = true,
  label = "Phone Number",
  name = "phone",
  ...props
}) {
  const handleChange = (e) => {
    const input = e.target.value;
    // Allow only digits and basic formatting characters
    const sanitized = input.replace(/[^\d+\-\s()]/g, "");
    onChange(sanitized);
  };

  return (
    <>
      <TextField
        label={label}
        name={name}
        fullWidth
        required={required}
        value={value}
        onChange={handleChange}
        error={!!errors}
        helperText={errors}
        placeholder="+92 300 1234567"
        variant="outlined"
        {...props}
      />
    </>
  );
}
