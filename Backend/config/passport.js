const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Ensure env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL must be the full absolute URL registered in Google Cloud Console
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        if (!email) return done(new Error('No email found in Google profile'));

        // Try to find existing user by email
        let user = await User.findOne({ email });

        // If no user, create a new one
        if (!user) {
          user = await User.create({
            firstName: (profile.name && profile.name.givenName) || '',
            lastName: (profile.name && profile.name.familyName) || '',
            email,
            password: null,
            role: 'donor',
            googleId: profile.id,
            avatar: (profile.photos && profile.photos[0] && profile.photos[0].value) || ''
          });
        } else {
          // Ensure googleId is stored
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
