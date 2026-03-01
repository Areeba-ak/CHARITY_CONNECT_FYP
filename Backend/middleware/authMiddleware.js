const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes (authenticated users only)
const protect = async (req, res, next) => {
  let token;

  // Check for Authorization header and Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no Authorization header, try to read cookie header (simple parser)
  if (!token && req.headers && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').map(c => c.trim());
    for (const c of cookies) {
      if (c.startsWith('token=')) {
        token = c.split('=')[1];
        break;
      }
      if (c.startsWith('jwt=')) {
        token = c.split('=')[1];
        break;
      }
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request, excluding password
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Admin access denied' });
  }
};

module.exports = { protect, adminOnly };
