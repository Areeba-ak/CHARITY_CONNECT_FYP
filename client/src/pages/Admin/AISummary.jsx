import { Typography, Alert, Box } from "@mui/material";

export default function AISummary({ story }) {
  const summary = story?.summary || "AI summary is not available.";

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        AI Generated Summary
      </Alert>

      <Typography>{summary}</Typography>
    </Box>
  );
}
