const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const passport = require("passport");

// Load env variables
dotenv.config();

// Connect Database
connectDB();

// Initialize app
const app = express();

/* ======================
   PASSPORT CONFIG
====================== */
require("./config/passport"); // <-- VERY IMPORTANT
app.use(passport.initialize());

/* ======================
    MIDDLEWARE
====================== */
// CORS: allow frontend origin and credentials for cookie-based auth
const clientOrigin = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(
   cors({
      origin: clientOrigin,
      credentials: true
   })
);
app.use(helmet());
app.use(express.json());

/* ======================
   ROUTES
====================== */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/stories", require("./routes/storyRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));

/* ======================
   FILE SERVING ENDPOINTS
====================== */
// Add headers to prevent IDM/download manager interception
app.use((req, res, next) => {
  // Set headers for all responses to prevent IDM
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Content-Security-Policy', "default-src 'self'; object-src 'none';");
  next();
});

// Custom endpoint for viewing files with proper headers
app.get('/api/files/:category/*', (req, res) => {
  try {
    const category = req.params.category;
    const filePath = req.params[0];
    const fullPath = path.join(__dirname, 'uploads', category, filePath);

    // Security: prevent directory traversal
    const normalizedPath = path.normalize(fullPath);
    const uploadsDir = path.normalize(path.join(__dirname, 'uploads'));
    if (!normalizedPath.startsWith(uploadsDir)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if file exists
    if (!require('fs').existsSync(normalizedPath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set headers for inline viewing (prevents IDM interception)
    const ext = path.extname(normalizedPath).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.txt': 'text/plain',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };

    // CRITICAL: Use inline disposition without filename to prevent IDM detection
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream; charset=utf-8');
    res.setHeader('Content-Disposition', `inline`);
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-Requested-With', 'XMLHttpRequest');
    
    // Total file size for proper streaming
    const fs = require('fs');
    const stat = fs.statSync(normalizedPath);
    const fileSize = stat.size;

    // Handle range requests (for seeking in videos/PDFs)
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Content-Disposition': 'inline',
        'X-Content-Type-Options': 'nosniff',
        'X-Download-Options': 'noopen'
      });

      fs.createReadStream(normalizedPath, { start, end }).pipe(res);
    } else {
      res.setHeader('Content-Length', fileSize);
      fs.createReadStream(normalizedPath).pipe(res);
    }
  } catch (err) {
    console.error('File serving error:', err);
    res.status(500).json({ message: 'Error serving file' });
  }
});

// Serve static files from uploads folder with proper headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath, stat) => {
    // Set headers to allow inline viewing instead of forcing download
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.txt': 'text/plain',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };

    if (mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext]);
    }
    // CRITICAL: Use inline disposition to prevent download managers from triggering
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Download-Options', 'noopen');
  }
}));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

/* ======================
   PRODUCTION FRONTEND
====================== */
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "..", "client", "build");
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

module.exports = app;
