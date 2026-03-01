import { Typography, Box, Link, Divider, Button, ButtonGroup, Paper } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useState } from "react";

export default function OriginalStory({ story }) {
  const [expandedDoc, setExpandedDoc] = useState(null);

  if (!story) {
    return (
      <Box>
        <Typography>Loading story...</Typography>
      </Box>
    );
  }

  // Helper function to get the API base URL
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith("http")) return filePath;
    
    const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    
    // Extract category and filename from path
    // Path format: "uploads/stories/1770964209950.pdf"
    const parts = filePath.split("/");
    if (parts.length >= 3) {
      const category = parts[1]; // "stories", "cnic", etc.
      const filename = parts.slice(2).join("/"); // everything after category
      // Use the custom /api/files endpoint for better content delivery
      return `${apiBaseUrl}/api/files/${category}/${filename}`;
    }
    
    // Fallback to direct static serving
    return `${apiBaseUrl}/${filePath}`;
  };

  // Detect file type
  const getFileType = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext)) return "pdf";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)) return "office";
    if (["txt", "csv"].includes(ext)) return "text";
    return "file";
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return <DescriptionIcon />;
      case "image":
        return <ImageIcon />;
      default:
        return <InsertDriveFileIcon />;
    }
  };

  // Handle download with proper approach to avoid IDM
  const handleDownload = async (fileUrl, fileName) => {
    try {
      // Fetch the file as a blob to avoid IDM detection
      const response = await fetch(fileUrl, {
        headers: {
          'Accept': '*/*',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob
      const blob = await response.blob();

      // Create a blob URL and download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || 'download';
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700}>
        {story.title}
      </Typography>

      <Typography sx={{ mt: 2, mb: 3 }}>
        {story.description}
      </Typography>

      {/* Supporting Documents Section */}
      {story.supportingDocuments && story.supportingDocuments.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
            Supporting Documents
          </Typography>

          {/* Documents List with Preview Toggle */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {story.supportingDocuments.map((doc, idx) => {
              const fileName = doc.split("/").pop() || `Document ${idx + 1}`;
              const fileUrl = getFileUrl(doc);
              const fileType = getFileType(fileName);
              const itemId = `doc-${idx}`;
              const isExpanded = expandedDoc === itemId;

              return (
                <Box key={idx}>
                  {/* Document Header with Preview Toggle and Download */}
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#f9f9f9",
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                      {getFileIcon(fileType)}
                      <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: "break-word" }}>
                        {fileName}
                      </Typography>
                    </Box>

                    <ButtonGroup variant="outlined" size="small">
                      {(fileType === "pdf" || fileType === "image") && (
                        <Button
                          onClick={() => setExpandedDoc(isExpanded ? null : itemId)}
                          sx={{ textTransform: "none" }}
                        >
                          {isExpanded ? "Hide" : "View"}
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDownload(fileUrl, fileName)}
                        sx={{
                          textTransform: "none",
                          color: "primary.main",
                          borderColor: "primary.main",
                          "&:hover": { borderColor: "primary.dark" },
                        }}
                        startIcon={<FileDownloadIcon fontSize="small" />}
                      >
                        Download
                      </Button>
                    </ButtonGroup>
                  </Paper>

                  {/* Document Preview */}
                  {isExpanded && (
                    <Paper
                      sx={{
                        mt: 1,
                        p: 2,
                        backgroundColor: "#fff",
                        borderRadius: 1,
                        border: "1px solid #e0e0e0",
                        maxHeight: "600px",
                        overflow: "auto",
                      }}
                    >
                      {fileType === "pdf" && (
                        <iframe
                          src={`${fileUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                          width="100%"
                          height="500px"
                          style={{ border: "none", borderRadius: "4px" }}
                          title={`Preview of ${fileName}`}
                        />
                      )}

                      {fileType === "image" && (
                        <Box
                          component="img"
                          src={fileUrl}
                          alt={fileName}
                          sx={{
                            maxWidth: "100%",
                            height: "auto",
                            borderRadius: "4px",
                            maxHeight: "500px",
                          }}
                        />
                      )}

                      {!["pdf", "image"].includes(fileType) && (
                        <Typography variant="body2" color="text.secondary">
                          Preview not available for this file type. Please download to view.
                        </Typography>
                      )}
                    </Paper>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}
