const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload"); // multer for CNIC
const { register, login, adminLogin } = require("../controllers/authController");

/* =========================
   NORMAL AUTH ROUTES
========================= */

router.post("/register/donor", register);
router.post("/register/needy", upload.single("cnicImage"), register);
router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", adminLogin);

/* =========================
   GOOGLE OAUTH ROUTES
========================= */

// Redirect to Google login
router.get("/google", (req, res, next) => {
  const role = req.query.role || "donor";
  passport.authenticate("google", { scope: ["profile", "email"], state: role })(req, res, next);
});

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      // If state carried a requested role (donor/needy), persist it
      const requestedRole = req.query && req.query.state;
      if (requestedRole && req.user && req.user.role !== requestedRole) {
        req.user.role = requestedRole;
        try {
          await req.user.save();
        } catch (e) {
          // ignore save errors
        }
      }

      // Generate JWT
      const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

      // Set HttpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
      });

      // Redirect frontend (prefer CLIENT_URL/FRONTEND_URL env)
      const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${clientUrl.replace(/\/$/, "")}/oauth-success`);
    } catch (err) {
      console.error('OAuth callback error:', err);
      res.status(500).send('OAuth callback error');
    }
  }
);

module.exports = router;
